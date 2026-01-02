// src/services/medicinesApi.ts
import { collection, getDocs, setDoc, doc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const getMedicinesCollection = (uid: string) => collection(db, "users", uid, "medicines");

export const medicinesApi = {
  //==============================================================================
  async getAll(uid: string): Promise<Medicine[]> {
    const colRef = getMedicinesCollection(uid);
    const snapshot = await getDocs(colRef);

    const items: Medicine[] = snapshot.docs.map(d => {
      const data = d.data() as Medicine;
      return {
        ...data,
        id: d.id,
      };
    });

    return items;
  },
  //==============================================================================
  async create(uid: string, m: Medicine): Promise<Medicine> {
    const colRef = getMedicinesCollection(uid);
    const { id: _ignored, ...data } = m;
    const docRef = await addDoc(colRef, data);

    return {
      ...m,
      id: docRef.id,
    };
  },
  //==============================================================================
  async update(uid: string, m: Medicine): Promise<Medicine> {
    if (!m.id) {
      throw new Error("Cannot update medicine without id");
    }
    const { id, ...data } = m;
    const docRef = doc(db, "users", uid, "medicines", id);
    await setDoc(docRef, data, { merge: true });
    return m;
  },
  //==============================================================================
  async remove(uid: string, id: string): Promise<{ success: boolean }> {
    const docRef = doc(db, "users", uid, "medicines", id);
    await deleteDoc(docRef);
    return { success: true };
  },
};
