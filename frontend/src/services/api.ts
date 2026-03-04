const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface ResourceFromAPI {
  id: string;
  title: string;
  description: string | null;
  resource_type: string;
  url: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface ResourcePayload {
  title: string;
  description?: string;
  resource_type: string;
  url: string;
  tags?: string[];
}

export interface PaginatedResponse {
  data: ResourceFromAPI[];
  total: number;
  totalPages: number;
}

// Busca todos os recursos com paginação
export async function getResources(page: number, perPage: number): Promise<PaginatedResponse> {
  const skip = (page - 1) * perPage;
  const res = await fetch(`${API_URL}/materials/?skip=${skip}&limit=${perPage}`);
  if (!res.ok) throw new Error("Erro ao buscar recursos");

  const data: ResourceFromAPI[] = await res.json();

  // Busca total para calcular páginas
  const allRes = await fetch(`${API_URL}/materials/?skip=0&limit=9999`);
  const allData: ResourceFromAPI[] = await allRes.json();
  const total = allData.length;

  return {
    data,
    total,
    totalPages: Math.ceil(total / perPage),
  };
}

// Busca um recurso por ID
export async function getResourceById(id: string): Promise<ResourceFromAPI> {
  const res = await fetch(`${API_URL}/materials/${id}`);
  if (!res.ok) throw new Error("Recurso não encontrado");
  return res.json();
}

// Cria um novo recurso
export async function createResource(payload: ResourcePayload): Promise<ResourceFromAPI> {
  const res = await fetch(`${API_URL}/materials/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erro ao criar recurso");
  return res.json();
}

// Atualiza um recurso existente
export async function updateResource(id: string, payload: Partial<ResourcePayload>): Promise<ResourceFromAPI> {
  const res = await fetch(`${API_URL}/materials/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erro ao atualizar recurso");
  return res.json();
}

// Deleta um recurso
export async function deleteResource(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/materials/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao deletar recurso");
}
