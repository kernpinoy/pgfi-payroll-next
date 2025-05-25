export default function EmployeeDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <div>Employee Details: {params.id}</div>;
}
