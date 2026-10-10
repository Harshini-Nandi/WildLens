import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  AlertCircle,
  BookmarkPlus,
  CheckCircle,
  HelpCircle,
  Trash2,
  Cpu,
  Info,
  MapPin,
  Leaf,
  Flower2,
  Bird,
  Bug
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { compressImage } from '../../utils/imageCompressor';
import { identifyNatureSpecimen } from '../../services/api';
import { IdentificationResult, NatureCategory, Observation, OllamaHealth } from '../../types';
import { CameraCaptureModal } from './CameraCaptureModal';

interface ImageIdentifierProps {
  onSaveToJournal: (observation: Observation) => void;
  onOpenSetupGuide: () => void;
  aiHealth: OllamaHealth | null;
}

// Built-in sample test images (clean SVG data URLs) to test without a camera immediately
const SAMPLE_TEST_SPECIMENS: Array<{
  name: string;
  category: NatureCategory;
  svgData: string;
}> = [
  {
    name: 'English Oak Leaf',
    category: 'leaf',
    svgData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23dce8d5"/><path d="M200 40 C160 80 150 120 180 150 C140 180 160 220 200 260 C240 220 260 180 220 150 C250 120 240 80 200 40 Z" fill="%23245c45"/><line x1="200" y1="40" x2="200" y2="280" stroke="%23dce8d5" stroke-width="4"/></svg>'
  },
  {
    name: 'Wild Dandelion Bloom',
    category: 'flower',
    svgData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f7f5eb"/><circle cx="200" cy="140" r="50" fill="%23e19978"/><circle cx="200" cy="140" r="25" fill="%23c77b57"/><line x1="200" y1="190" x2="200" y2="280" stroke="%23245c45" stroke-width="8"/></svg>'
  },
  {
    name: 'Seven-Spot Ladybug',
    category: 'insect',
    svgData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23edf4ea"/><ellipse cx="200" cy="150" rx="60" ry="70" fill="%23c77b57"/><line x1="200" y1="80" x2="200" y2="220" stroke="%2326352c" stroke-width="4"/><circle cx="170" cy="130" r="8" fill="%2326352c"/><circle cx="230" cy="130" r="8" fill="%2326352c"/><circle cx="160" cy="170" r="8" fill="%2326352c"/><circle cx="240" cy="170" r="8" fill="%2326352c"/></svg>'
  }
];

