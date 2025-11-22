// src/services/api/medicinesApi.ts
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const MEDICINES_COLLECTION = "medicines";

export const medicinesApi = {
  async getAll(): Promise<Medicine[]> {
    const colRef = collection(db, MEDICINES_COLLECTION);
    const snapshot = await getDocs(colRef);

    const items: Medicine[] = snapshot.docs.map(d => {
      const data = d.data() as Medicine;
      // ضمان وجود id: نستخدم حقل id إن وُجد، وإلا document id
      return {
        ...data,
        id: data.id ?? d.id,
      };
    });

    return items;
  },

  async create(m: Medicine): Promise<Medicine> {
    const id = m.id ?? `m_${Date.now()}`;
    const docRef = doc(db, MEDICINES_COLLECTION, id);
    const payload: Medicine = { ...m, id };
    await setDoc(docRef, payload);
    return payload;
  },

  async update(m: Medicine): Promise<Medicine> {
    if (!m.id) {
      throw new Error("Cannot update medicine without id");
    }
    const docRef = doc(db, MEDICINES_COLLECTION, m.id);
    await setDoc(docRef, m, { merge: true });
    return m;
  },

  async remove(id: string): Promise<{ success: boolean }> {
    const docRef = doc(db, MEDICINES_COLLECTION, id);
    await deleteDoc(docRef);
    return { success: true };
  },
};
