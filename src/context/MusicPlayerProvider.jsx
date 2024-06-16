import React, { createContext, useState, useCallback } from 'react';

export const MusicPlayerContext = createContext();

const MusicPlayerProvider = ({ children }) => {
  const [musicData, setMusicData] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  const playTrack = useCallback((index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  }, []);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % musicData.length);
  }, [musicData.length]);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + musicData.length) % musicData.length);
  }, [musicData.length]);

  const updatePlayed = useCallback((played) => {
    setPlayed(played);
  }, []);

  const updateDuration = useCallback((duration) => {
    setDuration(duration);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffling((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setIsRepeating((prev) => !prev);
  }, []);

  const handleTrackEnd = useCallback(() => {
    if (isShuffling) {
      const randomIndex = Math.floor(Math.random() * musicData.length);
      playTrack(randomIndex);
    } else {
      nextTrack();
    }
  }, [isShuffling, musicData.length, nextTrack, playTrack]);

  const addTrackToList = useCallback((track) => {
    setMusicData((prevData) => [track, ...prevData]);
  }, []);

  const addTrackToEnd = useCallback((track) => {
    setMusicData((prevData) => [...prevData, track]);
  }, []);

  return (
    <MusicPlayerContext.Provider
      value={{
        musicData,
        setMusicData,  // 추가: 음악 데이터를 설정하는 함수
        currentTrackIndex,
        isPlaying,
        played,
        duration,
        playTrack,
        pauseTrack,
        nextTrack,
        prevTrack,
        updatePlayed,
        updateDuration,
        toggleShuffle,
        isShuffling,
        toggleRepeat,
        isRepeating,
        handleTrackEnd,
        addTrackToList, // 추가: 리스트 앞에 트랙을 추가하는 함수
        addTrackToEnd, // 추가: 리스트 끝에 트랙을 추가하는 함수
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export default MusicPlayerProvider;
