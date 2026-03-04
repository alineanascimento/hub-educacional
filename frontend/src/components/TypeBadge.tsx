import { ResourceType } from "@/types/resource";
import { Video, FileText, ExternalLink } from "lucide-react";

const config: Record<ResourceType, { label: string; icon: typeof Video; className: string }> = {
  video: { label: "Vídeo", icon: Video, className: "bg-tag-video/10 text-tag-video border-tag-video/20" },
  pdf: { label: "PDF", icon: FileText, className: "bg-tag-pdf/10 text-tag-pdf border-tag-pdf/20" },
  link: { label: "Link", icon: ExternalLink, className: "bg-tag-link/10 text-tag-link border-tag-link/20" },
};

export function TypeBadge({ type }: { type: ResourceType }) {
  const { label, icon: Icon, className } = config[type.toLowerCase() as ResourceType];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
