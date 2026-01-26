import { createContext } from "react";

export type AgendaDaysContextValue = {
  agendaDays: number;
  setAgendaDays: (value: number) => void;
};

export const AgendaDaysContext = createContext<AgendaDaysContextValue | null>(null);
