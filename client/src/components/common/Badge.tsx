import React from 'react';
import { Leaf, Flower2, Bird, Bug, HelpCircle } from 'lucide-react';
import { NatureCategory, ConfidenceLevel } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'category' | 'confidence' | 'neutral' | 'success' | 'warning' | 'offline';
  category?: NatureCategory;
  confidence?: ConfidenceLevel;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  category,
  confidence,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  if (category) {
    const categoryConfig: Record<NatureCategory, { label: string; bg: string; text: string; icon: any }> = {
      plant: { label: 'Plant', bg: 'bg-emerald-100', text: 'text-emerald-900', icon: Leaf },
      leaf: { label: 'Leaf', bg: 'bg-green-100', text: 'text-green-900', icon: Leaf },
      flower: { label: 'Flower', bg: 'bg-rose-100', text: 'text-rose-900', icon: Flower2 },
      bird: { label: 'Bird', bg: 'bg-sky-100', text: 'text-sky-900', icon: Bird },
      insect: { label: 'Insect', bg: 'bg-amber-100', text: 'text-amber-900', icon: Bug },
      other: { label: 'Other', bg: 'bg-stone-100', text: 'text-stone-800', icon: HelpCircle }
    };

    const cfg = categoryConfig[category] || categoryConfig.plant;
    const Icon = cfg.icon;

    return (
      <span className={`inline-flex items-center gap-1 font-medium rounded-full ${sizeClasses} ${cfg.bg} ${cfg.text} ${className}`}>
        <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        {children || cfg.label}
      </span>
    );
  }

  if (confidence) {
    const confColors: Record<ConfidenceLevel, { bg: string; text: string; dot: string }> = {
      high: { bg: 'bg-emerald-50', text: 'text-emerald-800', dot: 'bg-emerald-500' },
      medium: { bg: 'bg-amber-50', text: 'text-amber-800', dot: 'bg-amber-500' },
      low: { bg: 'bg-rose-50', text: 'text-rose-800', dot: 'bg-rose-500' }
    };

    const c = confColors[confidence] || confColors.medium;

    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeClasses} ${c.bg} ${c.text} ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {confidence.charAt(0).toUpperCase() + confidence.slice(1)} Confidence
      </span>
    );
  }

  const variants = {
    neutral: 'bg-cream-dark text-charcoal',
    success: 'bg-sage text-forest-dark',
    warning: 'bg-amber-100 text-amber-900',
    offline: 'bg-stone-200 text-stone-700'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${variants[variant as keyof typeof variants] || variants.neutral} ${className}`}>
      {children}
    </span>
  );
};
