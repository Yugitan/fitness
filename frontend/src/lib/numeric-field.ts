/** 训练计划 / 训练记录表单共用的数字字段校验 */
export type DetailNumericField = 'dayNumber' | 'sets' | 'reps' | 'weight' | 'setNumber';

export type DetailNumericErrors = Partial<Record<DetailNumericField, string>>;

const WEIGHT_MAX = 999;

/** 输入过程中尚未形成完整数值时暂不报错 */
function isPartialWeightInput(v: string): boolean {
  if (v === '') return true;
  if (!/^\d+(\.\d{0,2})?$/.test(v)) return false;
  if (/^\d+\.$/.test(v)) return true;
  if (/^\d+$/.test(v)) return true;
  const n = parseFloat(v);
  if (Number.isNaN(n)) return true;
  return n <= 0 || n > WEIGHT_MAX;
}

function validateWeightValue(v: string, allowPartial: boolean): string | undefined {
  const trimmed = v.trim();
  if (trimmed === '') {
    return allowPartial ? undefined : '请输入负重';
  }
  if (allowPartial && isPartialWeightInput(trimmed)) return undefined;
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return '请输入有效重量（最多两位小数）';
  const n = parseFloat(trimmed);
  if (n === 0) return '负重不能为 0 kg';
  if (n < 0 || n > WEIGHT_MAX) return `负重范围为 0.01–${WEIGHT_MAX} kg`;
  return undefined;
}

export function sanitizeDetailNumericInput(field: DetailNumericField, value: string): string {
  if (field === 'weight') {
    let s = value.replace(/[^\d.]/g, '');
    const dot = s.indexOf('.');
    if (dot !== -1) {
      s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, '');
      const [intPart, decPart = ''] = s.split('.');
      s = `${intPart}.${decPart.slice(0, 2)}`;
    }
    return s;
  }
  return value.replace(/\D/g, '');
}

export function validateDetailNumericField(
  field: DetailNumericField,
  value: string,
  options?: { allowPartial?: boolean }
): string | undefined {
  const v = value.trim();
  if (field === 'weight') {
    return validateWeightValue(v, options?.allowPartial ?? false);
  }
  if (v === '') return '不能为空';
  if (!/^\d+$/.test(v)) return '请输入正整数';
  const n = parseInt(v, 10);
  if (field === 'dayNumber' && (n < 1 || n > 31)) return '训练日为 1–31';
  if ((field === 'sets' || field === 'setNumber') && (n < 1 || n > 99)) return '组数为 1–99';
  if (field === 'reps' && (n < 1 || n > 999)) return '次数为 1–999';
  return undefined;
}

export function parseDetailNumericField(field: DetailNumericField, value: string): number {
  const v = value.trim();
  if (field === 'weight') {
    if (v === '') return 0;
    const n = parseFloat(v);
    return Number.isNaN(n) ? 0 : n;
  }
  return parseInt(v, 10);
}

export function allowDetailNumericKey(
  e: React.KeyboardEvent<HTMLInputElement>,
  field: DetailNumericField
) {
  const controlKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
  if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
  if (field === 'weight' && e.key === '.' && !e.currentTarget.value.includes('.')) return;
  if (/^\d$/.test(e.key)) return;
  e.preventDefault();
}

export function validateDetailNumericRows<F extends DetailNumericField>(
  rows: Record<F, string>[],
  fields: readonly F[]
): { valid: boolean; errors: Record<number, Partial<Record<F, string>>> } {
  const errors: Record<number, Partial<Record<F, string>>> = {};
  let valid = true;
  rows.forEach((row, index) => {
    fields.forEach((field) => {
      const err = validateDetailNumericField(field, row[field], { allowPartial: false });
      if (err) {
        valid = false;
        errors[index] = { ...errors[index], [field]: err };
      }
    });
  });
  return { valid, errors };
}
