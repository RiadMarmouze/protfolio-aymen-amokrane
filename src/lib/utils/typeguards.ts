import type { ProjectDoc } from "@/lib/types/project";

export const isProject = (x: ProjectDoc | undefined): x is ProjectDoc => Boolean(x);