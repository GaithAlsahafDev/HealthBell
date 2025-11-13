// src/store/middleware/syncMiddleware.ts
import { Middleware, AnyAction, Dispatch } from "@reduxjs/toolkit";
import { medicinesApi } from "../../services/api/medicinesApi";
import { enqueueOp, markAttempt, removeOp, OutboxEntry, OutboxOpType } from "../store-slices/OutboxSlice";
import { add, update, remove } from "../store-slices/MedicinesSlice";
import type { Rootstate } from "../store";

const makeOpId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const actionTypeToOpType: Record<string, OutboxOpType> = {
  [add.type]: "add",
  [update.type]: "update",
  [remove.type]: "remove",
};

async function processEntry(entry: OutboxEntry, dispatch: Dispatch<AnyAction>) {
  try {
    if (entry.type === "add") {
      await medicinesApi.create(entry.payload as Medicine);
    } else if (entry.type === "update") {
      await medicinesApi.update(entry.payload as Medicine);
    } else if (entry.type === "remove") {
      await medicinesApi.remove(entry.payload as string);
    }

    dispatch(removeOp(entry.opId));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error";

    dispatch(
      markAttempt({
        opId: entry.opId,
        error: message,
      }),
    );
  }
}

export const syncMiddleware: Middleware<{}, Rootstate> =
  storeApi => next => action => {
    const result = next(action);

    if (actionTypeToOpType[(action as AnyAction).type]) {
      const opType = actionTypeToOpType[(action as AnyAction).type];
      const entry: OutboxEntry = {
        opId: makeOpId(),
        type: opType,
        payload: (action as AnyAction).payload,
        attempts: 0,
        lastError: null,
      };

      storeApi.dispatch(enqueueOp(entry));
      processEntry(entry, storeApi.dispatch).catch(() => {});
    } else if ((action as AnyAction).type === "outbox/sync") {
      const state = storeApi.getState();
      const queue = state.outbox;

      for (const entry of queue) {
        processEntry(entry, storeApi.dispatch).catch(() => {});
      }
    }

    return result;
  };

export const triggerOutboxSync = () => ({ type: "outbox/sync" });
