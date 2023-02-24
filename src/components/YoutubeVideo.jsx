const YoutubeVideo = ({ videoId, title }) => {
  return (
    <div className="youtube-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="aspect-video w-full rounded-xl"
      ></iframe>
    </div>
  );
};

export default YoutubeVideo;
