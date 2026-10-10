import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Check, Copy, Terminal, ExternalLink, RefreshCw, Cpu, ShieldCheck } from 'lucide-react';
import { OllamaHealth } from '../../types';

interface OllamaSetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiHealth: OllamaHealth | null;
  onRefreshHealth: () => Promise<void>;
}

export const OllamaSetupGuideModal: React.FC<OllamaSetupGuideModalProps> = ({
  isOpen,
  onClose,
  aiHealth,
  onRefreshHealth
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const visionModel = aiHealth?.configuredVisionModel || 'gemma3';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(label);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefreshHealth();
    setRefreshing(false);
  };

  const isConnected = aiHealth?.status === 'connected';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Open-Weight Local AI Setup" maxWidth="lg">
      <div className="space-y-5 text-sm text-charcoal">
        {/* Status Callout */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          isConnected
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}>
          <Cpu className={`w-5 h-5 shrink-0 mt-0.5 ${isConnected ? 'text-emerald-700' : 'text-amber-700'}`} />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">
              Current Status: {isConnected ? 'Ollama Service Connected' : 'Ollama Offline / Demo Mode'}
            </h4>
            <p className="text-xs mt-1 text-charcoal-muted">
              {aiHealth?.message || 'WildBuddy connects to your local Ollama instance without sending any data to the cloud.'}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            loading={refreshing}
            onClick={handleRefresh}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Check
          </Button>
        </div>

        {/* Core Value Proposition */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sage-light/60 border border-sage-border text-forest-dark text-xs">
          <ShieldCheck className="w-5 h-5 text-forest shrink-0 mt-0.5" />
          <p>
            <strong>Private & 100% Free:</strong> Your nature photos stay on your personal device.
            Once you download your open-weight model with Ollama, you can identify specimens in deep forests without cellular coverage.
          </p>
        </div>

        {/* Step by step guide */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm text-charcoal flex items-center gap-2">
            <Terminal className="w-4 h-4 text-forest" />
            Quick Setup (3 Steps)
          </h4>

          {/* Step 1 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>1. Download & Install Ollama</span>
              <a
                href="https://ollama.com"
                target="_blank"
                rel="noreferrer"
                className="text-forest hover:underline flex items-center gap-1"
              >
                ollama.com <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-charcoal-muted">
              Download Ollama for Windows, macOS, or Linux. It provides a lightweight local model engine.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>2. Pull the Vision Model for Nature Identification</span>
              <button
                onClick={() => copyToClipboard(`ollama pull ${visionModel}`, 'pullVision')}
                className="text-forest text-xs flex items-center gap-1 hover:underline"
              >
                {copiedCmd === 'pullVision' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedCmd === 'pullVision' ? 'Copied' : 'Copy command'}
              </button>
            </div>
            <div className="bg-charcoal text-cream font-mono text-xs px-3 py-2 rounded-lg flex items-center justify-between">
              <code>ollama pull {visionModel}</code>
            </div>
            <p className="text-[11px] text-charcoal-muted">
              Recommended: <code>gemma3</code> (Google's multimodal model) or <code>llava</code> / <code>moondream</code> for smaller VRAM.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>3. Start the Ollama Service</span>
              <button
                onClick={() => copyToClipboard('ollama serve', 'serve')}
                className="text-forest text-xs flex items-center gap-1 hover:underline"
              >
                {copiedCmd === 'serve' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedCmd === 'serve' ? 'Copied' : 'Copy command'}
              </button>
            </div>
            <div className="bg-charcoal text-cream font-mono text-xs px-3 py-2 rounded-lg">
              <code>ollama serve</code>
            </div>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="pt-2 border-t border-sage-border/50 text-xs text-charcoal-muted">
          💡 <strong>Can't run Ollama right now?</strong> No problem! WildBuddy includes a built-in <strong>demonstration simulation mode</strong> and an <strong>offline deterministic mission engine</strong> so you can test all features immediately.
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" onClick={onClose}>
            Got It, Let's Explore
          </Button>
        </div>
      </div>
    </Modal>
  );
};
