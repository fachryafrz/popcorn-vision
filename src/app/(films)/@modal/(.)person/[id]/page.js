import { getPerson } from "@/lib/fetch";
import PersonModal from "@/components/Modals/PersonModal";

export default async function page({ params }) {
  const { id } = params;

  const person = await getPerson({ id });

  return <PersonModal person={person} />;
}
