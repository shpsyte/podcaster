import { useContext, createContext, ReactNode, useCallback, useState } from 'react';

type Episode = {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShufling: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  setPlayingState: (state: boolean) => void;
  tooglePlay: () => void;
  toogleLoop: () => void;
  toogleShuffle: () => void;
  play: (episodes: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayerState: () => void;

};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
};

export const PlayerContextProvider = ({
  children,
}: PlayerContextProviderProps) => {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShufling, setShufling] = useState(false);

  const playList = useCallback((list: Episode[], index: number) => {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  },[setEpisodeList, setCurrentEpisodeIndex, setIsPlaying])

  const play = useCallback(
    episode => {
      setEpisodeList([episode]);
      setCurrentEpisodeIndex(0);
      setIsPlaying(true);
    },
    [setEpisodeList, setCurrentEpisodeIndex, setIsPlaying],
  );

  const tooglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [setIsPlaying, isPlaying]);

  const toogleLoop = useCallback(() => {
    setIsLooping(!isLooping);
  }, [setIsLooping, isLooping]);

  const toogleShuffle = useCallback(() => {
    setShufling(!isShufling);
  }, [setShufling, isShufling]);

  const setPlayingState = useCallback(
    (state: boolean) => {
      setIsPlaying(state);
    },
    [setIsPlaying],
  );

  const hasPrevious  = currentEpisodeIndex > 0
  const hasNext = isShufling || (currentEpisodeIndex + 1 ) <= episodeList.length

  const playNext = () => {
    if (isShufling) {
      const nextRandomEpisode = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisode)
    } else if (hasNext) {
        setCurrentEpisodeIndex(currentEpisodeIndex + 1)
      }
  }

  const playPrevious = () => {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  const clearPlayerState = () => {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0)
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        hasPrevious,
        isLooping,
        isShufling,
        hasNext,
        play,
        tooglePlay,
        setPlayingState,
        playList,
        playPrevious,
        playNext,
        toogleLoop,
        toogleShuffle,
        clearPlayerState
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};


export const usePlayer = () => {
  return useContext(PlayerContext)

}
