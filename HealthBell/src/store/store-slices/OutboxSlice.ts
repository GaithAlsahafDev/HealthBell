// src/store/store-slices/OutboxSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type OutboxOpType = "add" | "update" | "remove";

export type OutboxPayload = Medicine | string;

/** عنصر واحد داخل طابور العمليات */
export interface OutboxEntry {
  opId: string;
  type: OutboxOpType;
  payload: OutboxPayload;
  attempts: number;
  lastError: string | null;
}

type OutboxState = OutboxEntry[];

/** الحالة الأولية */
const initialState: OutboxState = [];

/** السلايس */
const outboxSlice = createSlice({
  name: "outbox",
  initialState,
  reducers: {
    enqueueOp(state, action: PayloadAction<OutboxEntry>) {
      state.push(action.payload);
    },

    markAttempt(
      state,
      action: PayloadAction<{ opId: string; error: string | null }>
    ) {
      const entry = state.find(e => e.opId === action.payload.opId);
      if (entry) {
        entry.attempts += 1;
        entry.lastError = action.payload.error;
      }
    },

    removeOp(state, action: PayloadAction<string>) {
      return state.filter(e => e.opId !== action.payload);
    },

    clearOutbox() {
      return [];
    },
  },
});

export const { enqueueOp, markAttempt, removeOp, clearOutbox } =
  outboxSlice.actions;

export default outboxSlice.reducer;
