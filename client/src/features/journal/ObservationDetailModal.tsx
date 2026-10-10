import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Leaf,
  Trash2,
  Edit2,
  ShieldAlert
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Observation } from '../../types';

interface ObservationDetailModalProps {
  observation: Observation | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: Observation) => void;
  onDelete: (id: string) => void;
}

export const ObservationDetailModal: React.FC<ObservationDetailModalProps> = ({
  observation,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Edit form state
  const [editName, setEditName] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editLocation, setEditLocation] = useState<string>('');

  React.useEffect(() => {
    if (observation) {
      setEditName(observation.name);
      setEditNotes(observation.notes);
      setEditLocation(observation.location || '');
      setIsEditing(false);
      setShowDeleteConfirm(false);
    }
  }, [observation]);

  if (!observation) return null;

  const handleSaveEdit = () => {
    onUpdate({
      ...observation,
      name: editName.trim() || observation.name,
      notes: editNotes.trim(),
      location: editLocation.trim() || undefined
    });
    setIsEditing(false);
  };

  const handleDeleteConfirmed = () => {
    onDelete(observation.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Observation' : observation.name}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Specimen Photo */}
        {observation.photo ? (
          <div className="rounded-2xl overflow-hidden bg-charcoal aspect-[16/10] relative shadow-sm">
            <img
              src={observation.photo}
              alt={observation.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge category={observation.category} />
              {observation.confidence && <Badge confidence={observation.confidence} />}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-sage-light/60 p-6 flex items-center justify-center text-forest">
            <Leaf className="w-12 h-12" />
          </div>
        )}

        {/* Delete Confirmation Warning */}
        {showDeleteConfirm ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-3">
            <div className="font-bold text-sm">Delete this observation?</div>
            <p className="text-xs text-rose-800">
              This will remove this record and its photo permanently from your offline journal. This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="danger" onClick={handleDeleteConfirmed}>
                Confirm Delete
              </Button>
            </div>
          </div>
        ) : isEditing ? (
          /* Edit Form */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Specimen Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-sage-border focus:ring-2 focus:ring-forest bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Notes</label>
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-sage-border focus:ring-2 focus:ring-forest bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Location</label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                placeholder="e.g. Backyard, City Park"
                className="w-full px-3 py-2 text-sm rounded-xl border border-sage-border focus:ring-2 focus:ring-forest bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div className="space-y-5">
            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between text-xs text-charcoal-muted gap-2 pb-3 border-b border-sage-border">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-forest" />
                <span>{new Date(observation.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
              {observation.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-terracotta" />
                  <span>{observation.location}</span>
                </div>
              )}
              {observation.identifiedBy && (
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-sage-light text-forest-dark">
                  {observation.identifiedBy}
                </span>
              )}
            </div>

            {/* Field Notes */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">Observation Notes</h4>
              <p className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap">
                {observation.notes || 'No notes added for this specimen.'}
              </p>
            </div>

            {/* Key Visible Features if AI identified */}
            {observation.visibleFeatures && observation.visibleFeatures.length > 0 && (
              <div className="space-y-1.5 p-3.5 rounded-xl bg-sage-light/60 border border-sage-border text-xs">
                <h4 className="font-bold uppercase tracking-wider text-forest-dark">Observed Features</h4>
                <ul className="space-y-1">
                  {observation.visibleFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safety Note if present */}
            {observation.safetyNote && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span><strong>Safety:</strong> {observation.safetyNote}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-sage-border">
              <Button
                variant="ghost"
                size="sm"
                icon={<Trash2 className="w-4 h-4 text-rose-700" />}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Edit2 className="w-4 h-4" />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Details
                </Button>
                <Button variant="primary" size="sm" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
