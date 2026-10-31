export interface ServerTemplate {
  _id?: string;
  title: string;
  movieUrl: string;
  tvUrl: string;
  order?: number;
  recommended?: boolean;
  fast?: boolean;
  ads?: boolean;
  isActive?: boolean;
  updatedAt?: number;
}

export interface FormattedServerSource {
  title: string;
  source: string;
  recommended?: boolean;
  fast?: boolean;
  ads?: boolean;
}

export interface StreamingUrlParams {
  id: string | number;
  season?: number | string;
  episode?: number | string;
  media_type?: string;
}

export interface ServerPreset extends ServerTemplate {
  order: number;
  isActive: boolean;
}

export const defaultStreamingServers: ServerPreset[] = [
  {
    title: "VidLink",
    movieUrl: "https://vidlink.pro/movie/{id}?primaryColor=0278fd&autoplay=false",
    tvUrl: "https://vidlink.pro/tv/{id}/{season}/{episode}?primaryColor=0278fd&autoplay=false",
    recommended: true,
    fast: true,
    ads: true,
    isActive: true,
    order: 1,
  },
  {
    title: "ZXCStream",
    movieUrl: "https://zxcstream.cc/player/movie/{id}",
    tvUrl: "https://zxcstream.cc/player/tv/{id}/{season}/{episode}",
    recommended: true,
    fast: true,
    ads: true,
    isActive: true,
    order: 2,
  },
  {
    title: "Vidstuck",
    movieUrl: "https://vidstuck.cc/embed/movie/{id}?back=false&loading=2&progress=0",
    tvUrl: "https://vidstuck.cc/embed/tv/{id}/{season}/{episode}?back=false&loading=2&progress=0",
    recommended: false,
    fast: true,
    ads: true,
    isActive: true,
    order: 3,
  },
  {
    title: "Vidbolt",
    movieUrl: "https://vidbolt.xyz/movie/{id}",
    tvUrl: "https://vidbolt.xyz/tv/{id}/{season}/{episode}",
    recommended: false,
    fast: true,
    ads: true,
    isActive: true,
    order: 4,
  },
  {
    title: "Vidfast",
    movieUrl: "https://vidfast.vc/movie/{id}",
    tvUrl: "https://vidfast.vc/tv/{id}/{season}/{episode}",
    recommended: false,
    fast: true,
    ads: true,
    isActive: true,
    order: 5,
  },
  {
    title: "Vaplayer",
    movieUrl: "https://vaplayer.ru/embed/movie/{id}",
    tvUrl: "https://vaplayer.ru/embed/tv/{id}/{season}/{episode}",
    recommended: false,
    fast: true,
    ads: true,
    isActive: true,
    order: 6,
  },
  {
    title: "Vidsrcme",
    movieUrl: "https://vidsrcme.ru/embed/movie/{id}",
    tvUrl: "https://vidsrcme.ru/embed/tv/{id}/{season}/{episode}",
    recommended: false,
    fast: true,
    ads: true,
    isActive: true,
    order: 7,
  },
  {
    title: "NontonGo",
    movieUrl: "https://www.nontongo.win/embed/movie/{id}",
    tvUrl: "https://www.nontongo.win/embed/tv/{id}/{season}/{episode}",
    recommended: false,
    fast: false,
    ads: true,
    isActive: true,
    order: 8,
  },
  {
    title: "AutoEmbed",
    movieUrl: "https://autoembed.net/movie/tmdb/{id}",
    tvUrl: "https://autoembed.net/tv/tmdb/{id}-{season}-{episode}",
    recommended: false,
    fast: true,
    ads: true,
    isActive: true,
    order: 9,
  },
  {
    title: "2Embed",
    movieUrl: "https://www.2embed.cc/embed/{id}",
    tvUrl: "https://www.2embed.cc/embedtv/{id}&s={season}&e={episode}",
    recommended: false,
    fast: false,
    ads: true,
    isActive: true,
    order: 10,
  },
  // Inactive presets
  {
    title: "VidKing",
    movieUrl: "https://www.vidking.net/embed/movie/{id}",
    tvUrl: "https://www.vidking.net/embed/tv/{id}/{season}/{episode}",
    recommended: true,
    fast: true,
    ads: true,
    isActive: false,
    order: 11,
  },
  {
    title: "SuperEmbed",
    movieUrl: "https://multiembed.mov/directstream.php?video_id={id}&tmdb=1",
    tvUrl: "https://multiembed.mov/directstream.php?video_id={id}&tmdb=1&season={season}&episode={episode}",
    recommended: false,
    fast: true,
    ads: true,
    isActive: false,
    order: 12,
  },
  {
    title: "FilmKu",
    movieUrl: "https://filmku.stream/embed/movie?tmdb={id}",
    tvUrl: "https://filmku.stream/embed/series?tmdb={id}&sea={season}&epi={episode}",
    recommended: false,
    fast: false,
    ads: true,
    isActive: false,
    order: 13,
  },
  {
    title: "VidSrc",
    movieUrl: "https://vidsrc.xyz/embed/movie/{id}",
    tvUrl: "https://vidsrc.xyz/embed/tv/{id}/{season}/{episode}",
    recommended: false,
    fast: false,
    ads: true,
    isActive: false,
    order: 14,
  },
];

export function formatStreamingUrl(
  template: string,
  { id, season = 1, episode = 1 }: StreamingUrlParams,
): string {
  if (!template) return "";
  return template
    .replaceAll("{id}", String(id))
    .replaceAll("{season}", String(season ?? 1))
    .replaceAll("{episode}", String(episode ?? 1));
}

export function formatStreamingServers(
  servers: ServerTemplate[],
  params: StreamingUrlParams,
): FormattedServerSource[] {
  const isTv = params.media_type === "tv";
  return servers
    .filter((s) => s.isActive !== false)
    .map((s) => {
      const template = isTv ? s.tvUrl : s.movieUrl;
      const source = formatStreamingUrl(template, params);
      return {
        title: s.title,
        source,
        recommended: Boolean(s.recommended),
        fast: Boolean(s.fast),
        ads: s.ads !== undefined ? Boolean(s.ads) : true,
      };
    })
    .filter((s) => Boolean(s.source));
}

export function streamingProviderList(
  params: StreamingUrlParams & { dynamicServers?: ServerTemplate[] | null },
): FormattedServerSource[] {
  const sourceServers = params.dynamicServers ?? [];
  return formatStreamingServers(sourceServers, params);
}
