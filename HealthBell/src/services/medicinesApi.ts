// src/services/api/medicinesApi.ts
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const getMedicinesCollection = (uid: string) =>
  collection(db, "users", uid, "medicines");

export const medicinesApi = {
  async getAll(uid: string): Promise<Medicine[]> {
    const colRef = getMedicinesCollection(uid);
    const snapshot = await getDocs(colRef);

    const items: Medicine[] = snapshot.docs.map(d => {
      const data = d.data() as Medicine;
      return {
        ...data,
        id: data.id ?? d.id,
      };
    });

    return items;
  },

  async create(uid: string, m: Medicine): Promise<Medicine> {
    const id = m.id ?? `m_${Date.now()}`;
    const docRef = doc(db, "users", uid, "medicines", id);
    const payload: Medicine = { ...m, id };
    await setDoc(docRef, payload);
    return payload;
  },

  async update(uid: string, m: Medicine): Promise<Medicine> {
    if (!m.id) {
      throw new Error("Cannot update medicine without id");
    }
    const docRef = doc(db, "users", uid, "medicines", m.id);
    await setDoc(docRef, m, { merge: true });
    return m;
  },

  async remove(uid: string, id: string): Promise<{ success: boolean }> {
    const docRef = doc(db, "users", uid, "medicines", id);
    await deleteDoc(docRef);
    return { success: true };
  },
};
