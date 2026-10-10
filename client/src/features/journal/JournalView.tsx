import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Grid,
  List,
  Download,
  Calendar,
  MapPin,
  Leaf,
  Flower2,
  Bird,
  Bug,
  Camera
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ObservationDetailModal } from './ObservationDetailModal';
import { ExportImportModal } from './ExportImportModal';
import { ActiveTab, NatureCategory, Observation } from '../../types';

interface JournalViewProps {
  observations: Observation[];
  onUpdateObservation: (updated: Observation) => void;
  onDeleteObservation: (id: string) => void;
  onNavigate: (tab: ActiveTab) => void;
  onRefreshData: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  observations,
  onUpdateObservation,
  onDeleteObservation,
  onNavigate,
  onRefreshData
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<NatureCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');
  const [activeObservation, setActiveObservation] = useState<Observation | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  const categories: Array<{ id: NatureCategory | 'all'; label: string; icon?: any }> = [
    { id: 'all', label: 'All Life' },
    { id: 'plant', label: 'Plants', icon: Leaf },
    { id: 'flower', label: 'Flowers', icon: Flower2 },
    { id: 'leaf', label: 'Leaves', icon: Leaf },
    { id: 'bird', label: 'Birds', icon: Bird },
    { id: 'insect', label: 'Insects', icon: Bug },
    { id: 'other', label: 'Other' },
  ];

  const filteredObservations = useMemo(() => {
    return observations.filter((obs) => {
      const matchesCategory = selectedCategory === 'all' || obs.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesText =
        obs.name.toLowerCase().includes(query) ||
        obs.notes.toLowerCase().includes(query) ||
        (obs.location && obs.location.toLowerCase().includes(query)) ||
        (obs.visibleFeatures && obs.visibleFeatures.some(f => f.toLowerCase().includes(query)));

      return matchesCategory && matchesText;
    });
  }, [observations, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-forest-dark uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5 text-forest" />
            <span>Digital Field Scrapbook</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
            Nature Journal
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            {observations.length} {observations.length === 1 ? 'discovery' : 'discoveries'} recorded privately in offline storage.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => setShowExportModal(true)}
          >
            Backup / Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Camera className="w-4 h-4" />}
            onClick={() => onNavigate('identify')}
          >
            Add Discovery
          </Button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, notes, visible characteristics, or location..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-sage-border focus:ring-2 focus:ring-forest bg-white"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-white border border-sage-border rounded-xl p-1 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('gallery')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'gallery' ? 'bg-forest text-cream' : 'text-charcoal-muted hover:text-charcoal'
              }`}
              title="Gallery View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-forest text-cream' : 'text-charcoal-muted hover:text-charcoal'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => {
            const isSelected = selectedCategory === c.id;
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-forest text-cream font-semibold shadow-sm'
                    : 'bg-white border border-sage-border text-charcoal hover:bg-sage-light'
                }`}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-sage' : 'text-forest'}`} />}
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Observations Grid or Empty States */}
      {filteredObservations.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-white/80 border-dashed">
          <div className="w-14 h-14 rounded-2xl bg-sage-light text-forest mx-auto flex items-center justify-center">
            <Leaf className="w-7 h-7" />
          </div>

          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-bold text-base text-charcoal">
              {searchQuery || selectedCategory !== 'all' ? 'No matching specimens found' : 'Your Nature Journal is empty'}
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try broadening your search term or selecting another category.'
                : 'Snap a photograph of an outdoor plant, tree, or insect to preserve your first discovery.'}
            </p>
          </div>

          <div className="pt-2">
            {searchQuery || selectedCategory !== 'all' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear Search & Filters
              </Button>
            ) : (
              <Button
                variant="primary"
                icon={<Camera className="w-4 h-4" />}
                onClick={() => onNavigate('identify')}
              >
                Identify First Specimen
              </Button>
            )}
          </div>
        </Card>
      ) : viewMode === 'gallery' ? (
        /* Gallery Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredObservations.map((obs) => (
            <Card
              key={obs.id}
              hoverable
              onClick={() => setActiveObservation(obs)}
              className="overflow-hidden p-0 flex flex-col group bg-white"
            >
              <div className="aspect-[16/10] bg-cream-dark relative overflow-hidden">
                {obs.photo ? (
                  <img
                    src={obs.photo}
                    alt={obs.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-forest/40">
                    <Leaf className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <Badge category={obs.category} size="sm" />
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-charcoal group-hover:text-forest transition-colors line-clamp-1">
                    {obs.name}
                  </h3>
                  {obs.notes && (
                    <p className="text-xs text-charcoal-muted line-clamp-2 mt-1 leading-relaxed">
                      {obs.notes}
                    </p>
                  )}
                </div>

                <div className="text-[11px] text-charcoal-muted pt-2.5 border-t border-sage-border/50 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-forest" />
                    {new Date(obs.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {obs.location && (
                    <span className="flex items-center gap-1 truncate max-w-[120px]">
                      <MapPin className="w-3 h-3 text-terracotta shrink-0" />
                      <span className="truncate">{obs.location}</span>
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2.5">
          {filteredObservations.map((obs) => (
            <Card
              key={obs.id}
              hoverable
              onClick={() => setActiveObservation(obs)}
              className="p-3.5 flex items-center justify-between gap-4 bg-white"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="w-14 h-14 rounded-xl bg-cream-dark overflow-hidden shrink-0 relative">
                  {obs.photo ? (
                    <img src={obs.photo} alt={obs.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-forest/40">
                      <Leaf className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-charcoal truncate">{obs.name}</h3>
                    <Badge category={obs.category} size="sm" />
                  </div>
                  {obs.notes && (
                    <p className="text-xs text-charcoal-muted truncate mt-0.5">
                      {obs.notes}
                    </p>
                  )}
                  <div className="text-[11px] text-charcoal-muted flex items-center gap-3 mt-1">
                    <span>{new Date(obs.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    {obs.location && <span>📍 {obs.location}</span>}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-semibold text-forest">View Details →</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <ObservationDetailModal
        observation={activeObservation}
        isOpen={!!activeObservation}
        onClose={() => setActiveObservation(null)}
        onUpdate={(updated) => {
          onUpdateObservation(updated);
          setActiveObservation(updated);
        }}
        onDelete={(id) => {
          onDeleteObservation(id);
          setActiveObservation(null);
        }}
      />

      {/* Export / Import Modal */}
      <ExportImportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onDataChanged={onRefreshData}
      />
    </div>
  );
};
