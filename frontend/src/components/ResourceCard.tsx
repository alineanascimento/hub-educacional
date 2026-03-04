import { Resource } from "@/types/resource";
import { TypeBadge } from "./TypeBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
}

export function ResourceCard({ resource, onEdit, onDelete }: Props) {
  return (
    <Card className="glass-card group transition-all duration-200 hover:shadow-md hover:border-primary/20">
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <TypeBadge type={resource.type} />
            <span className="text-xs text-muted-foreground">
              {format(resource.updatedAt, "dd MMM yyyy", { locale: ptBR })}
            </span>
          </div>
          <h3 className="font-semibold text-base leading-tight line-clamp-2">
            {resource.title}
          </h3>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(resource)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(resource.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">{resource.description}</p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {resource.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
