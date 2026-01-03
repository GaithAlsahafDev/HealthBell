// /src/types/medicine.ts
export type MedicineFormValues = {
  name: string;
  doseAmount: string;
  doseUnit: Unit;
  doseText: string;
  times: HHmm[];
  newTime: string;
  everyDay: boolean;
  days: string[];
  courseStart: string;
  courseEnd: string;
  instructions: string;
};

export const UNITS = ['mg', 'ml', 'g', 'mcg', 'drops', 'tablet', 'capsule'] as const;
export type Unit = (typeof UNITS)[number];

