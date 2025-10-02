import { GridRowWide } from "./GridRowWide";
import { GridRowTwoUp } from "./GridRowTwoUp";
import { GridRowFeature } from "./GridRowFeature";
import type { ProjectDoc } from "@/lib/types/project";
import { isProject } from "@/lib/utils/typeguards";

export type ProjectsGridProps = Readonly<{ projects: ProjectDoc[] }>;

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  type RowType = "WIDE" | "TWO_UP" | "FEATURE";
  type Row = { type: RowType; items: ProjectDoc[] };

  const order: RowType[] = ["WIDE", "TWO_UP", "FEATURE"]; // visual rhythm
  const rows: Row[] = [];

  let i = 0;
  let t = 0;
  while (i < projects.length) {
    const type = order[t % order.length];
    if (type === "WIDE") {
      rows.push({ type, items: [projects[i]] });
      i += 1;
    } else {
      rows.push({
        type,
        items: [projects[i], projects[i + 1]].filter(isProject),
      });
      i += 2;
    }
    t++;
  }

  return (
    <div>
      {rows.map((row, idx) => {
        switch (row.type) {
          case "WIDE":
            return <GridRowWide key={idx} a={row.items[0]} />;
          case "TWO_UP":
            return <GridRowTwoUp key={idx} items={row.items} />;
          case "FEATURE":
          default:
            return <GridRowFeature key={idx} items={row.items} />;
        }
      })}
    </div>
  );
}
