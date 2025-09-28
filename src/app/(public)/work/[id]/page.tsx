import ProjectViewer from "./viewer";

export default async function ProjectPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  return <ProjectViewer id={id} />;
}
