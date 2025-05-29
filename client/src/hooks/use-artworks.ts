import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Artwork } from '@shared/schema';
import { ArtworkManager } from '@/lib/artwork-manager';

export function useArtworks(filter = 'all', sort = 'newest', searchQuery?: string) {
  const { data: artworks = [], isLoading, error } = useQuery({
    queryKey: ['artworks', filter, sort, searchQuery],
    queryFn: () => ArtworkManager.getFilteredArtworks(filter, sort, searchQuery),
  });

  return {
    artworks,
    isLoading,
    error,
  };
}

export function useUserArtworks(userId?: string) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    if (userId) {
      const userArtworks = ArtworkManager.getUserArtworks(userId);
      setArtworks(userArtworks);
    } else {
      setArtworks([]);
    }
  }, [userId]);

  const refresh = () => {
    if (userId) {
      const userArtworks = ArtworkManager.getUserArtworks(userId);
      setArtworks(userArtworks);
    }
  };

  return {
    artworks,
    refresh,
  };
}
