export interface Agency {
  id: string;
  name: string;
  city: string;
  departmentCodes: string[]; // e.g. ["33", "75", "2A"]
  coordinates?: [number, number];
}


