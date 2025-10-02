import { firestore } from "@/lib/firebase/client";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { ProjectDoc } from "@/lib/types/project";

export async function repoGetPublishedProjects(
  max = 24
): Promise<ProjectDoc[]> {
  try {
    const q = query(
      collection(firestore, "projects"),
      where("published", "==", true),
      orderBy("updatedAt", "desc"),
      limit(max)
    );
    const snap = await getDocs(q);
    console.log("✅ Projects:", snap.docs);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch (err) {
    console.error("[repoGetPublishedProjects] error:", err);
    return [];
  }
}
