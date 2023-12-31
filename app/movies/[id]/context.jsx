import { createContext, useState } from "react";

export const DetailsContext = createContext(undefined);

export const DetailsProvider = ({ children }) => {
  const [episodeModal, setEpisodeModal] = useState();
  const [personModal, setPersonModal] = useState();
  const [activeSeasonPoster, setActiveSeasonPoster] = useState();

  return (
    <DetailsContext.Provider
      value={{
        episodeModal,
        setEpisodeModal,
        personModal,
        setPersonModal,
        activeSeasonPoster,
        setActiveSeasonPoster,
      }}
    >
      {children}
    </DetailsContext.Provider>
  );
};
