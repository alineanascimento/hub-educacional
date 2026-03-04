export type ResourceType = "video" | "pdf" | "link";

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceFormData {
  title: string;
  description: string;
  type: ResourceType;
  url: string;
  tags: string[];
}

export interface SmartAssistResponse {
  description: string;
  tags: string[];
}
