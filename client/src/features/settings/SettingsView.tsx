import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  RefreshCw,
  Trash2,
  ShieldCheck,
  HardDrive,
  Clock,
  Check
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { saveOllamaConfig } from '../../services/api';
import { OllamaHealth, UserSettings } from '../../types';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onClearAllData: () => Promise<void>;
  aiHealth: OllamaHealth | null;
  onRefreshHealth: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onClearAllData,
  aiHealth,
  onRefreshHealth
}) => {
  const [dailyGoal, setDailyGoal] = useState<number>(settings.dailyOutdoorGoalMinutes || 30);
  const [preferredDuration, setPreferredDuration] = useState<15 | 30 | 60>(settings.preferredAdventureDuration || 30);
  const [accessibility, setAccessibility] = useState<string>(settings.accessibilityPreference || '');
  const [ollamaHost, setOllamaHost] = useState<string>(settings.ollamaHost || 'http://127.0.0.1:11434');
  const [visionModel, setVisionModel] = useState<string>(settings.ollamaVisionModel || 'gemma3');
  const [textModel, setTextModel] = useState<string>(settings.ollamaTextModel || 'gemma3');

  const [savingConfig, setSavingConfig] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [refreshingHealth, setRefreshingHealth] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [clearing, setClearing] = useState<boolean>(false);

  const handleSavePreferences = () => {
    const updated: UserSettings = {
      ...settings,
      dailyOutdoorGoalMinutes: Number(dailyGoal) || 30,
      preferredAdventureDuration: preferredDuration,
      accessibilityPreference: accessibility.trim(),
      ollamaHost: ollamaHost.trim(),
      ollamaVisionModel: visionModel.trim(),
      ollamaTextModel: textModel.trim()
    };
    onUpdateSettings(updated);
    setSavedNotice('Preferences saved successfully!');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleSaveAiConfig = async () => {
    setSavingConfig(true);
    try {
      await saveOllamaConfig(ollamaHost.trim(), visionModel.trim(), textModel.trim());
      handleSavePreferences();
      await onRefreshHealth();
      setSavedNotice('AI configuration updated!');
    } catch {
      setSavedNotice('Failed to update server configuration.');
    } finally {
      setSavingConfig(false);
      setTimeout(() => setSavedNotice(null), 3000);
    }
  };

  const handleRefresh = async () => {
    setRefreshingHealth(true);
    await onRefreshHealth();
    setRefreshingHealth(false);
  };

  const handleConfirmClear = async () => {
    setClearing(true);
    await onClearAllData();
    setClearing(false);
    setShowClearConfirm(false);
  };

  const isConnected = aiHealth?.status === 'connected';

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-forest-dark uppercase tracking-wider mb-1">
          <Settings className="w-3.5 h-3.5 text-forest" />
          <span>App Preferences & Runtime</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
          Settings & Diagnostics
        </h1>
        <p className="text-sm text-charcoal-muted mt-1">
          Configure outdoor targets, manage local open-weight AI, and inspect offline storage.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Outdoor Preferences Card */}
      <Card className="p-6 space-y-5 bg-white">
        <h3 className="font-bold text-base text-charcoal flex items-center gap-2">
          <Clock className="w-4 h-4 text-forest" />
          Outdoor Exploration Goals
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-charcoal">
              Daily Outdoor Target (minutes)
            </label>
            <input
              type="number"
              min="5"
              max="240"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(Math.max(5, parseInt(e.target.value) || 30))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-sage-border focus:ring-2 focus:ring-forest bg-white"
            />
            <span className="text-[11px] text-charcoal-muted">
              Displayed on home screen progress bar.
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-charcoal">
              Preferred Adventure Duration
            </label>
            <select
              value={preferredDuration}
              onChange={(e) => setPreferredDuration(Number(e.target.value) as 15 | 30 | 60)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-sage-border focus:ring-2 focus:ring-forest bg-white"
            >
              <option value={15}>15 Minutes (Quick stroll)</option>
              <option value={30}>30 Minutes (Standard exploration)</option>
              <option value={60}>60 Minutes (Deep nature immersion)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-charcoal">
            Mobility & Accessibility Preferences
          </label>
          <input
            type="text"
            value={accessibility}
            onChange={(e) => setAccessibility(e.target.value)}
            placeholder="e.g. Wheelchair accessible, paved paths only, bench-resting intervals"
            className="w-full px-3 py-2 text-sm rounded-xl border border-sage-border focus:ring-2 focus:ring-forest bg-white"
          />
          <span className="text-[11px] text-charcoal-muted">
            Included in outdoor mission generation.
          </span>
        </div>

        <div className="flex justify-end pt-2">
          <Button size="sm" variant="primary" onClick={handleSavePreferences}>
            Save Goals
          </Button>
        </div>
      </Card>

      {/* Local Ollama Open-Source AI Configuration Card */}
      <Card className="p-6 space-y-5 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-charcoal flex items-center gap-2">
            <Cpu className="w-4 h-4 text-forest" />
            Local Open-Weight AI Runtime (Ollama)
          </h3>
          <Button
            size="sm"
            variant="outline"
            loading={refreshingHealth}
            onClick={handleRefresh}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Check Status
          </Button>
        </div>

        {/* Status Callout */}
        <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
          isConnected
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}>
          <div className="flex items-center justify-between font-bold">
            <span>Ollama Connection: {isConnected ? 'Connected' : 'Offline / Unreachable'}</span>
            <span className="font-mono text-[11px]">{aiHealth?.version ? `v${aiHealth.version}` : ''}</span>
          </div>
          <p className="text-charcoal-muted">
            {aiHealth?.message}
          </p>
          {isConnected && aiHealth?.availableModels && (
            <div className="pt-1.5">
              <span className="font-semibold">Installed Models on Machine: </span>
              {aiHealth.availableModels.length > 0 ? (
                <span className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-sage-border ml-1">
                  {aiHealth.availableModels.join(', ')}
                </span>
              ) : (
                <span className="italic text-charcoal-muted">None detected yet. Run <code>ollama pull {visionModel}</code>.</span>
              )}
            </div>
          )}
        </div>

        {/* Model Configurations */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-charcoal">
              Ollama Host Endpoint
            </label>
            <input
              type="text"
              value={ollamaHost}
              onChange={(e) => setOllamaHost(e.target.value)}
              placeholder="http://127.0.0.1:11434"
              className="w-full px-3 py-2 text-sm rounded-xl border border-sage-border focus:ring-2 focus:ring-forest bg-white font-mono"
            />
            <span className="text-[11px] text-charcoal-muted">
              Default local Ollama address is <code>http://127.0.0.1:11434</code>.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-charcoal">
                Vision Model (Nature Identification)
              </label>
              <input
                type="text"
                value={visionModel}
                onChange={(e) => setVisionModel(e.target.value)}
                placeholder="gemma3"
                className="w-full px-3 py-2 text-sm rounded-xl border border-sage-border focus:ring-2 focus:ring-forest bg-white font-mono"
              />
              <span className="text-[11px] text-charcoal-muted">
                e.g. <code>gemma3</code>, <code>llava</code>, <code>moondream</code>
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-charcoal">
                Text Model (Missions & Challenges)
              </label>
              <input
                type="text"
                value={textModel}
                onChange={(e) => setTextModel(e.target.value)}
                placeholder="gemma3"
                className="w-full px-3 py-2 text-sm rounded-xl border border-sage-border focus:ring-2 focus:ring-forest bg-white font-mono"
              />
              <span className="text-[11px] text-charcoal-muted">
                e.g. <code>gemma3</code>, <code>llama3.2</code>, <code>mistral</code>
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              size="sm"
              variant="primary"
              loading={savingConfig}
              onClick={handleSaveAiConfig}
            >
              Update AI Runtime
            </Button>
          </div>
        </div>
      </Card>

      {/* Offline PWA & Storage Architecture Card */}
      <Card variant="sage" className="p-6 space-y-3">
        <h3 className="font-bold text-base text-forest-dark flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-forest" />
          Offline-First PWA Architecture
        </h3>
        <p className="text-xs sm:text-sm text-charcoal leading-relaxed">
          <strong>Application Shell:</strong> Cached by the Service Worker for offline launch.<br />
          <strong>Nature Journal & Data:</strong> Stored locally using IndexedDB in your browser sandbox.<br />
          <strong>AI Models:</strong> Run locally through your Ollama daemon on your device. Once pulled, no internet connection is required to classify images or generate challenges.
        </p>
      </Card>

      {/* Privacy and Local Guarantee */}
      <Card className="p-6 space-y-3 bg-white">
        <h3 className="font-bold text-base text-charcoal flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-forest" />
          Privacy & Data Sovereignty
        </h3>
        <ul className="text-xs text-charcoal-muted space-y-2 list-disc list-inside leading-relaxed">
          <li>No accounts, passwords, or personal email addresses required.</li>
          <li>Photographs remain on your local machine and are never uploaded to any cloud AI provider.</li>
          <li>Locations are strictly optional and entered manually by you.</li>
          <li>Clearing your browser cache or site data will remove your local IndexedDB entries; use the Export feature in your journal regularly.</li>
        </ul>
      </Card>

      {/* Clear Local Data */}
      <Card className="p-6 space-y-3 border-rose-200 bg-rose-50/40">
        <div className="flex items-center gap-2 font-bold text-sm text-rose-900">
          <Trash2 className="w-4 h-4 text-rose-700" />
          <span>Reset All Local Data</span>
        </div>
        <p className="text-xs text-rose-800 leading-relaxed">
          Permanently delete all observations, photos, adventure logs, and achievements from IndexedDB on this browser.
        </p>

        {showClearConfirm ? (
          <div className="p-3 rounded-xl bg-white border border-rose-300 space-y-3">
            <p className="text-xs font-bold text-rose-900">
              Are you sure? This cannot be undone. Make sure you have exported your backup.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="danger" loading={clearing} onClick={handleConfirmClear}>
                Yes, Delete Everything
              </Button>
            </div>
          </div>
        ) : (
          <Button
            size="sm"
            variant="danger"
            onClick={() => setShowClearConfirm(true)}
          >
            Clear All Local Records
          </Button>
        )}
      </Card>
    </div>
  );
};
