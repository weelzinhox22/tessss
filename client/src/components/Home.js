import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 10px;
  color: #fff;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #aaa;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  max-width: 600px;
  margin: 0 auto 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #1e1e1e;
  color: #fff;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #0069d9;
  }
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const CategoryCard = styled.div`
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CategoryTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const ItemCount = styled.p`
  color: #aaa;
  font-size: 0.9rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 30px;
  font-size: 1.2rem;
  color: #aaa;
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 99, 71, 0.1);
  color: #ff6347;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin: 20px auto;
  max-width: 600px;
`;

const Home = ({ loadPlaylist, playlist, loading, error }) => {
  const [playlistUrl, setPlaylistUrl] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (playlistUrl.trim()) {
      loadPlaylist(playlistUrl);
    }
  };
  
  const renderCategories = () => {
    if (!playlist || !playlist.categories) return null;
    
    // Filter out the __series__ special category
    const categories = Object.entries(playlist.categories).filter(
      ([key]) => key !== '__series__'
    );
    
    // Add series as a special category if it exists
    const seriesData = playlist.categories.__series__;
    const seriesList = seriesData ? Object.values(seriesData) : [];
    
    return (
      <CategoryGrid>
        {seriesList.length > 0 && (
          <CategoryCard as={Link} to="/series/all/1">
            <CategoryTitle>Séries</CategoryTitle>
            <ItemCount>{seriesList.length} séries</ItemCount>
          </CategoryCard>
        )}
        
        {categories.map(([category, items]) => (
          <CategoryCard key={category} as={Link} to={`/category/${category}`}>
            <CategoryTitle>{category}</CategoryTitle>
            <ItemCount>{items.length} itens</ItemCount>
          </CategoryCard>
        ))}
      </CategoryGrid>
    );
  };
  
  return (
    <HomeContainer>
      <Header>
        <Title>WelPlayTV</Title>
        <Subtitle>Carregue e assista suas playlists M3U favoritas</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Cole a URL da sua playlist M3U aqui..."
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Carregando...' : 'Carregar Playlist'}
          </Button>
        </Form>
      </Header>
      
      {loading && <LoadingMessage>Carregando sua playlist...</LoadingMessage>}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {playlist && renderCategories()}
    </HomeContainer>
  );
};

export default Home; 