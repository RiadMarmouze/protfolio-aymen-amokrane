import ProjectThumb from "@/components/ProjectThumb";
import type { ProjectDoc } from "@/lib/types/project";
export function GridRowFeature({ items }: { items: ProjectDoc[] }) {
  const [first, second] = items;
  return (
    <div className="mb-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProjectThumb p={first} ratio="2x1" />
        </div>
        {second && (
          <ProjectThumb key={second.id ?? second.slug} p={second} ratio="1x1" />
        )}
      </div>
    </div>
  );
}
