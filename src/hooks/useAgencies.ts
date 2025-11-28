import { useEffect, useState } from "react";
import type { Agency } from "@/types/agency";
import { DEFAULT_AGENCIES } from "@/data/agencies";

const STORAGE_KEY = "france-map-agencies";

const getInitialAgencies = (): Agency[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore parse error and fallback to defaults
    }
  }
  return DEFAULT_AGENCIES;
};

export const useAgencies = () => {
  const [agencies, setAgencies] = useState<Agency[]>(getInitialAgencies);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agencies));
  }, [agencies]);

  const addAgency = (agency: Omit<Agency, "id"> & { id?: string }) => {
    const newAgency: Agency = {
      id: agency.id ?? `ag-${Date.now()}`,
      ...agency,
    };
    setAgencies([...agencies, newAgency]);
  };

  const updateAgency = (id: string, updated: Partial<Agency>) => {
    setAgencies(agencies.map((a) => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteAgency = (id: string) => {
    setAgencies(agencies.filter((a) => a.id !== id));
  };

  return { agencies, addAgency, updateAgency, deleteAgency };
};


