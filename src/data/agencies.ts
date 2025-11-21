import type { Agency } from "@/types/agency";

// Données d'exemple – peuvent être remplacées par une source distante plus tard
export const DEFAULT_AGENCIES: Agency[] = [
  {
    id: "ag-bordeaux",
    name: "Agence Bordeaux",
    city: "Bordeaux",
    departmentCodes: ["33", "24"],
    coordinates: [-0.5792, 44.8378],
  },
  {
    id: "ag-toulouse",
    name: "Agence Toulouse",
    city: "Toulouse",
    departmentCodes: ["31", "81", "82"],
    coordinates: [1.4442, 43.6047],
  },
  {
    id: "ag-paris",
    name: "Agence Paris",
    city: "Paris",
    departmentCodes: ["75", "92", "93", "94"],
    coordinates: [2.3522, 48.8566],
  },
];


