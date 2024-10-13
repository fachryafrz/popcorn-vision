"use client";

import FilmPoster from "./Poster";
import CastsList from "./CastsList";
import FilmInfo from "./Info";
import FilmOverview from "./Overview";
import { EpisodeModal } from "../../Modals/EpisodeModal";
import { useSearchParams } from "next/navigation";
import ShareModal from "@/components/Modals/ShareModal";
import PersonModal from "@/components/Modals/PersonModal";
import LoginAlert from "@/components/Modals/LoginAlert";
import { useAuth } from "@/hooks/auth";

export default function FilmContent({
  film,
  videos,
  images,
  reviews,
  credits,
  providers,
  collection,
  isTvPage,
  releaseDates,
}) {
  const { user } = useAuth();

  const searchParams = useSearchParams();
  const seasonParams = searchParams.get("season");
  const episodeParams = searchParams.get("episode");
  const personParams = searchParams.get("person");

  return (
    <div className={`z-10 mt-[30%] md:mt-[200px]`}>
      <div
        className={`mx-auto grid max-w-none grid-cols-1 gap-4 px-4 pb-4 md:grid-cols-12 lg:grid-cols-24`}
      >
        {/* Poster */}
        <section className={`md:col-[1/4] lg:col-[1/6] lg:row-[1/3]`}>
          <div className={`mx-auto flex h-full w-[60svw] md:m-0 md:w-auto`}>
            <FilmPoster
              film={film}
              videos={videos}
              images={images}
              reviews={reviews}
            />
          </div>
        </section>

        {/* Info */}
        <section className={`md:col-[4/13] lg:col-[6/20]`}>
          <FilmInfo
            film={film}
            videos={videos}
            images={images}
            reviews={reviews}
            credits={credits}
            providers={providers}
            releaseDates={releaseDates}
          />
        </section>

        {/* Overview */}
        <section className={`md:col-[1/9] lg:col-[6/20]`}>
          <FilmOverview
            film={film}
            videos={videos}
            images={images}
            reviews={reviews}
            credits={credits}
            providers={providers}
            collection={collection}
          />
        </section>

        {/* Casts & Credits */}
        <section
          className={`md:col-[9/13] md:row-[2/5] lg:col-[20/25] lg:row-[1/3]`}
        >
          {credits.cast.length > 0 && <CastsList credits={credits} />}
        </section>

        {/* Misc */}
        <section className={`col-span-full fixed`}>
          <ShareModal />

          {!user && <LoginAlert />}

          {isTvPage && seasonParams && episodeParams && (
            <EpisodeModal film={film} />
          )}

          {personParams && <PersonModal />}
        </section>
      </div>
    </div>
  );
}
