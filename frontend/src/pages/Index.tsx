import { useState, useEffect, useCallback } from "react";
import { Resource, ResourceFormData } from "@/types/resource";
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  ResourceFromAPI,
} from "@/services/api";
import { ResourceCard } from "@/components/ResourceCard";
import { ResourceFormDialog } from "@/components/ResourceFormDialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const PER_PAGE = 6;

// Converte o formato da API para o formato do frontend
function toResource(r: ResourceFromAPI): Resource {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    type: r.resource_type as Resource["type"],
    url: r.url,
    tags: r.tags ?? [],
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
  };
}

const Index = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Resource[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editResource, setEditResource] = useState<Resource | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getResources(page, PER_PAGE);
      setData(result.data.map(toResource));
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch {
      toast.error("Erro ao carregar recursos");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleCreate = async (formData: ResourceFormData) => {
    try {
      await createResource({
        title: formData.title,
        description: formData.description,
        resource_type: formData.type,
        url: formData.url,
        tags: formData.tags,
      });
      toast.success("Recurso cadastrado com sucesso!");
      setPage(1);
      fetchResources();
    } catch {
      toast.error("Erro ao cadastrar recurso");
    }
  };

  const handleEdit = async (formData: ResourceFormData) => {
    if (!editResource) return;
    try {
      await updateResource(editResource.id, {
        title: formData.title,
        description: formData.description,
        resource_type: formData.type,
        url: formData.url,
        tags: formData.tags,
      });
      toast.success("Recurso atualizado com sucesso!");
      setEditResource(null);
      fetchResources();
    } catch {
      toast.error("Erro ao atualizar recurso");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteResource(deleteId);
      toast.success("Recurso excluído com sucesso!");
      setDeleteId(null);
      if (data.length === 1 && page > 1) setPage((p) => p - 1);
      else fetchResources();
    } catch {
      toast.error("Erro ao excluir recurso");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">CIN Hub Educacional</h1>
              <p className="text-xs text-muted-foreground">Hub Inteligente de Recursos</p>
            </div>
          </div>
          <Button onClick={() => { setEditResource(null); setFormOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Recurso
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? "Carregando..." : `${total} ${total === 1 ? "recurso" : "recursos"} encontrados`}
          </p>
        </div>

        {!loading && data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h2 className="text-lg font-semibold mb-1">Nenhum recurso cadastrado</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Comece adicionando seu primeiro recurso educacional.
            </p>
            <Button onClick={() => { setEditResource(null); setFormOpen(true); }} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Recurso
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onEdit={(r) => { setEditResource(r); setFormOpen(true); }}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    className="w-9"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Dialogs */}
      <ResourceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        resource={editResource}
        onSubmit={editResource ? handleEdit : handleCreate}
      />
      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Index;
