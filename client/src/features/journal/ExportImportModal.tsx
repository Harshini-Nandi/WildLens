import React, { useState } from 'react';
import { Download, Upload, Check, AlertCircle } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { exportAllData, importAllData } from '../../db/indexedDb';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  onDataChanged
}) => {
  const [exporting, setExporting] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = async () => {
    setExporting(true);
    setStatusMessage(null);
    try {
      const json = await exportAllData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wildbuddy-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMessage({ type: 'success', text: 'Backup downloaded successfully.' });
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: 'Failed to export backup: ' + (err as Error).message });
    } finally {
      setExporting(false);
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setStatusMessage(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const result = await importAllData(text);
        if (result.success) {
          setStatusMessage({ type: 'success', text: result.message });
          onDataChanged();
        } else {
          setStatusMessage({ type: 'error', text: result.message });
        }
      } catch (err: unknown) {
        setStatusMessage({ type: 'error', text: 'File read error: ' + (err as Error).message });
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Backup & Restore Journal" maxWidth="md">
      <div className="space-y-6 text-sm text-charcoal">
        <p className="text-xs text-charcoal-muted leading-relaxed">
          Because WildBuddy stores all observations in your browser's private offline database, you can export your records at any time to preserve them or transfer to another device.
        </p>

        {/* Status Alert */}
        {statusMessage && (
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            {statusMessage.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Export Card */}
        <div className="p-4 rounded-xl bg-sage-light/60 border border-sage-border space-y-3">
          <div className="flex items-center gap-2 font-bold text-forest-dark text-xs uppercase tracking-wider">
            <Download className="w-4 h-4 text-forest" />
            <span>Export Digital Journal</span>
          </div>
          <p className="text-xs text-charcoal-muted">
            Download your nature observations, photos, and adventure logs as a single JSON backup.
          </p>
          <Button
            size="sm"
            variant="primary"
            loading={exporting}
            onClick={handleExport}
            icon={<Download className="w-4 h-4" />}
          >
            Download Backup JSON
          </Button>
        </div>

        {/* Import Card */}
        <div className="p-4 rounded-xl bg-white border border-sage-border space-y-3">
          <div className="flex items-center gap-2 font-bold text-charcoal text-xs uppercase tracking-wider">
            <Upload className="w-4 h-4 text-terracotta" />
            <span>Restore from Backup</span>
          </div>
          <p className="text-xs text-charcoal-muted">
            Restore a previously exported <code>.json</code> file into this device.
          </p>
          <label className="inline-block cursor-pointer">
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileImport}
              disabled={importing}
            />
            <Button
              size="sm"
              variant="outline"
              loading={importing}
              icon={<Upload className="w-4 h-4" />}
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.parentElement?.querySelector('input');
                input?.click();
              }}
            >
              Choose Backup File
            </Button>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
