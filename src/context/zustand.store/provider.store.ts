import { create } from "zustand";

export interface Props {
  uid: string | null;
  email: string | null;
  name: string | null;

  isWithProvider: boolean;

  setWithProvider: (uid: string, email: string, name?: string) => void;
}

export const store = create<Props>((set) => ({
  email: null,
  uid: null,
  isWithProvider: false,
  name: null,

  setWithProvider: (uid, email, name) =>
    set({ uid, email, name, isWithProvider: true }),
}));
