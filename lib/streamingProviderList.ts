export const streamingProviderList = ({ media_type, id, season, episode }) => [
  {
    title: "VidLink",
    source:
      media_type !== "tv"
        ? `https://vidlink.pro/movie/${id}?primaryColor=0278fd&autoplay=false`
        : `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=0278fd&autoplay=false`,
    recommended: true,
    fast: true,
    ads: true,
  },
  {
    title: "<Embed>",
    source:
      media_type !== "tv"
        ? `https://embed.su/embed/movie/${id}`
        : `https://embed.su/embed/tv/${id}/${season}/${episode}`,
    recommended: true,
    ads: true,
  },
  {
    title: "SuperEmbed",
    source:
      media_type !== "tv"
        ? `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`
        : `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&season=${season}&episode=${episode}`,
    recommended: true,
    fast: true,
    ads: true,
  },
  {
    title: "FilmKu",
    source:
      media_type !== "tv"
        ? `https://filmku.stream/embed/movie?tmdb=${id}`
        : `https://filmku.stream/embed/series?tmdb=${id}&sea=${season}&epi=${episode}`,
    ads: true,
  },
  {
    title: "NontonGo",
    source:
      media_type !== "tv"
        ? `https://www.nontongo.win/embed/movie/${id}`
        : `https://www.nontongo.win/embed/tv/${id}/${season}/${episode}`,
    ads: true,
  },
  {
    title: "AutoEmbed",
    source:
      media_type !== "tv"
        ? `https://autoembed.co/movie/tmdb/${id}`
        : `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`,
    fast: true,
    ads: true,
  },
  {
    title: "2Embed",
    source:
      media_type !== "tv"
        ? `https://www.2embed.cc/embed/${id}`
        : `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
    ads: true,
  },
  {
    title: "VidSrc 1",
    source:
      media_type !== "tv"
        ? `https://vidsrc.xyz/embed/movie/${id}`
        : `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`,
    ads: true,
  },
  {
    title: "VidSrc 2",
    source:
      media_type !== "tv"
        ? `https://vidsrc.to/embed/movie/${id}`
        : `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`,
    ads: true,
  },
  {
    title: "MoviesAPI",
    source:
      media_type !== "tv"
        ? `https://moviesapi.club/movie/${id}`
        : `https://moviesapi.club/tv/${id}/${season}/${episode}`,
    ads: true,
  },
];
