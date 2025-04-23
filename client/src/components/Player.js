import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #000;
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  width: 100%;
  background-color: #000;
`;

const StyledReactPlayer = styled(ReactPlayer)`
  position: absolute;
  top: 0;
  left: 0;
`;

const ControlsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #111;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  color: #fff;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const BackButton = styled(Button)`
  background-color: #333;
  
  &:hover {
    background-color: #555;
  }
`;

const Player = ({ playlist }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoItem, setVideoItem] = useState(null);
  const [played, setPlayed] = useState(0);
  
  useEffect(() => {
    // Check if we have a playlist and valid allItems array
    if (playlist && playlist.allItems && playlist.allItems.length > 0) {
      // Find the video by ID (index)
      const item = playlist.allItems[parseInt(id, 10)];
      if (item) {
        setVideoItem(item);
        
        // Load saved progress if available
        const savedProgress = localStorage.getItem(`video-progress-${id}`);
        if (savedProgress) {
          setPlayed(parseFloat(savedProgress));
        }
      }
    }
  }, [playlist, id]);
  
  const handleProgress = (state) => {
    // Save progress to localStorage
    localStorage.setItem(`video-progress-${id}`, state.played.toString());
    setPlayed(state.played);
  };
  
  const handleSkipIntro = () => {
    // Skip ahead 90 seconds (typical intro length)
    setPlayed(played + 90 / (videoItem?.duration || 3600));
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  if (!videoItem) {
    return (
      <PlayerContainer>
        <ControlsBar>
          <Title>Carregando...</Title>
          <BackButton onClick={handleGoBack}>Voltar</BackButton>
        </ControlsBar>
      </PlayerContainer>
    );
  }
  
  return (
    <PlayerContainer>
      <VideoWrapper>
        <StyledReactPlayer
          url={videoItem.url}
          width="100%"
          height="100%"
          playing={true}
          controls={true}
          light={false}
          playsinline={true}
          played={played}
          onProgress={handleProgress}
        />
      </VideoWrapper>
      
      <ControlsBar>
        <Title>{videoItem.title}</Title>
        <div>
          <Button onClick={handleSkipIntro}>Pular Intro</Button>
          <BackButton onClick={handleGoBack}>Voltar</BackButton>
        </div>
      </ControlsBar>
    </PlayerContainer>
  );
};

export default Player; 