export const ImageIdentifier: React.FC<ImageIdentifierProps> = ({
  onSaveToJournal,
  onOpenSetupGuide,
  aiHealth
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [category, setCategory] = useState<NatureCategory>('plant');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Journal form fields after identification
  const [customName, setCustomName] = useState<string>('');
  const [userNotes, setUserNotes] = useState<string>('');
  const [userLocation, setUserLocation] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleCameraCapture = (capturedDataUrl: string) => {
    setSelectedImage(capturedDataUrl);
    setError(null);
    setResult(null);
    setSavedSuccess(false);
  };

  const categories: Array<{ id: NatureCategory; label: string; icon: any }> = [
    { id: 'plant', label: 'Plant', icon: Leaf },
    { id: 'leaf', label: 'Leaf', icon: Leaf },
    { id: 'flower', label: 'Flower', icon: Flower2 },
    { id: 'bird', label: 'Bird', icon: Bird },
    { id: 'insect', label: 'Insect', icon: Bug },
    { id: 'other', label: 'Other', icon: HelpCircle }
  ];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);
    setSavedSuccess(false);

    try {
      const compressed = await compressImage(file);
      setSelectedImage(compressed);
    } catch (err: unknown) {
      setError('Could not process image. Please try another file.');
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_TEST_SPECIMENS[0]) => {
    setSelectedImage(sample.svgData);
    setCategory(sample.category);
    setError(null);
    setResult(null);
    setSavedSuccess(false);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const data = await identifyNatureSpecimen(selectedImage, category, true);
      setResult(data);
      setCustomName(data.suggestedName);
      setUserNotes('');
    } catch (err: unknown) {
      const errorMsg = (err as Error).message || 'Failed to analyze specimen';
      setError(errorMsg);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveObservation = () => {
    if (!selectedImage || !result) return;

    const newObservation: Observation = {
      id: `obs-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: customName.trim() || result.suggestedName,
      category: result.category,
      date: new Date().toISOString(),
      photo: selectedImage,
      notes: userNotes.trim() || result.explanation,
      location: userLocation.trim() || undefined,
      visibleFeatures: result.visibleFeatures,
      explanation: result.explanation,
      confidence: result.confidence,
      safetyNote: result.safetyNote,
      identifiedBy: result.modelUsed || (result.isSimulation ? 'Demo Simulation' : 'Ollama')
    };

    onSaveToJournal(newObservation);
    setSavedSuccess(true);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    setSavedSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const isLocalAiConnected = aiHealth?.status === 'connected' && aiHealth.visionModelFound;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-forest-dark uppercase tracking-wider mb-1">
          <Camera className="w-3.5 h-3.5 text-forest" />
          <span>Local Vision AI Inference</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
          Nature Specimen Identifier
        </h1>
        <p className="text-sm text-charcoal-muted mt-1">
          Photograph leaves, wildflowers, insects, or birds. Analyzed on your device via open-weight vision models.
        </p>
      </div>

      {/* Model Runtime Status Callout */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
        isLocalAiConnected
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
          : 'bg-amber-50 border-amber-200 text-amber-950'
      }`}>
        <div className="flex items-center gap-2">
          <Cpu className={`w-4 h-4 shrink-0 ${isLocalAiConnected ? 'text-emerald-700' : 'text-amber-700'}`} />
          <span>
            {isLocalAiConnected ? (
              <>
                <strong>Local Ollama Active:</strong> Using vision model <code>{aiHealth?.configuredVisionModel}</code>.
              </>
            ) : (
              <>
                <strong>Demo Mode:</strong> Ollama runtime offline. Showing botanical demonstration samples.
              </>
            )}
          </span>
        </div>
        <button
          onClick={onOpenSetupGuide}
          className="text-forest hover:text-forest-dark underline font-semibold shrink-0 ml-2"
        >
          Setup Guide
        </button>
      </div>

      {/* Category Selection Tabs */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
          1. Select Category Hint
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-forest text-cream border-forest shadow-sm'
                    : 'bg-white border-sage-border/80 text-charcoal hover:bg-sage-light'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-sage' : 'text-forest'}`} />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Image Capture / Upload Area */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
          2. Capture or Upload Photo
        </label>

        {/* Hidden inputs */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />

        {!selectedImage ? (
          <div className="border-2 border-dashed border-sage-border rounded-2xl p-8 bg-white text-center space-y-4 hover:border-forest/50 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-sage-light text-forest mx-auto flex items-center justify-center">
              <Camera className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-base text-charcoal">Take or Upload a Nature Photo</h3>
              <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                Snap leaves, tree bark, flower petals, or birds outdoors. Clear lighting yields the best botanical results.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                icon={<Camera className="w-4 h-4" />}
                onClick={() => setShowCameraModal(true)}
              >
                Snap with Camera
              </Button>
              <Button
                variant="outline"
                icon={<Upload className="w-4 h-4" />}
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Photo
              </Button>
            </div>

            {/* Quick Test Samples */}
            <div className="pt-4 border-t border-sage-border/50">
              <span className="text-[11px] text-charcoal-muted block mb-2">
                Or test instantly with a nature sample:
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {SAMPLE_TEST_SPECIMENS.map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-sage-light hover:bg-sage border border-sage-border text-forest-dark font-medium transition-colors"
                  >
                    🌱 {sample.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Image Preview and Analysis CTA */
          <Card className="overflow-hidden p-0">
            <div className="relative aspect-[16/10] sm:aspect-[2/1] bg-charcoal">
              <img
                src={selectedImage}
                alt="Selected specimen"
                className="w-full h-full object-contain"
              />
              <button
                onClick={handleReset}
                className="absolute top-3 right-3 p-2 bg-charcoal/70 hover:bg-charcoal text-cream rounded-full transition-colors backdrop-blur-sm"
                title="Remove photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-cream-light flex flex-wrap items-center justify-between gap-3 border-t border-sage-border">
              <div className="flex items-center gap-2">
                <Badge category={category} />
                <span className="text-xs text-charcoal-muted">Photo ready for analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Camera className="w-3.5 h-3.5" />}
                  onClick={() => setShowCameraModal(true)}
                >
                  Retake Photo
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                >
                  Clear
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  loading={analyzing}
                  icon={<Sparkles className="w-4 h-4" />}
                  onClick={handleAnalyze}
                >
                  Analyze with AI
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold">Identification Notice</h4>
            <p className="mt-0.5">{error}</p>
          </div>
          <Button size="sm" variant="outline" onClick={handleAnalyze}>
            Retry
          </Button>
        </div>
      )}

      {/* Analysis Result Card */}
      {result && (
        <Card variant="default" className="p-6 space-y-6 animate-in slide-in-from-bottom-3 duration-200">
          {/* Header & Identification Name */}
          <div className="border-b border-sage-border/60 pb-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge category={result.category} />
                <Badge confidence={result.confidence} />
              </div>
              <span className="text-[11px] text-charcoal-muted font-mono px-2 py-0.5 rounded bg-cream border border-sage-border">
                {result.modelUsed || 'AI Suggestion'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
              {result.suggestedName}
            </h2>

            {result.isSimulation && (
              <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                ⚠️ <strong>Demonstration Result:</strong> Local Ollama runtime was not active during this test. Sample botanical data displayed.
              </p>
            )}
          </div>

          {/* Visible Characteristics List */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal">
              Key Visible Characteristics
            </h4>
            <ul className="space-y-1.5">
              {result.visibleFeatures.map((feat, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-charcoal flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Botanical / Ecological Context */}
          <div className="space-y-1.5 p-4 rounded-xl bg-sage-light/60 border border-sage-border">
            <h4 className="font-bold text-xs uppercase tracking-wider text-forest-dark">
              Field Notes & Natural Context
            </h4>
            <p className="text-xs sm:text-sm text-charcoal leading-relaxed">
              {result.explanation}
            </p>
          </div>

          {/* Safe Observation Tip */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Outdoor Safety Caution:</strong> {result.safetyNote}
            </div>
          </div>

          {/* Save to Nature Journal Section */}
          <div className="pt-4 border-t border-sage-border space-y-4">
            <h4 className="font-bold text-sm text-charcoal flex items-center gap-1.5">
              <BookmarkPlus className="w-4 h-4 text-forest" />
              Save to Nature Journal
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-charcoal-muted mb-1">
                  Specimen Name (or edit suggested title)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-sage-border focus:outline-none focus:ring-2 focus:ring-forest bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal-muted mb-1">
                  Your Field Notes (optional)
                </label>
                <textarea
                  rows={2}
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="Where did you spot it? Weather, nearby trees, or personal reflections..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-sage-border focus:outline-none focus:ring-2 focus:ring-forest bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal-muted mb-1">
                  Location (optional - manual entry only)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    placeholder="e.g. Oak Ridge Park, Back Garden, West Meadow"
                    className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-sage-border focus:outline-none focus:ring-2 focus:ring-forest bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSuccess ? (
                <div className="text-emerald-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Saved to your digital Nature Journal!
                </div>
              ) : (
                <div className="text-[11px] text-charcoal-muted">
                  Persisted privately in browser IndexedDB.
                </div>
              )}

              <Button
                variant={savedSuccess ? 'secondary' : 'primary'}
                icon={savedSuccess ? <CheckCircle className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                onClick={handleSaveObservation}
              >
                {savedSuccess ? 'Saved Entry' : 'Save Entry'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Live Camera Viewfinder Modal */}
      <CameraCaptureModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={handleCameraCapture}
        onFallbackToFilePicker={() => fileInputRef.current?.click()}
      />
    </div>
  );
};
