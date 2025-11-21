import { useState, useEffect, KeyboardEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Person } from "@/types/person";
import type { Agency } from "@/types/agency";
import { FRENCH_CITIES } from "@/data/cities";
import { Trash2, Upload, Pencil, X, Check, ChevronsUpDown, Search } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDepartments } from "@/hooks/useDepartments";

interface CmsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  persons: Person[];
  onAddPerson: (person: Omit<Person, "id" | "coordinates">) => void;
  onUpdatePerson: (id: string, person: Omit<Person, "id" | "coordinates">) => void;
  onDeletePerson: (id: string) => void;
  agencies: Agency[];
  onAddAgency: (agency: Omit<Agency, "id"> & { id?: string }) => void;
  onUpdateAgency: (id: string, agency: Partial<Agency>) => void;
  onDeleteAgency: (id: string) => void;
}

export const CmsModal = ({
  open,
  onOpenChange,
  persons,
  onAddPerson,
  onUpdatePerson,
  onDeletePerson,
  agencies,
  onAddAgency,
  onUpdateAgency,
  onDeleteAgency,
}: CmsModalProps) => {
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    skills: [] as string[],
    city: "",
    email: "",
    phone: "",
    photo: "",
    fonction: "" as "" | "franchisé" | "franchisée" | "indépendant" | "indépendante" | "consultant" | "consultante" | "intégré" | "intégrée",
    agencyId: "" as string,
  });
  const [skillInput, setSkillInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [citySearchOpen, setCitySearchOpen] = useState(false);
  const { departments } = useDepartments();
  const [agencyTab, setAgencyTab] = useState<"persons" | "agencies">("persons");
  const [editingAgencyId, setEditingAgencyId] = useState<string | null>(null);
  const [agencyCityOpen, setAgencyCityOpen] = useState(false);
  const [deptPopoverOpen, setDeptPopoverOpen] = useState(false);
  const [agencyForm, setAgencyForm] = useState({
    name: "",
    city: "",
    departmentCodes: [] as string[],
  });

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      skills: [],
      city: "",
      email: "",
      phone: "",
      photo: "",
      fonction: "",
      agencyId: "",
    });
    setSkillInput("");
    setEditingPersonId(null);
  };
  const resetAgencyForm = () => {
    setAgencyForm({
      name: "",
      city: "",
      departmentCodes: [],
    });
    setEditingAgencyId(null);
  };

  // Filtrer les personnes selon le terme de recherche
  const filteredPersons = persons.filter((person) => {
    const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
    const city = person.city.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || city.includes(search);
  });

  useEffect(() => {
    if (!open) {
      resetForm();
      resetAgencyForm();
    }
  }, [open]);

  const handleEdit = (person: Person) => {
    setFormData({
      firstName: person.firstName,
      lastName: person.lastName,
      skills: person.skills || [],
      city: person.city,
      email: person.email || "",
      phone: person.phone || "",
      photo: person.photo || "",
      fonction: person.fonction || "",
      agencyId: person.agencyId || "",
    });
    setEditingPersonId(person.id);
  };

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData({ ...formData, skills: [...formData.skills, trimmedSkill] });
      setSkillInput("");
    }
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.city || !formData.email) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const personData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      skills: formData.skills,
      city: formData.city,
      email: formData.email,
      phone: formData.phone,
      photo: formData.photo,
      ...(formData.agencyId && { agencyId: formData.agencyId }),
      ...(formData.fonction && { fonction: formData.fonction as "franchisé" | "franchisée" | "indépendant" | "indépendante" | "consultant" | "consultante" | "intégré" | "intégrée" }),
    };
    
    if (editingPersonId) {
      onUpdatePerson(editingPersonId, personData);
      toast.success("Personne modifiée avec succès !");
    } else {
      onAddPerson(personData);
      toast.success("Personne ajoutée avec succès !");
    }
    
    resetForm();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Centre d'administration
          </DialogTitle>
        </DialogHeader>

        <Tabs value={agencyTab} onValueChange={(v) => setAgencyTab(v as any)} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="persons">Personnes</TabsTrigger>
            <TabsTrigger value="agencies">Agences</TabsTrigger>
          </TabsList>

          <TabsContent value="persons" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulaire d'ajout/modification */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                {editingPersonId ? "Modifier une personne" : "Ajouter une personne"}
              </h3>
              {editingPersonId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className="text-muted-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Annuler
                </Button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Marie"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Dubois"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="exemple@workandyou.fr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Compétences</Label>
                <Input
                  id="skills"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Tapez une compétence et appuyez sur Entrée"
                />
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="pl-3 pr-1 py-1 flex items-center gap-1"
                      >
                        {skill}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville *</Label>
                <Popover open={citySearchOpen} onOpenChange={setCitySearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={citySearchOpen}
                      className="w-full justify-between"
                    >
                      {formData.city || "Sélectionner une ville..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Rechercher une ville..." />
                      <CommandList>
                        <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                        <CommandGroup>
                          {FRENCH_CITIES.map((city) => (
                            <CommandItem
                              key={city.name}
                              value={city.name}
                              onSelect={(currentValue) => {
                                setFormData({ ...formData, city: currentValue });
                                setCitySearchOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.city === city.name ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {city.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fonction">Fonction</Label>
                <Select
                  value={formData.fonction}
                  onValueChange={(value) => setFormData({ ...formData, fonction: value as "franchisé" | "franchisée" | "indépendant" | "indépendante" | "consultant" | "consultante" | "intégré" | "intégrée" })}
                >
                  <SelectTrigger id="fonction">
                    <SelectValue placeholder="Sélectionner une fonction..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="franchisé">Franchisé</SelectItem>
                    <SelectItem value="franchisée">Franchisée</SelectItem>
                    <SelectItem value="indépendant">Indépendant</SelectItem>
                    <SelectItem value="indépendante">Indépendante</SelectItem>
                    <SelectItem value="consultant">Consultant</SelectItem>
                    <SelectItem value="consultante">Consultante</SelectItem>
                    <SelectItem value="intégré">Intégré</SelectItem>
                    <SelectItem value="intégrée">Intégrée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="agency">Agence</Label>
                <Select
                  value={formData.agencyId}
                  onValueChange={(val) => setFormData({ ...formData, agencyId: val })}
                >
                  <SelectTrigger id="agency">
                    <SelectValue placeholder="Rattacher à une agence (optionnel)" />
                  </SelectTrigger>
                  <SelectContent>
                    {agencies.map((ag) => (
                      <SelectItem key={ag.id} value={ag.id}>
                        {ag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Photo</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("photo")?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {formData.photo ? "Photo ajoutée" : "Télécharger une photo"}
                  </Button>
                </div>
                {formData.photo && (
                  <img
                    src={formData.photo}
                    alt="Aperçu"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-secondary to-primary hover:opacity-90">
                {editingPersonId ? "Modifier" : "Ajouter"}
              </Button>
            </form>
          </div>

          {/* Liste des personnes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                Personnes enregistrées ({persons.length})
              </h3>
            </div>
            
            {/* Champ de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredPersons.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucune personne trouvée
                </p>
              ) : (
                filteredPersons.map((person) => (
                <div
                  key={person.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:border-secondary transition-colors"
                >
                  {person.photo ? (
                    <img
                      src={person.photo}
                      alt={`${person.firstName} ${person.lastName}`}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {person.firstName[0]}
                      {person.lastName[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {person.firstName} {person.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {person.city}
                    </p>
                    {person.skills && person.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {person.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(person)}
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (editingPersonId === person.id) {
                          resetForm();
                        }
                        onDeletePerson(person.id);
                        toast.success("Personne supprimée");
                      }}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
          </TabsContent>

          <TabsContent value="agencies" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulaire Agence */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">
                  {editingAgencyId ? "Modifier une agence" : "Ajouter une agence"}
                </h3>
                {editingAgencyId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetAgencyForm}
                    className="text-muted-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Annuler
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="agName">Nom de l'agence *</Label>
                <Input
                  id="agName"
                  value={agencyForm.name}
                  onChange={(e) => setAgencyForm({ ...agencyForm, name: e.target.value })}
                  placeholder="Agence Bordeaux"
                />
              </div>

              <div className="space-y-2">
                <Label>Ville *</Label>
                <Popover open={agencyCityOpen} onOpenChange={setAgencyCityOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={agencyCityOpen} className="w-full justify-between">
                      {agencyForm.city || "Sélectionner une ville..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Rechercher une ville..." />
                      <CommandList>
                        <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                        <CommandGroup>
                          {FRENCH_CITIES.map((city) => (
                            <CommandItem
                              key={city.name}
                              value={city.name}
                              onSelect={(val) => {
                                setAgencyForm({ ...agencyForm, city: val });
                                setAgencyCityOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  agencyForm.city === city.name ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {city.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Départements couverts (1 à 5)</Label>
                <Popover open={deptPopoverOpen} onOpenChange={setDeptPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {agencyForm.departmentCodes.length > 0
                        ? `${agencyForm.departmentCodes.length} sélectionné(s)`
                        : "Sélectionner des départements..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Rechercher un département..." />
                      <CommandList>
                        <CommandEmpty>Aucun département trouvé.</CommandEmpty>
                        <CommandGroup>
                          {departments.map((d) => {
                            const selected = agencyForm.departmentCodes.includes(d.code);
                            return (
                              <CommandItem
                                key={d.code}
                                value={`${d.name} ${d.code}`}
                                onSelect={() => {
                                  const next = selected
                                    ? agencyForm.departmentCodes.filter((c) => c !== d.code)
                                    : [...agencyForm.departmentCodes, d.code];
                                  setAgencyForm({ ...agencyForm, departmentCodes: next });
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4", selected ? "opacity-100" : "opacity-0")} />
                                {d.name} ({d.code})
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {agencyForm.departmentCodes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {agencyForm.departmentCodes.map((code) => (
                      <Badge key={code} variant="secondary" className="pl-3 pr-1 py-1 flex items-center gap-1">
                        {code}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() =>
                            setAgencyForm({
                              ...agencyForm,
                              departmentCodes: agencyForm.departmentCodes.filter((c) => c !== code),
                            })
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button
                className="w-full bg-gradient-to-r from-secondary to-primary hover:opacity-90"
                onClick={() => {
                  if (!agencyForm.name || !agencyForm.city) {
                    toast.error("Nom et ville sont requis");
                    return;
                  }
                  if (editingAgencyId) {
                    onUpdateAgency(editingAgencyId, agencyForm);
                    toast.success("Agence modifiée");
                  } else {
                    onAddAgency(agencyForm);
                    toast.success("Agence ajoutée");
                  }
                  resetAgencyForm();
                }}
              >
                {editingAgencyId ? "Modifier" : "Ajouter"}
              </Button>
            </div>

            {/* Liste des agences */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Agences ({agencies.length})</h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {agencies.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Aucune agence</p>
                ) : (
                  agencies.map((ag) => (
                    <div key={ag.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{ag.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{ag.city}</p>
                          {ag.departmentCodes?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {ag.departmentCodes.map((c) => (
                                <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingAgencyId(ag.id);
                              setAgencyForm({
                                name: ag.name,
                                city: ag.city,
                                departmentCodes: ag.departmentCodes ?? [],
                              });
                            }}
                            className="text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (editingAgencyId === ag.id) resetAgencyForm();
                              onDeleteAgency(ag.id);
                              toast.success("Agence supprimée");
                            }}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};