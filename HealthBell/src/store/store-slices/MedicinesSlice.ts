// src/store/store-slices/MedicinesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Medicine[] = [];

const medicinesSlice = createSlice({
    name: "medicines",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<Medicine>) => {
            return [...state, action.payload];
        },
        remove: (state, action: PayloadAction<string>) => {
            return state.filter(m => m.id !== action.payload);
        },
        update: (state, action: PayloadAction<Medicine>) => {
            return state.map(m => (m.id === action.payload.id ? action.payload : m));
        },
        clearAll: () => {
            return [];
        }
    },
});

const { reducer, actions } = medicinesSlice;
export const { add, remove, update, clearAll } = actions;
export default reducer;
