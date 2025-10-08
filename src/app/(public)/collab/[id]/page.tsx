import CollaborationViewer from "./viewer";
export default async function CollabPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params; 
  return <CollaborationViewer id={id} />;
}
