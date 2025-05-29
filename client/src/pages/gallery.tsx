import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Compass, Grid3X3, List } from 'lucide-react';
import { Artwork } from '@shared/schema';
import { useArtworks } from '@/hooks/use-artworks';
import { ArtworkCard } from '@/components/artwork-card';
import { ArtworkModal } from '@/components/artwork-modal';

interface GalleryPageProps {
  searchQuery: string;
}

export function GalleryPage({ searchQuery }: GalleryPageProps) {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { artworks, isLoading, error } = useArtworks(filter, sort, searchQuery);

  const categories = [
    { value: 'all', label: 'All Artworks' },
    { value: 'painting', label: 'Paintings' },
    { value: 'sculpture', label: 'Sculptures' },
    { value: 'photography', label: 'Photography' },
    { value: 'digital', label: 'Digital Art' },
    { value: 'mixed', label: 'Mixed Media' },
    { value: 'other', label: 'Other' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'artist', label: 'By Artist' },
  ];

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const scrollToGallery = () => {
    document.getElementById('gallery-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Failed to load artworks
          </h2>
          <p className="text-gray-600 mb-6">
            There was an error loading the gallery. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Discover Beautiful Art
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto animate-fade-in">
            Explore a curated collection of stunning artworks from talented artists around the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button size="lg" asChild>
              <a href="/submit">
                <Compass className="mr-2 h-5 w-5" />
                Submit Your Art
              </a>
            </Button>
            <Button variant="outline" size="lg" onClick={scrollToGallery}>
              <Grid3X3 className="mr-2 h-5 w-5" />
              Browse Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white border-b border-gray-100 py-6" id="gallery-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={filter === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading beautiful artworks...</p>
            </div>
            
            <div className="masonry-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="masonry-item">
                  <Skeleton className="w-full h-64 rounded-xl mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      {!isLoading && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {artworks.length === 0 ? (
              <div className="text-center py-16">
                <Grid3X3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No artworks found
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? `No artworks match your search for "${searchQuery}"`
                    : 'Try adjusting your filters to see more artworks'
                  }
                </p>
                {filter !== 'all' && (
                  <Button variant="outline" onClick={() => setFilter('all')}>
                    Show All Artworks
                  </Button>
                )}
              </div>
            ) : (
              <div className="masonry-grid">
                {artworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    onClick={() => handleArtworkClick(artwork)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <ArtworkModal
        artwork={selectedArtwork}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
