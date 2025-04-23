import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import styled, { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import { theme } from './styles/theme';
import Home from './pages/Home';
import Player from './pages/Player';
import SeriesPage from './pages/SeriesPage';
import MoviesPage from './pages/MoviesPage';
import ChannelsPage from './pages/ChannelsPage';
import FavoritesPage from './pages/FavoritesPage';
import { PlaylistProvider } from './context/PlaylistContext';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <PlaylistProvider>
        <Router>
          <AppContainer>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/play/:id" element={<Player />} />
                <Route path="/series" element={<SeriesPage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/channels" element={<ChannelsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
              </Routes>
            </AnimatePresence>
          </AppContainer>
        </Router>
      </PlaylistProvider>
    </ThemeProvider>
  );
}

export default App;
