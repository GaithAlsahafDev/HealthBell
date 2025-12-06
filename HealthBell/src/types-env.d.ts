// src/types-env.d.ts
type HHmm = `${number}${number}:${number}${number}`;

type MedicineInstruction =
  | "after_food"
  | "before_food"
  | "with_water"
  | "with_food"
  | "none";


interface Medicine {
  id: string;
  name: string;
  form?: MedicineForm;

  doseText?: string;
  doseAmount?: string;
  doseUnit?: string;

  times?: HHmm[];
  instructions?: MedicineInstruction;

  courseStart?: string;

  courseEnd?: string;
  notes?: string;

  everyDay?: boolean;
  days?: string[];
}
