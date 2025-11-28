import { Person } from "@/types/person";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Mail, Phone } from "lucide-react";

interface PersonCardProps {
  person: Person;
  isSelected?: boolean;
  onClick?: () => void;
}

export const PersonCard = ({ person, isSelected, onClick }: PersonCardProps) => {
  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden border-2 ${
        isSelected
          ? "border-primary shadow-[0_0_30px_rgba(59,130,246,0.4)]"
          : "border-border hover:border-secondary hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]"
      }`}
      onClick={onClick}
    >
      <div className="relative h-48 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 overflow-hidden">
        {person.photo ? (
          <img
            src={person.photo}
            alt={`${person.firstName} ${person.lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-24 h-24 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <Badge
          variant="secondary"
          className="absolute bottom-3 left-3 bg-secondary/90 backdrop-blur-sm"
        >
          <MapPin className="w-3 h-3 mr-1" />
          {person.city}
        </Badge>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
            {person.firstName} {person.lastName}
          </h3>
        </div>

        {person.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4 text-primary" />
            <span className="truncate">{person.email}</span>
          </div>
        )}

        {person.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4 text-secondary" />
            <span>{person.phone}</span>
          </div>
        )}
        
        {person.skills && person.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {person.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-secondary/80 hover:bg-secondary"
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
