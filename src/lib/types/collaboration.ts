export type CollaborationDoc = {
  id?: string;
  projectTitle: string;
  summary: string;
  contact: { name: string; email: string };
  status: "pending" | "approved" | "rejected";
  published: boolean;
  createdAt?: number;
  updatedAt?: number;
};
