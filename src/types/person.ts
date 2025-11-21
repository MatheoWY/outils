export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  skills: string[];
  city: string;
  agencyId?: string;
  email: string;
  phone: string;
  photo?: string;
  coordinates?: [number, number];
}

export interface City {
  name: string;
  coordinates: [number, number];
}
