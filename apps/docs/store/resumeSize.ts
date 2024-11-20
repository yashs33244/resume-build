import { atom } from "recoil";

// Define valid size types
export type ResumeSize = 'XS' | 'S' | 'M' | 'L' | 'XL';

export const sizes = [
  { value: 1, label: 'XS' },
  { value: 2, label: 'S' },
  { value: 3, label: 'M' },
  { value: 4, label: 'L' },
  { value: 5, label: 'XL' },
] as const;

export const resumeSizeAtom = atom<ResumeSize>({
  key: "resumeSizeAtom",
  default: "M",
});

// Helper functions for size conversions
export const getSizeValue = (size: ResumeSize): number => {
  const sizeObj = sizes.find(s => s.label === size);
  return sizeObj?.value || 3; // default to 3 ('M') if not found
};

export const getValueSize = (value: number): ResumeSize => {
  const sizeObj = sizes.find(s => s.value === value);
  return (sizeObj?.label as ResumeSize) || 'M'; // default to 'M' if not found
};