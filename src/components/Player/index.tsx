import styles from './styles.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useRef } from 'react';
import { convertDuationToTimeString } from '../../utils/convertDuationToTimeString';
import { useState } from 'react';

export default function Player() {
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    tooglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    isLooping,
    hasNext,
    hasPrevious,
    isShufling,
    toogleLoop,
    toogleShuffle,
    clearPlayerState
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {}, []);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const setUpPlayerListener = () => {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  };

  const onEnded = () => {
    if (hasNext) {
      playNext()
    } else {
      clearPlayerState()
    }

  }

  const onHoldSlider = (counter: number) => {
    audioRef.current.currentTime = counter;
    setProgress(counter);
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg"></img>
        <strong>Tocando agora </strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />

          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um pocadast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={`${styles.progress}`}>
          <span>{convertDuationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={onHoldSlider}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDuationToTimeString(episode?.duration ?? 0)}</span>
        </div>
        {episode && (
          <audio
            ref={audioRef}
            autoPlay
            onLoadedMetadata={setUpPlayerListener}
            onEnded={onEnded}
            loop={isLooping}
            src={episode.url}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}
        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toogleShuffle}
            className={isShufling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg"></img>
          </button>
          <button
            type="button"
            disabled={!episode || !hasPrevious}
            onClick={playPrevious}
          >
            <img src="/play-previous.svg"></img>
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={tooglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg"></img>
            ) : (
              <img src="/play.svg"></img>
            )}
          </button>
          <button
            type="button"
            disabled={!episode || !hasNext}
            onClick={playNext}
          >
            <img src="/play-next.svg"></img>
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toogleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg"></img>
          </button>
        </div>
      </footer>
    </div>
  );
}
