import ProjectThumb from "@/components/ProjectThumb";
import type { ProjectDoc } from "@/lib/types/project";
export function GridRowTwoUp({ items }: { items: ProjectDoc[] }) {
  return (
    <div className="mb-6">
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((p) => (
          <ProjectThumb key={p.id ?? p.slug} p={p} ratio="1x1" />
        ))}
      </div>
    </div>
  );
}
