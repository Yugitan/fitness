'use client';

import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import {
  allowDetailNumericKey,
  sanitizeDetailNumericInput,
  type DetailNumericField,
} from '@/lib/numeric-field';

export function NumericFieldInput({
  label,
  field,
  value,
  error,
  onChange,
  onBlur,
  className,
}: {
  label: string;
  field: DetailNumericField;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  className?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input
        type="text"
        inputMode={field === 'weight' ? 'decimal' : 'numeric'}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => allowDetailNumericKey(e, field)}
        onPaste={(e) => {
          e.preventDefault();
          onChange(sanitizeDetailNumericInput(field, e.clipboardData.getData('text')));
        }}
        onBlur={onBlur}
        className={cn(
          'h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          error && 'border-danger focus-visible:ring-danger/50',
          className
        )}
      />
      {error && <p className="text-xs text-danger leading-snug">{error}</p>}
    </div>
  );
}
