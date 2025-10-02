import ProjectThumb from "@/components/ProjectThumb";
import type { ProjectDoc } from "@/lib/types/project";
export function GridRowWide({ a }: { a: ProjectDoc }) {
  return (
    <div className="mb-6">
      <div className="grid gap-6">
        <ProjectThumb p={a} ratio="3x1" />
      </div>
    </div>
  );
}
