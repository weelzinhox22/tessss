import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import parseM3U from '../utils/m3uParser';

const PlaylistContext = createContext();

export const usePlaylists = () => useContext(PlaylistContext);

// Constantes para o localStorage
const CACHE_KEYS = {
  WATCH_HISTORY: 'streamplay_watch_history',
  PLAYLIST_URL: 'streamplay_playlist_url',
  PLAYLIST_DATA: 'streamplay_playlist_data',
  CACHE_TIMESTAMP: 'streamplay_cache_timestamp',
  FAVORITES: 'streamplay_favorites'
};

// Tempo de validade do cache (24 horas)
const CACHE_VALIDITY = 24 * 60 * 60 * 1000;

// Determina o endpoint correto com base no ambiente
const getApiEndpoint = () => {
  // Verifica se está no ambiente Netlify
  if (window.location.hostname.includes('netlify.app') || 
      process.env.REACT_APP_NETLIFY === 'true') {
    return '/.netlify/functions/playlist';
  }
  
  // Caso contrário, usa o endpoint padrão (Express)
  return '/api/playlist';
};

export const PlaylistProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState({});
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [allItems, setAllItems] = useState([]);
  const [watchHistory, setWatchHistory] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  // Função para verificar se o cache está válido
  const isCacheValid = useCallback(() => {
    const timestamp = localStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
    if (!timestamp) return false;
    
    const now = new Date().getTime();
    return now - parseInt(timestamp, 10) < CACHE_VALIDITY;
  }, []);

  // Carrega dados do localStorage
  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        // Carregar histórico de visualização
        const storedHistory = localStorage.getItem(CACHE_KEYS.WATCH_HISTORY);
        if (storedHistory) {
          setWatchHistory(JSON.parse(storedHistory));
        }
        
        // Carregar URL da playlist
        const lastUrl = localStorage.getItem(CACHE_KEYS.PLAYLIST_URL);
        if (lastUrl) {
          setPlaylistUrl(lastUrl);
        }
        
        // Carregar favoritos
        const storedFavorites = localStorage.getItem(CACHE_KEYS.FAVORITES);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
        
        // Verificar se existe cache válido da playlist
        if (isCacheValid()) {
          const cachedPlaylistData = localStorage.getItem(CACHE_KEYS.PLAYLIST_DATA);
          if (cachedPlaylistData) {
            const parsedData = JSON.parse(cachedPlaylistData);
            setCategories(parsedData.categories || {});
            setAllItems(parsedData.allItems || []);
            console.log('Playlist carregada do cache');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
      }
    };
    
    loadFromLocalStorage();
  }, [isCacheValid]);

  // Salva histórico no localStorage
  useEffect(() => {
    localStorage.setItem(CACHE_KEYS.WATCH_HISTORY, JSON.stringify(watchHistory));
  }, [watchHistory]);
  
  // Salva favoritos no localStorage
  useEffect(() => {
    localStorage.setItem(CACHE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  // Implementação otimizada da busca usando useMemo
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return allItems.filter(item => 
      item.title.toLowerCase().includes(query) || 
      (item.seriesName && item.seriesName.toLowerCase().includes(query)) ||
      (item.group && item.group.toLowerCase().includes(query))
    );
  }, [searchQuery, allItems]);

  // Busca playlist de forma otimizada
  const fetchPlaylist = useCallback(async (url) => {
    try {
      // Verifica se já temos dados em cache e se a URL é a mesma
      if (
        playlistUrl === url && 
        Object.keys(categories).length > 0 && 
        isCacheValid()
      ) {
        console.log('Usando dados em cache');
        return { categories, allItems };
      }
      
      setIsLoading(true);
      setError(null);
      
      // Adiciona um valor padrão para URL caso esteja vazia
      const urlToFetch = url || 'https://is.gd/angeexx';
      
      const apiEndpoint = getApiEndpoint();
      console.log(`Usando endpoint: ${apiEndpoint}`);
      
      const response = await axios.get(`${apiEndpoint}?url=${encodeURIComponent(urlToFetch)}`, {
        timeout: 30000 // 30 segundos de timeout para evitar esperas muito longas
      });
      
      const { categories: newCategories, allItems: newAllItems } = response.data;
      
      // Salvar dados
      setCategories(newCategories || {});
      setAllItems(newAllItems || []);
      setPlaylistUrl(urlToFetch);
      
      // Cache no localStorage
      localStorage.setItem(CACHE_KEYS.PLAYLIST_URL, urlToFetch);
      localStorage.setItem(CACHE_KEYS.PLAYLIST_DATA, JSON.stringify({ 
        categories: newCategories,
        allItems: newAllItems 
      }));
      localStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, new Date().getTime().toString());
      
      setIsLoading(false);
      return response.data;
    } catch (err) {
      console.error('Erro ao buscar playlist:', err);
      setError(err.response?.data?.message || 'Falha ao carregar a playlist');
      setIsLoading(false);
      throw err;
    }
  }, [categories, allItems, playlistUrl, isCacheValid]);

  // Força o carregamento da playlist padrão se não houver conteúdo
  useEffect(() => {
    const loadDefaultPlaylist = async () => {
      // Se não tiver categoria e não estiver carregando, forçar o carregamento da playlist
      if (Object.keys(categories).length === 0 && !isLoading) {
        try {
          // Usa uma URL padrão se não houver playlistUrl
          const url = playlistUrl || 'https://is.gd/angeexx';
          console.log('Carregando playlist padrão:', url);
          await fetchPlaylist(url);
        } catch (err) {
          console.error('Erro ao carregar playlist padrão:', err);
        }
      }
    };
    
    loadDefaultPlaylist();
  }, [categories, isLoading, playlistUrl, fetchPlaylist]);

  // Limpa o cache da playlist
  const clearPlaylistCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEYS.PLAYLIST_DATA);
    localStorage.removeItem(CACHE_KEYS.CACHE_TIMESTAMP);
    console.log('Cache da playlist limpo');
  }, []);

  // Adiciona um item aos favoritos
  const addToFavorites = useCallback((itemOrUrl) => {
    if (!itemOrUrl) return;
    
    setFavorites(prev => {
      // Handle both string URLs and item objects
      const url = typeof itemOrUrl === 'string' ? itemOrUrl : itemOrUrl.url;
      
      // Check if already in favorites
      if (prev.some(fav => typeof fav === 'string' ? fav === url : fav.url === url)) {
        return prev;
      }
      
      const newItem = typeof itemOrUrl === 'string' ? itemOrUrl : itemOrUrl;
      const updated = [...prev, newItem];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  }, []);
  
  // Remove um item dos favoritos
  const removeFromFavorites = useCallback((itemOrUrl) => {
    if (!itemOrUrl) return;
    
    setFavorites(prev => {
      const url = typeof itemOrUrl === 'string' ? itemOrUrl : itemOrUrl.url;
      
      const updated = prev.filter(fav => 
        typeof fav === 'string' ? fav !== url : fav.url !== url
      );
      
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  }, []);
  
  // Verifica se um item está nos favoritos
  const isFavorite = useCallback((itemOrUrl) => {
    if (!itemOrUrl) return false;
    
    const url = typeof itemOrUrl === 'string' ? itemOrUrl : itemOrUrl.url;
    
    return favorites.some(fav => 
      typeof fav === 'string' ? fav === url : fav.url === url
    );
  }, [favorites]);
  
  // Obtém todos os itens favoritos
  const getFavoriteItems = useCallback(() => {
    return allItems.filter(item => 
      favorites.some(fav => 
        typeof fav === 'string' ? fav === item.url : fav.url === item.url
      )
    );
  }, [allItems, favorites]);
  
  // Marca um item como assistido até um determinado ponto
  const markWatchedUpTo = useCallback((itemUrl, progress = 1) => {
    if (!itemUrl) return;
    setWatchHistory(prev => ({
      ...prev,
      [itemUrl]: {
        ...prev[itemUrl],
        progress: progress,
        lastWatched: new Date().toISOString(),
        isCompleted: progress >= 0.95
      }
    }));
  }, []);
  
  // Verifica se um item já foi assistido completamente
  const isWatched = useCallback((url) => {
    return watchHistory[url]?.isCompleted || false;
  }, [watchHistory]);
  
  // Obtém todos os itens assistidos
  const getWatchedItems = useCallback(() => {
    const watchedUrls = Object.keys(watchHistory)
      .filter(url => watchHistory[url].isCompleted);
    return allItems.filter(item => watchedUrls.includes(item.url));
  }, [allItems, watchHistory]);

  // Atualiza progresso de visualização
  const updateWatchProgress = useCallback((itemUrl, progress) => {
    if (!itemUrl) return;
    setWatchHistory(prev => ({
      ...prev,
      [itemUrl]: {
        ...prev[itemUrl],
        progress: progress,
        lastWatched: new Date().toISOString(),
        isCompleted: progress >= 0.95
      }
    }));
  }, []);

  // Busca item por URL de maneira otimizada
  const getItemByUrl = useCallback((url) => {
    return allItems.find(item => item.url === url);
  }, [allItems]);

  // Busca progresso de visualização
  const getWatchProgress = useCallback((url) => {
    return watchHistory[url]?.progress || 0;
  }, [watchHistory]);
  
  // Obtém itens em andamento (começou a assistir mas não terminou)
  const getInProgressItems = useCallback(() => {
    const inProgressUrls = Object.keys(watchHistory).filter(url => {
      const item = watchHistory[url];
      return item.progress > 0 && item.progress < 0.95;
    });
    
    return allItems
      .filter(item => inProgressUrls.includes(item.url))
      .sort((a, b) => {
        // Ordena por data de última visualização (mais recente primeiro)
        const dateA = new Date(watchHistory[a.url]?.lastWatched || 0);
        const dateB = new Date(watchHistory[b.url]?.lastWatched || 0);
        return dateB - dateA;
      });
  }, [allItems, watchHistory]);

  // Fetch playlist from URL
  const fetchPlaylistM3U = useCallback(async (url) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First attempt direct fetch
      let response;
      try {
        response = await fetch(url);
      } catch (err) {
        // If direct fetch fails (CORS issue), try with a proxy
        console.log("Direct fetch failed, trying with proxy", err);
        response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch playlist: ${response.statusText}`);
      }
      
      const data = await response.text();
      const parsed = parseM3U(data);
      
      return {
        url,
        name: url.split('/').pop() || 'New Playlist',
        ...parsed
      };
    } catch (err) {
      setError(`Error fetching playlist: ${err.message}`);
      console.error("Error fetching playlist:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load saved playlists from localStorage
  const loadSavedPlaylists = useCallback(() => {
    try {
      const savedPlaylists = localStorage.getItem('playlists');
      if (savedPlaylists) {
        return JSON.parse(savedPlaylists);
      }
    } catch (err) {
      console.error('Error loading saved playlists:', err);
    }
    return [];
  }, []);

  // Save playlists to localStorage
  const savePlaylists = useCallback((playlists) => {
    try {
      localStorage.setItem('playlists', JSON.stringify(playlists));
    } catch (err) {
      console.error('Error saving playlists:', err);
    }
  }, []);

  // Add a new playlist
  const addPlaylist = useCallback(async (url) => {
    const playlist = await fetchPlaylistM3U(url);
    if (playlist) {
      setPlaylists(prev => {
        const updated = [...prev, playlist];
        savePlaylists(updated);
        return updated;
      });
      
      if (!currentPlaylist) {
        setCurrentPlaylist(playlist);
        setAllItems(playlist.items);
        setCategories(playlist.categories);
      }
      
      return playlist;
    }
    return null;
  }, [fetchPlaylistM3U, currentPlaylist, savePlaylists]);

  // Remove a playlist
  const removePlaylist = useCallback((playlistUrl) => {
    setPlaylists(prev => {
      const updated = prev.filter(p => p.url !== playlistUrl);
      savePlaylists(updated);
      
      // If we removed the current playlist, switch to another one if available
      if (currentPlaylist && currentPlaylist.url === playlistUrl) {
        if (updated.length > 0) {
          setCurrentPlaylist(updated[0]);
          setAllItems(updated[0].items);
          setCategories(updated[0].categories);
        } else {
          setCurrentPlaylist(null);
          setAllItems([]);
          setCategories([]);
        }
      }
      
      return updated;
    });
  }, [currentPlaylist, savePlaylists]);

  // Switch to a different playlist
  const switchPlaylist = useCallback((playlistUrl) => {
    const playlist = playlists.find(p => p.url === playlistUrl);
    if (playlist) {
      setCurrentPlaylist(playlist);
      setAllItems(playlist.items);
      setCategories(playlist.categories);
      return true;
    }
    return false;
  }, [playlists]);

  // Get items by category
  const getItemsByCategory = useCallback((category) => {
    return allItems.filter(item => item.group === category);
  }, [allItems]);

  // Load initial playlist from URL
  useEffect(() => {
    const initialPlaylistUrl = "https://is.gd/angeexx";
    
    // Load saved playlists and favorites
    const savedPlaylists = loadSavedPlaylists();
    setPlaylists(savedPlaylists);
    
    const storedFavorites = localStorage.getItem(CACHE_KEYS.FAVORITES);
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
    
    // Check if the initial playlist is already in saved playlists
    const existing = savedPlaylists.find(p => p.url === initialPlaylistUrl);
    
    if (existing) {
      setCurrentPlaylist(existing);
      setAllItems(existing.items);
      setCategories(existing.categories);
    } else {
      // Fetch and add the initial playlist
      addPlaylist(initialPlaylistUrl);
    }
  }, [addPlaylist, loadSavedPlaylists]);

  // Organize by categories for easy access
  const itemsByCategory = useMemo(() => {
    const result = {};
    
    // Check if categories is an array before using forEach
    if (Array.isArray(categories)) {
      categories.forEach(category => {
        result[category] = allItems.filter(item => 
          item.group === category || 
          (item.group && item.group.includes(category))
        );
      });
    } else if (typeof categories === 'object' && categories !== null) {
      // If categories is an object, use Object.keys
      Object.keys(categories).forEach(category => {
        result[category] = allItems.filter(item => 
          item.group === category || 
          (item.group && item.group.includes(category))
        );
      });
    }
    
    return result;
  }, [allItems, categories]);

  // Context value
  const value = {
    isLoading,
    error,
    categories,
    playlistUrl,
    fetchPlaylist,
    updateWatchProgress,
    getItemByUrl,
    getWatchProgress,
    watchHistory,
    allItems,
    searchQuery,
    setSearchQuery,
    searchResults,
    clearPlaylistCache,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoriteItems,
    markWatchedUpTo,
    isWatched,
    getWatchedItems,
    getInProgressItems,
    currentPlaylist,
    playlists,
    itemsByCategory,
    addPlaylist,
    removePlaylist,
    switchPlaylist,
    getItemsByCategory
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
}; 