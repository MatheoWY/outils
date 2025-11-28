import { useState, useEffect } from "react";
import { Person } from "@/types/person";
import { FRENCH_CITIES } from "@/data/cities";

const STORAGE_KEY = "france-map-persons-workandyou";

const getInitialPersons = (): Person[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  // Si des données existent en localStorage, on les charge toujours
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  }
  
  // Sinon, on charge les données par défaut (première utilisation uniquement)
  
  // Données Work&You avec email et téléphone
  return [
    { id: "1", firstName: "Emilie", lastName: "ABADIE", skills: [], city: "Bordeaux", email: "emilie.abadie@workandyou.fr", phone: "+33 7 43 51 96 71", coordinates: [-0.5792, 44.8378] },
    { id: "2", firstName: "Lea", lastName: "ALLOUCHE", skills: [], city: "Toulouse", email: "lea@workandyou.fr", phone: "+33 7 85 36 70 24", coordinates: [1.4442, 43.6047] },
    { id: "3", firstName: "Fabien", lastName: "AMIRAULT", skills: [], city: "Tours", email: "fabien.amirault@workandyou.fr", phone: "+33 6 12 04 34 92", coordinates: [0.6833, 47.3941] },
    { id: "4", firstName: "Augustin", lastName: "BENOIT", skills: [], city: "Lyon", email: "augustin.benoit@workandyou.fr", phone: "+33 7 63 88 01 33", coordinates: [4.8357, 45.764] },
    { id: "5", firstName: "Marie", lastName: "BERBIGUIE", skills: [], city: "Agen", email: "marie@workandyou.fr", phone: "+33 7 83 82 35 93", coordinates: [0.6209, 44.2034] },
    { id: "6", firstName: "Benjamin", lastName: "BIANCHINI", skills: [], city: "", email: "benjamin.bianchini@workandyou.fr", phone: "" },
    { id: "7", firstName: "Marion", lastName: "BLANCHARD", skills: [], city: "Agen", email: "marion.blanchard@workandyou.fr", phone: "+33 7 63 02 64 54", coordinates: [0.6209, 44.2034] },
    { id: "8", firstName: "Flavie", lastName: "CARPENTIER", skills: [], city: "Nancy", email: "flavie.carpentier@workandyou.fr", phone: "+33 6 89 44 24 29", coordinates: [6.1840, 48.6921] },
    { id: "9", firstName: "Nathalie", lastName: "CHARBONNIER", skills: [], city: "Paris", email: "nathalie@workandyou.fr", phone: "+33 7 56 27 33 35", coordinates: [2.3522, 48.8566] },
    { id: "10", firstName: "Aurelie", lastName: "CORROYER", skills: [], city: "Bordeaux", email: "aurelie@workandyou.fr", phone: "+33 7 67 34 03 23", coordinates: [-0.5792, 44.8378] },
    { id: "11", firstName: "Justine", lastName: "DELERUYLLE", skills: [], city: "Agen", email: "justine.deleruylle@workandyou.fr", phone: "+33 6 07 27 16 01", coordinates: [0.6209, 44.2034] },
    { id: "12", firstName: "Melvyn", lastName: "DESMARS", skills: [], city: "Nantes", email: "melvyn.desmars@workandyou.fr", phone: "+33 7 61 97 26 05", coordinates: [-1.5536, 47.2184] },
    { id: "13", firstName: "Béatrice", lastName: "D'HOOGHE", skills: [], city: "Bordeaux", email: "beatrice@workandyou.fr", phone: "+33 6 37 83 76 78", coordinates: [-0.5792, 44.8378] },
    { id: "14", firstName: "Delphine", lastName: "D'HOOGHE", skills: [], city: "Agen", email: "contact@workandyou.fr", phone: "+33 5 53 77 20 73", coordinates: [0.6209, 44.2034] },
    { id: "15", firstName: "Nicolas", lastName: "D'HOOGHE", skills: [], city: "Agen", email: "nicolas@workandyou.fr", phone: "+33 7 87 13 59 64", coordinates: [0.6209, 44.2034] },
    { id: "16", firstName: "Laurent", lastName: "DUPRÉ", skills: [], city: "Nantes", email: "laurent.dupre@workandyou.fr", phone: "+33 6 83 13 11 69", coordinates: [-1.5536, 47.2184] },
    { id: "17", firstName: "Léa", lastName: "FARES", skills: [], city: "Lyon", email: "lea.fares@workandyou.fr", phone: "+33 7 60 75 59 77", coordinates: [4.8357, 45.764] },
    { id: "18", firstName: "Alexandra", lastName: "FAURE", skills: [], city: "", email: "alexandra.faure@workandyou.fr", phone: "+33 7 82 82 51 93" },
    { id: "19", firstName: "Raphael", lastName: "FOURNIER", skills: [], city: "Perpignan", email: "raphael@workandyou.fr", phone: "+33 6 76 30 39 50", coordinates: [2.8948, 42.6886] },
    { id: "20", firstName: "Mathilde", lastName: "Gannerie", skills: [], city: "Toulon", email: "mathilde@workandyou.fr", phone: "+33 7 67 94 52 87", coordinates: [5.928, 43.1242] },
    { id: "21", firstName: "Gestion", lastName: "Bordeaux", skills: [], city: "", email: "gestion.bordeaux@workandyou.fr", phone: "" },
    { id: "22", firstName: "Dany", lastName: "HIBRI", skills: [], city: "Paris", email: "dany@workandyou.fr", phone: "+33 7 56 10 76 51", coordinates: [2.3522, 48.8566] },
    { id: "23", firstName: "Laurane", lastName: "LABORIE", skills: [], city: "Bordeaux", email: "laurane@workandyou.fr", phone: "+33 7 63 02 64 54", coordinates: [-0.5792, 44.8378] },
    { id: "24", firstName: "Valérie", lastName: "LAGARDE", skills: [], city: "Toulouse", email: "valerie.lagarde@workandyou.fr", phone: "+33 6 23 06 79 32", coordinates: [1.4442, 43.6047] },
    { id: "25", firstName: "Lucie", lastName: "LAURENT", skills: [], city: "Valence", email: "lucie.laurent@workandyou.fr", phone: "+33 6 86 32 85 18", coordinates: [4.8918, 44.9333] },
    { id: "26", firstName: "David", lastName: "LECAT", skills: [], city: "Rouen", email: "david.lecat@workandyou.fr", phone: "+33 7 66 94 43 26", coordinates: [1.0993, 49.4432] },
    { id: "27", firstName: "Rowan", lastName: "LECOQ", skills: [], city: "", email: "rowan.lecoq@workandyou.fr", phone: "+33 6 09 42 41 40" },
    { id: "28", firstName: "Cédric", lastName: "LEFEBVRE", skills: [], city: "Toulouse", email: "cedric@workandyou.fr", phone: "+33 7 83 73 02 40", coordinates: [1.4442, 43.6047] },
    { id: "29", firstName: "Charlotte", lastName: "LELAURE", skills: [], city: "Nantes", email: "charlotte@workandyou.fr", phone: "+33 6 50 92 81 65", coordinates: [-1.5536, 47.2184] },
    { id: "30", firstName: "Matheo", lastName: "MARNAC", skills: [], city: "Agen", email: "matheo@workandyou.fr", phone: "+33 6 72 01 74 23", coordinates: [0.6209, 44.2034] },
    { id: "31", firstName: "Camille", lastName: "MONCEL", skills: [], city: "Clermont-Ferrand", email: "camille@workandyou.fr", phone: "+33 6 80 54 59 30", coordinates: [3.0878, 45.7772] },
    { id: "32", firstName: "Marie Carmen", lastName: "MUNUERA", skills: [], city: "", email: "marie-carmen.munuera@workandyou.fr", phone: "" },
    { id: "33", firstName: "Alban", lastName: "MURUGNEUX", skills: [], city: "Lyon", email: "alban@workandyou.fr", phone: "+33 6 71 70 06 37", coordinates: [4.8357, 45.764] },
    { id: "34", firstName: "Yassine", lastName: "OUHRAICH", skills: [], city: "", email: "yassine.ouhraich@workandyou.fr", phone: "+33 6 35 18 82 32" },
    { id: "35", firstName: "Romélie", lastName: "OVEILHEIRO", skills: [], city: "Rodez", email: "romelie@workandyou.fr", phone: "+33 6 08 37 58 68", coordinates: [2.5752, 44.3503] },
    { id: "36", firstName: "Emilie", lastName: "PANGRAZZI", skills: [], city: "Agen", email: "emilie@workandyou.fr", phone: "+33 6 38 35 86 51", coordinates: [0.6209, 44.2034] },
    { id: "37", firstName: "Robin", lastName: "PARISOT", skills: [], city: "Nantes", email: "robin@workandyou.fr", phone: "+33 6 84 64 13 95", coordinates: [-1.5536, 47.2184] },
    { id: "38", firstName: "Benjamin", lastName: "PERROT", skills: [], city: "Bordeaux", email: "benjamin.perrot@workandyou.fr", phone: "+33 6 70 65 94 93", coordinates: [-0.5792, 44.8378] },
    { id: "39", firstName: "Stéphanie", lastName: "PHILIPPON", skills: [], city: "Montpellier", email: "stephanie@workandyou.fr", phone: "+33 6 86 47 31 01", coordinates: [3.8767, 43.6108] },
    { id: "40", firstName: "Simona", lastName: "PRICOP", skills: [], city: "Paris", email: "simona.pricop@workandyou.fr", phone: "+33 6 21 20 62 88", coordinates: [2.3522, 48.8566] },
    { id: "41", firstName: "Quentin", lastName: "REAUD", skills: [], city: "Nancy", email: "quentin@workandyou.fr", phone: "+33 7 78 14 42 84", coordinates: [6.1840, 48.6921] },
    { id: "42", firstName: "Alexis", lastName: "RENARD", skills: [], city: "Paris", email: "alexis.renard@workandyou.fr", phone: "", coordinates: [2.3522, 48.8566] },
    { id: "43", firstName: "Pierre", lastName: "ROLLAND", skills: [], city: "Nancy", email: "pierre.rolland@workandyou.fr", phone: "+33 6 88 97 20 81", coordinates: [6.1840, 48.6921] },
    { id: "44", firstName: "François", lastName: "ROUSSEAU", skills: [], city: "Agen", email: "francois.rousseau@workandyou.fr", phone: "+33 6 68 97 20 00", coordinates: [0.6209, 44.2034] },
    { id: "45", firstName: "Laurie", lastName: "RUIZ", skills: [], city: "Agen", email: "laurie@workandyou.fr", phone: "+33 7 87 03 31 00", coordinates: [0.6209, 44.2034] },
    { id: "46", firstName: "Emmanuelle", lastName: "SERRANO", skills: [], city: "", email: "emmanuelle.serrano@workandyou.fr", phone: "+33 6 99 24 73 67" },
    { id: "47", firstName: "Julien", lastName: "SIMON", skills: [], city: "Agen", email: "julien.simon@workandyou.fr", phone: "+33 6 61 36 35 69", coordinates: [0.6209, 44.2034] },
    { id: "48", firstName: "Laura", lastName: "SONIGO", skills: [], city: "Nantes", email: "laura@workandyou.fr", phone: "+33 6 99 74 62 53", coordinates: [-1.5536, 47.2184] },
    { id: "49", firstName: "Nathalie", lastName: "TALLIDIS", skills: [], city: "Paris", email: "nathalie.tallidis@workandyou.fr", phone: "+33 6 52 18 27 04", coordinates: [2.3522, 48.8566] },
    { id: "50", firstName: "Alexandra", lastName: "TROPCHAUD", skills: [], city: "Agen", email: "alexandra.tropchaud@workandyou.fr", phone: "+33 6 82 95 15 99", coordinates: [0.6209, 44.2034] },
    { id: "51", firstName: "Ornella", lastName: "YANA", skills: [], city: "Paris", email: "ornella@workandyou.fr", phone: "+33 7 56 27 79 10", coordinates: [2.3522, 48.8566] },
  ];
};

export const usePersons = () => {
  const [persons, setPersons] = useState<Person[]>(getInitialPersons);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persons));
  }, [persons]);

  const addPerson = (person: Omit<Person, "id" | "coordinates">) => {
    const city = FRENCH_CITIES.find((c) => c.name === person.city);
    const newPerson: Person = {
      ...person,
      id: Date.now().toString(),
      coordinates: city?.coordinates,
    };
    setPersons([...persons, newPerson]);
  };

  const updatePerson = (id: string, updatedData: Omit<Person, "id" | "coordinates">) => {
    const city = FRENCH_CITIES.find((c) => c.name === updatedData.city);
    setPersons(
      persons.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updatedData,
              coordinates: city?.coordinates,
            }
          : p
      )
    );
  };

  const deletePerson = (id: string) => {
    setPersons(persons.filter((p) => p.id !== id));
  };

  return { persons, addPerson, updatePerson, deletePerson };
};
