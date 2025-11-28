import { useState } from "react";
import { FranceMap } from "@/components/FranceMap";
import { PersonCard } from "@/components/PersonCard";
import { CmsModal } from "@/components/CmsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Search } from "lucide-react";
import { usePersons } from "@/hooks/usePersons";
import { useAgencies } from "@/hooks/useAgencies";
import { useDepartments } from "@/hooks/useDepartments";

const Index = () => {
  const { persons, addPerson, updatePerson, deletePerson } = usePersons();
  const { agencies, addAgency, updateAgency, deleteAgency } = useAgencies();
  const { departments, byNameIndex } = useDepartments();
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [deptQuery, setDeptQuery] = useState("");
  const [cmsOpen, setCmsOpen] = useState(false);

  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const filteredPersons = persons.filter((p) => {
    const matchesCity = selectedCity ? p.city === selectedCity : true;
    const matchesSearch = searchQuery
      ? normalizeString(p.firstName).includes(normalizeString(searchQuery)) ||
        normalizeString(p.lastName).includes(normalizeString(searchQuery)) ||
        normalizeString(p.city).includes(normalizeString(searchQuery)) ||
        (p.skills && p.skills.some(skill => normalizeString(skill).includes(normalizeString(searchQuery))))
      : true;
    return matchesCity && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Header avec bouton CMS */}
      <header className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Carte Work&You
          </h1>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Rechercher par nom, ville ou compétence..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedCity(undefined);
              }}
              className="pl-10"
            />
          </div>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Rechercher un département (ex: Gironde, 33)..."
              value={deptQuery}
              onChange={(e) => {
                setDeptQuery(e.target.value);
                // si on recherche par département, on ne force pas une agence
                setSelectedAgencyId(undefined);
              }}
              className="pl-10"
            />
          </div>
          <div className="w-full max-w-xs">
            <Select
              value={selectedAgencyId ?? "all"}
              onValueChange={(val) => setSelectedAgencyId(val === "all" ? undefined : val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrer par agence" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Agences</SelectLabel>
                  <SelectItem value="all">Toutes les agences</SelectItem>
                  {agencies.map((ag) => (
                    <SelectItem key={ag.id} value={ag.id}>
                      {ag.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte */}
          <div className="lg:col-span-2 h-[600px] lg:h-[700px]">
            <FranceMap
              persons={persons}
              selectedCity={selectedCity}
              agencies={agencies}
              selectedAgencyId={selectedAgencyId}
              highlightDeptCodes={(() => {
                const q = byNameIndex.normalize(deptQuery || "");
                if (!q) return [];
                // match par nom normalisé ou code exact
                const byName = byNameIndex.map.get(q) ?? [];
                const codeMatch = departments.find((d) => d.code === deptQuery.trim());
                const codes = new Set<string>();
                byName.forEach((d) => codes.add(d.code));
                if (codeMatch) codes.add(codeMatch.code);
                return Array.from(codes);
              })()}
              onCityClick={(city) => {
                setSelectedCity(city || undefined);
                setSearchQuery("");
              }}
            />
          </div>

          {/* Liste des fiches */}
          <div className="space-y-4 lg:h-[700px] overflow-y-auto">
            <div className="sticky top-0 bg-background/80 backdrop-blur-sm py-2 z-10 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  Personnes ({filteredPersons.length}{(selectedCity || searchQuery) && ` / ${persons.length}`})
                </h2>
                {(selectedCity || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCity(undefined);
                      setSearchQuery("");
                    }}
                    className="text-sm"
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>
              {(selectedCity || searchQuery) && (
                <p className="text-sm text-muted-foreground">
                  {selectedCity && `Ville: ${selectedCity}`}
                  {selectedCity && searchQuery && " • "}
                  {searchQuery && `Recherche: "${searchQuery}"`}
                </p>
              )}
            </div>
            {persons.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <p>Aucune personne enregistrée.</p>
                <p className="text-sm mt-2">
                  Cliquez sur le bouton paramètres pour ajouter des personnes.
                </p>
              </div>
            ) : filteredPersons.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <p>Aucune personne dans cette ville.</p>
              </div>
            ) : (
              filteredPersons.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  isSelected={false}
                  onClick={() => {}}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Bouton CMS flottant */}
      <Button
        size="lg"
        onClick={() => setCmsOpen(true)}
        className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-2xl bg-gradient-to-br from-primary to-secondary hover:scale-110 transition-transform"
        style={{
          boxShadow: "0 0 40px rgba(59, 130, 246, 0.5)",
        }}
      >
        <Settings className="w-6 h-6" />
      </Button>

      {/* Modal CMS */}
      <CmsModal
        open={cmsOpen}
        onOpenChange={setCmsOpen}
        persons={persons}
        onAddPerson={addPerson}
        onUpdatePerson={updatePerson}
        onDeletePerson={deletePerson}
        agencies={agencies}
        onAddAgency={addAgency}
        onUpdateAgency={updateAgency}
        onDeleteAgency={deleteAgency}
      />
    </div>
  );
};

export default Index;
