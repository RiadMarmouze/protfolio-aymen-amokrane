import CollaborationViewer from "./viewer";

export default function CollabPage({ params }: { params: { id: string } }) {
  return <CollaborationViewer id={params.id} />;
}
