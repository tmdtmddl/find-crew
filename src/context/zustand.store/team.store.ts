import { create } from "zustand";

export interface Props {
  team: MatchingTeam | null;
  setTeam: (team: MatchingTeam | null) => void;
}

export const store = create<Props>((set) => ({
  team: null,
  setTeam: (team) => set({ team }),
}));
