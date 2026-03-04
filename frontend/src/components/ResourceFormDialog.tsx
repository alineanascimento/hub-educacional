import { useState, useEffect } from "react";
import { Resource, ResourceFormData, ResourceType } from "@/types/resource";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, X } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource?: Resource | null;
  onSubmit: (data: ResourceFormData) => void;
}

const EMPTY_FORM: ResourceFormData = {
  title: "",
  description: "",
  type: "video",
  url: "",
  tags: [],
};

export function ResourceFormDialog({ open, onOpenChange, resource, onSubmit }: Props) {
  const [form, setForm] = useState<ResourceFormData>(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [isAssisting, setIsAssisting] = useState(false);

  useEffect(() => {
    if (resource) {
      setForm({
        title: resource.title,
        description: resource.description,
        type: resource.type,
        url: resource.url,
        tags: [...resource.tags],
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setTagInput("");
  }, [resource, open]);

  const handleSmartAssist = async () => {
    if (!form.title.trim()) {
      toast.error("Digite um título antes de usar o Smart Assist");
      return;
    }
    setIsAssisting(true);
    try {
      const res = await fetch(`${API_URL}/ai/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, resource_type: form.type }),
      });
      if (!res.ok) throw new Error("Erro na API");
      const result = await res.json();
      setForm((prev) => ({
        ...prev,
        description: result.description,
        tags: result.tags,
      }));
      toast.success("Descrição e tags geradas com sucesso!");
    } catch {
      toast.error("Erro ao gerar sugestões. Tente novamente.");
    } finally {
      setIsAssisting(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    onSubmit(form);
    onOpenChange(false);
  };

  const isEdit = !!resource;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Recurso" : "Novo Recurso"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Ex: Introdução à Álgebra Linear"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tipo *</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm((p) => ({ ...p, type: v as ResourceType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                value={form.url}
                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Descrição</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSmartAssist}
                disabled={isAssisting}
                className="gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/5"
              >
                {isAssisting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                {isAssisting ? "Gerando..." : "Smart Assist"}
              </Button>
            </div>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Descreva o recurso educacional..."
              rows={3}
              className={isAssisting ? "animate-pulse" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Adicione uma tag e pressione Enter"
                className="flex-1"
              />
              <Button type="button" variant="secondary" size="sm" onClick={addTag}>
                Adicionar
              </Button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {form.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="rounded-full p-0.5 hover:bg-foreground/10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEdit ? "Salvar" : "Cadastrar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
