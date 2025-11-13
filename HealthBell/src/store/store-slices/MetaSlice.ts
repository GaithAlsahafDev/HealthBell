// src/store/store-slices/MetaSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MetaState = {
  firstLaunchDone: boolean;
  isBootstrapping: boolean;
  lastSyncAt: string | null; // ISO string
};

const initialState: MetaState = {
  firstLaunchDone: false,
  isBootstrapping: false,
  lastSyncAt: null,
};

const metaSlice = createSlice({
  name: "meta",
  initialState,
  reducers: {
    setBootstrapping(state, action: PayloadAction<boolean>) {
      state.isBootstrapping = action.payload;
    },
    setFirstLaunchDone(state, action: PayloadAction<boolean>) {
      state.firstLaunchDone = action.payload;
    },
    setLastSyncAt(state, action: PayloadAction<string | null>) {
      state.lastSyncAt = action.payload;
    },
    resetMeta() {
      return initialState;
    },
  },
});

export const {
  setBootstrapping,
  setFirstLaunchDone,
  setLastSyncAt,
  resetMeta,
} = metaSlice.actions;

export default metaSlice.reducer;

// Selectors بدون any وبدون Rootstate
export const selectIsBootstrapping = (s: { meta: MetaState }) =>
  s.meta.isBootstrapping;
export const selectFirstLaunchDone = (s: { meta: MetaState }) =>
  s.meta.firstLaunchDone;
export const selectLastSyncAt = (s: { meta: MetaState }) =>
  s.meta.lastSyncAt;
