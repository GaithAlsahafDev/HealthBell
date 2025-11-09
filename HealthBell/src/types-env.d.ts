type HHmm = `${number}${number}:${number}${number}`;


type MedicineForm =
  | "tablet"
  | "capsule"
  | "syrup"
  | "injection"
  | "drops"
  | "ointment"
  | "spray"
  | "other";


type MedicineInstruction =
  | "after_food"
  | "before_food"
  | "with_water"
  | "with_milk"
  | "with_food"
  | "none";


interface Medicine {
  id: string;
  name: string;
  dosageMg?: number;
  form?: MedicineForm;

  doseText?: string;

  times?: HHmm[];
  instructions?: MedicineInstruction;

  courseStart?: string;

  courseEnd?: string;
  notes?: string;
}


type Medicines = Medicine[];


interface MedicinesFile {
  medicines: Medicines;
}


declare module "*.json" {
  const value: unknown;
  export default value;
}
