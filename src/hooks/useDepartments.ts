import { useEffect, useMemo, useState } from "react";

export interface Department {
  code: string;
  name: string;
}

const FRANCE_DEPTS_GEOJSON =
  "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson";

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchDepts = async () => {
      try {
        setLoading(true);
        const res = await fetch(FRANCE_DEPTS_GEOJSON);
        const json = await res.json();
        const feats: any[] = json.features ?? [];
        const list: Department[] = feats
          .map((f) => {
            const p = f.properties ?? {};
            const code =
              p.code ??
              p.code_dep ??
              p.codeDepartement ??
              p.dep ??
              p.CODE_DEPT ??
              p.insee;
            const name = p.nom ?? p.name ?? p.NOM_DEPT ?? p.nom_dept;
            if (!code || !name) return null;
            return { code: String(code), name: String(name) };
          })
          .filter(Boolean);
        if (mounted) setDepartments(list);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Erreur de chargement des départements");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchDepts();
    return () => {
      mounted = false;
    };
  }, []);

  const byNameIndex = useMemo(() => {
    const n = (s: string) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    const map = new Map<string, Department[]>();
    for (const d of departments) {
      const key = n(d.name);
      const arr = map.get(key) ?? [];
      arr.push(d);
      map.set(key, arr);
    }
    return { normalize: n, map };
  }, [departments]);

  return { departments, loading, error, byNameIndex };
};


