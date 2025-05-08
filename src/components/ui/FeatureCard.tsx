import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  gradientFrom,
  gradientTo,
  className,
}: FeatureCardProps) {
  return (
    <div className={cn(
      "bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-md p-8 rounded-2xl border transition-all group relative overflow-hidden shadow-xl",
      `border-${gradientFrom}-100 hover:border-${gradientFrom}-300/50`,
      className
    )}>
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity",
        `from-${gradientFrom}-500/5 to-${gradientTo}-500/5`
      )} />
      <div className={cn(
        "h-16 w-16 rounded-xl flex items-center justify-center mb-6 relative shadow-lg",
        `bg-gradient-to-br from-${gradientFrom}-400 to-${gradientFrom}-500`,
        `shadow-${gradientFrom}-500/20`
      )}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-800">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
} 