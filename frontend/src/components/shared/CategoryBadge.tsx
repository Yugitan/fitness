import { cn } from '@/lib/utils';
import { CATEGORY_COLORS, type ExerciseCategory } from '@/types';

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const color = CATEGORY_COLORS[category as ExerciseCategory] || '#6b7280';

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-0.5', className)}
      style={{
        backgroundColor: `${color}18`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {category}
    </span>
  );
}
