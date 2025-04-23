import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { usePlaylists } from '../context/PlaylistContext';

const PlayerContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background-color: black;
  border-radius: ${({ theme, isFullscreen }) => isFullscreen ? '0' : theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.large};
  margin-bottom: ${({ theme, isFullscreen }) => isFullscreen ? '0' : theme.spacing.lg};
  min-height: 500px;
  
  ${({ isFullscreen }) => isFullscreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    aspect-ratio: auto;
  `}

  .react-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const Controls = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 2;
`;

const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 5px;
  background-color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  border-radius: 5px;
  position: relative;
  
  &:hover {
    height: 8px;
  }
`;

const ProgressBarFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ progress }) => `${progress * 100}%`};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 5px;
  transition: width 0.1s linear;
`;

const ProgressIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: ${({ progress }) => `${progress * 100}%`};
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${ProgressBarContainer}:hover & {
    opacity: 1;
  }
`;

const TimeDisplay = styled.div`
  color: white;
  font-size: 0.875rem;
  margin-left: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ControlButton = styled.button`
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }
  
  svg {
    width: ${({ small }) => small ? '16px' : '20px'};
    height: ${({ small }) => small ? '16px' : '20px'};
  }
`;

const TextButton = styled.button`
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
    transform: translateY(-2px);
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 60px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  outline: none;
  border-radius: 2px;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background-color: white;
    border-radius: 50%;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background-color: white;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00';
  
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  return [
    h > 0 ? h : null,
    m.toString().padStart(2, '0'),
    s.toString().padStart(2, '0')
  ].filter(Boolean).join(':');
};

const MediaPlayer = ({ url, title, onProgress, initialProgress = 0, onEnded }) => {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadedSeconds, setLoadedSeconds] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const { updateWatchProgress } = usePlaylists();
  
  // Handle controls visibility
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      
      const timeout = setTimeout(() => {
        if (playing) {
          setShowControls(false);
        }
      }, 3000);
      
      setControlsTimeout(timeout);
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseMove);
      container.addEventListener('mouseleave', () => {
        setShowControls(false);
        if (controlsTimeout) {
          clearTimeout(controlsTimeout);
        }
      });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseMove);
        container.removeEventListener('mouseleave', () => {
          setShowControls(false);
          if (controlsTimeout) {
            clearTimeout(controlsTimeout);
          }
        });
      }
      
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout, playing]);
  
  // Handle fullscreen
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isFullscreen]);
  
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);
  
  // Apply initial progress without prompt
  useEffect(() => {
    if (initialProgress > 0 && initialProgress < 0.95 && playerRef.current) {
      playerRef.current.seekTo(initialProgress);
    }
  }, [initialProgress]);
  
  const handlePlay = () => {
    setPlaying(true);
  };
  
  const handlePause = () => {
    setPlaying(false);
  };
  
  const handleProgress = (state) => {
    setProgress(state.played);
    setPlayedSeconds(state.playedSeconds);
    setLoadedSeconds(state.loadedSeconds);
    
    // Store progress every 5 seconds
    if (playerRef.current && duration > 0) {
      const currentSeconds = state.playedSeconds;
      if (Math.floor(currentSeconds) % 5 === 0) {
        updateWatchProgress(url, state.played);
        if (onProgress) onProgress(state.played);
      }
    }
  };
  
  const handleDuration = (duration) => {
    setDuration(duration);
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };
  
  const toggleMute = () => {
    setMuted(!muted);
  };
  
  const handleSkipForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.min(currentTime + 10, duration));
    }
  };
  
  const handleSkipBackward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.max(currentTime - 10, 0));
    }
  };
  
  const handleSkipIntro = () => {
    if (playerRef.current) {
      // Skip roughly the first 1.5 minutes (90 seconds)
      playerRef.current.seekTo(Math.min(90, duration * 0.1));
    }
  };
  
  const handleClickProgressBar = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const width = bounds.width;
    const percent = x / width;
    playerRef.current.seekTo(percent);
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <PlayerContainer 
      ref={containerRef}
      isFullscreen={isFullscreen}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        className="react-player"
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        controls={false}
        onPlay={handlePlay}
        onPause={handlePause}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={onEnded}
        config={{
          file: {
            attributes: {
              crossOrigin: "anonymous",
              controlsList: "nodownload"
            }
          }
        }}
      />
      
      <Controls
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls || !playing ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ProgressBarContainer onClick={handleClickProgressBar}>
          <ProgressBarFill progress={progress} />
          <ProgressIndicator progress={progress} />
        </ProgressBarContainer>
        
        <ControlsRow>
          <ButtonGroup>
            <ControlButton onClick={handleSkipBackward} small>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.9999 9.00005L9.99992 12L12.9999 15M8.99992 9.00005L5.99992 12L8.99992 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 12L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </ControlButton>
            
            <ControlButton onClick={() => setPlaying(!playing)}>
              {playing ? (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 9V15M14 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 12L10 16.3301V7.66987L16 12Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </ControlButton>
            
            <ControlButton onClick={handleSkipForward} small>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 9.00005L14 12L11 15M15 9.00005L18 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </ControlButton>
            
            <TimeDisplay>
              {formatTime(playedSeconds)} / {formatTime(duration)}
            </TimeDisplay>
          </ButtonGroup>
          
          <ButtonGroup>
            <TextButton onClick={handleSkipIntro}>
              Pular introdução
            </TextButton>
            
            <VolumeControl>
              <ControlButton onClick={toggleMute} small>
                {muted || volume === 0 ? (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 9L17 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 9L23 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : volume < 0.5 ? (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.07 4.93C20.9447 6.8049 21.9978 9.34835 21.9978 12C21.9978 14.6516 20.9447 17.1951 19.07 19.07M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </ControlButton>
              <VolumeSlider
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
            </VolumeControl>
            
            <ControlButton onClick={toggleFullscreen} small>
              {isFullscreen ? (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3V6C8 6.53043 7.78929 7.03914 7.41421 7.41421C7.03914 7.78929 6.53043 8 6 8H3M21 8H18C17.4696 8 16.9609 7.78929 16.5858 7.41421C16.2107 7.03914 16 6.53043 16 6V3M16 21V18C16 17.4696 16.2107 16.9609 16.5858 16.5858C16.9609 16.2107 17.4696 16 18 16H21M3 16H6C6.53043 16 7.03914 16.2107 7.41421 16.5858C7.78929 16.9609 8 17.4696 8 18V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V8M21 8V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H16M16 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V16M3 16V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </ControlButton>
          </ButtonGroup>
        </ControlsRow>
      </Controls>
    </PlayerContainer>
  );
};

export default MediaPlayer; 