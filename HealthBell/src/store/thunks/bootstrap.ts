// src/store/thunks/bootstrap.ts
import { AppDispatch, Rootstate } from "../store";
import { setBootstrapping, setFirstLaunchDone } from "../store-slices/MetaSlice";
import { medicinesApi } from "../../services/api/medicinesApi";
import { clearAll, add } from "../store-slices/MedicinesSlice";

/**
 * يجلب الأدوية من الخادوم عند الإقلاع الأول فقط.
 */
export const bootstrap = () => {
  return async (dispatch: AppDispatch, getState: () => Rootstate) => {
    const meta = getState().meta;

    if (meta.firstLaunchDone) {
      return;
    }

    dispatch(setBootstrapping(true));

    try {
      const data = await medicinesApi.getAll();

      dispatch(clearAll());
      for (const item of data) {
        dispatch(add(item));
      }

      dispatch(setFirstLaunchDone(true));
    } catch (err: unknown) {
      console.error("Bootstrap failed:", err);
    } finally {
      dispatch(setBootstrapping(false));
    }
  };
};
