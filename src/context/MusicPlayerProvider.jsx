import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const MusicPlayerContext = createContext();

const MusicPlayerProvider = ({ children }) => {
  const [musicData, setMusicData] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setPlayed(0);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const nextTrack = () => {
    if (isShuffling) {
      setCurrentTrackIndex(Math.floor(Math.random() * musicData.length));
    } else {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % musicData.length);
    }
    setIsPlaying(true);
    setPlayed(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + musicData.length) % musicData.length);
    setIsPlaying(true);
    setPlayed(0);
  };

  const updatePlayed = (played) => {
    setPlayed(played);
  };

  const updateDuration = (duration) => {
    setDuration(duration);
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  const handleTrackEnd = () => {
    if (isRepeating) {
      setPlayed(0);
      setIsPlaying(true);
    } else {
      nextTrack();
    }
  };
    // 재생 목록에 트랙을 추가하는 함수
    const addTrackToList = (track) => {
        setMusicData((prevMusicData) => [track, ...prevMusicData]);
    };

    // 재생 목록의 끝에 트랙을 추가하는 함수
    const addTrackToEnd = (track) => {
        setMusicData((prevMusicData) => [...prevMusicData, track]);
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/list_data/bhlist.json');
        const data = await response.json();
        setMusicData(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <MusicPlayerContext.Provider
      value={{
        musicData,
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
        addTrackToList,
        addTrackToEnd
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

MusicPlayerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MusicPlayerProvider;
