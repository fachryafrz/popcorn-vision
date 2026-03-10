import { axios } from "@/lib/axios";
import { siteConfig } from "@/config/site";
import ClientPersonDetail from "@/components/Person/ClientPersonDetail";

async function getPerson({ id, path }) {
  const res = await axios.get(`/person/${id}${path}`, {
    params: {
      language: "en",
      append_to_response: `combined_credits,movie_credits,tv_credits,images`,
    },
  });

  return res.data;
}

export async function generateMetadata({ params }) {
  const { id } = params;

  const [person, images] = await Promise.all([
    getPerson({ id, path: "" }),
    getPerson({ id, path: "/images" }),
  ]);

  let profiles;

  let path =
    images.profiles.length > 0
      ? images.profiles[0].file_path
      : "";
      
  if (path) {
    profiles = {
      images: `https://image.tmdb.org/t/p/w500${path}`,
    };
  }

  return {
    title: `${person.name}`,
    description: person.biography,
    openGraph: {
      title: `${person.name}`,
      description: person.biography,
      url: `${siteConfig.url}/${`person`}/${person.id}`,
      siteName: siteConfig.name,
      ...profiles,
      locale: "en_US",
      type: "website",
    },
  };
}

export default function Person({ params }) {
  const { id } = params;

  return <ClientPersonDetail id={id} />;
}
