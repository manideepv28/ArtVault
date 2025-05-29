import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Plus, Palette } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useUserArtworks } from '@/hooks/use-artworks';
import { ArtworkModal } from '@/components/artwork-modal';
import { Artwork } from '@shared/schema';

export function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { artworks: userArtworks, refresh } = useUserArtworks(user?.id);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view your profile.
            </p>
            <Button onClick={() => setLocation('/')}>
              Go to Gallery
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-16 w-16 text-primary" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.fullName}
              </h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-primary">
                    {userArtworks.length}
                  </span>
                  <span className="text-sm text-gray-600">Artworks</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-primary">
                    {user.joinDate}
                  </span>
                  <span className="text-sm text-gray-600">Joined</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Artworks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">My Artworks</CardTitle>
            <Button onClick={() => setLocation('/submit')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Artwork
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {userArtworks.length === 0 ? (
            <div className="text-center py-12">
              <Palette className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No artworks yet
              </h3>
              <p className="text-gray-500 mb-6">
                Share your first artwork with the community
              </p>
              <Button onClick={() => setLocation('/submit')}>
                <Plus className="mr-2 h-4 w-4" />
                Submit Your Art
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userArtworks.map((artwork) => (
                <Card 
                  key={artwork.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleArtworkClick(artwork)}
                >
                  <div className="overflow-hidden rounded-t-lg">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {artwork.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {artwork.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {artwork.category}
                      </Badge>
                      {artwork.year && (
                        <span className="text-gray-500 text-xs">
                          {artwork.year}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ArtworkModal
        artwork={selectedArtwork}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
