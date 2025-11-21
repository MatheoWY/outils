import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Person } from "@/types/person";
import type { Agency } from "@/types/agency";

const FRANCE_TOPO_JSON = "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson";

interface FranceMapProps {
  persons: Person[];
  selectedCity?: string;
  onCityClick: (city: string) => void;
  agencies?: Agency[];
  selectedAgencyId?: string;
  highlightDeptCodes?: string[];
}

export const FranceMap = ({ persons, selectedCity, onCityClick, agencies = [], selectedAgencyId, highlightDeptCodes = [] }: FranceMapProps) => {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [hoveredDeptCode, setHoveredDeptCode] = useState<string | null>(null);

  const coveredDepartmentCodes = useMemo(() => {
    return new Set(agencies.flatMap((a) => a.departmentCodes));
  }, [agencies]);
  const selectedAgency = useMemo(
    () => agencies.find((a) => a.id === selectedAgencyId),
    [agencies, selectedAgencyId]
  );
  const selectedDeptSet = useMemo(
    () => new Set(selectedAgency?.departmentCodes ?? []),
    [selectedAgency]
  );

  const getDeptInfo = (geo: any): { code?: string; name?: string } => {
    const props = geo.properties ?? {};
    const code =
      props.code ??
      props.code_dep ??
      props.codeDepartement ??
      props.dep ??
      props.CODE_DEPT ??
      props.insee ??
      undefined;
    const name = props.nom ?? props.name ?? props.NOM_DEPT ?? props.nom_dept ?? undefined;
    return { code, name };
  };
  const personsByCity = persons.reduce((acc, person) => {
    if (!person.coordinates) return acc;
    const key = person.coordinates.join(",");
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(person);
    return acc;
  }, {} as Record<string, Person[]>);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border-2 border-border shadow-2xl bg-muted/30">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [2.5, 46.5],
          scale: 2800,
        }}
        className="w-full h-full"
      >
        <Geographies geography={FRANCE_TOPO_JSON}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const { code: deptCode, name: deptName } = getDeptInfo(geo);
              const isCovered = deptCode ? coveredDepartmentCodes.has(deptCode) : false;
              const isInSelected = deptCode ? selectedDeptSet.has(deptCode) : false;
              const isHoveringBundle =
                hoveredDeptCode != null && selectedDeptSet.has(hoveredDeptCode);
              // Couleurs
              const baseWhite = "#ffffff";
              const paleRose = "rgba(236, 72, 153, 0.20)"; // rose pâle
              const rose = "rgba(236, 72, 153, 0.40)"; // rose plus foncé (sélection)
              const roseHover = "rgba(219, 39, 119, 0.55)"; // hover foncé

              let fill = baseWhite;
              if (isCovered) {
                fill = paleRose;
              }
              if (deptCode && highlightDeptCodes.includes(deptCode)) {
                fill = rose;
              }
              if (selectedAgency) {
                if (isInSelected) {
                  fill = rose;
                }
                if (isHoveringBundle && isInSelected) {
                  fill = roseHover;
                }
              } else {
                if (hoveredDeptCode && deptCode === hoveredDeptCode) {
                  fill = rose; // sans sélection, hover = un cran plus foncé
                }
              }

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="hsl(var(--foreground) / 0.3)"
                  strokeWidth={1}
                  onMouseEnter={() => {
                    if (deptCode) setHoveredDeptCode(deptCode);
                  }}
                  onMouseLeave={() => setHoveredDeptCode(null)}
                  onTouchStart={() => {
                    if (deptCode) setHoveredDeptCode(deptCode);
                  }}
                  title={deptName}
                  onClick={() => {
                    // Click sur carte neutre: désélection de ville
                    onCityClick("");
                  }}
                  style={{
                    default: { outline: "none", cursor: "pointer" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>

        {Object.entries(personsByCity).map(([key, cityPersons]) => {
          const coords = key.split(",").map(Number) as [number, number];
          const count = cityPersons.length;
          const city = cityPersons[0].city;
          const isSelected = selectedCity === city;

          return (
            <Marker key={key} coordinates={coords}>
              <g
                onClick={(e) => {
                  e.stopPropagation();
                  onCityClick(isSelected ? "" : city);
                }}
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
                className="cursor-pointer"
                style={{ transition: "all 0.3s ease" }}
              >
                {hoveredCity === city && (
                  <g>
                    <rect
                      x={-30}
                      y={-35}
                      width={60}
                      height={20}
                      rx={4}
                      fill="hsl(var(--background))"
                      stroke="hsl(var(--border))"
                      strokeWidth={0.5}
                      opacity={0.95}
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                      }}
                    />
                    <text
                      textAnchor="middle"
                      y={-21}
                      className="text-[8px] font-semibold fill-foreground select-none"
                      style={{ pointerEvents: "none" }}
                    >
                      {city}
                    </text>
                  </g>
                )}
                <circle
                  r={isSelected ? 12 : 8}
                  fill={isSelected ? "hsl(var(--primary))" : "hsl(var(--secondary))"}
                  stroke="white"
                  strokeWidth={2}
                  className="animate-pulse"
                  style={{
                    filter: isSelected
                      ? "drop-shadow(0 0 8px hsl(var(--primary)))"
                      : "drop-shadow(0 0 6px hsl(var(--secondary)))",
                  }}
                />
                {count > 1 && (
                  <text
                    textAnchor="middle"
                    y={4}
                    className="text-xs font-bold fill-white select-none"
                  >
                    {count}
                  </text>
                )}
              </g>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
};
