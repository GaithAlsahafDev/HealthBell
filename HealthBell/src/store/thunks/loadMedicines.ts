// src/store/thunks/loadMedicines.ts
import { AppDispatch } from "../store";
import { medicinesApi } from "../../services/medicinesApi";
import { clearAll, add } from "../store-slices/MedicinesSlice";

export const loadMedicines = (uid: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const data = await medicinesApi.getAll(uid);

      dispatch(clearAll());
      data.forEach(item => dispatch(add(item)));
    } catch (err) {
      console.error("Failed to load medicines:", err);
    }
  };
};
