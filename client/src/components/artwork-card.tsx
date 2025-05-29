import { Artwork } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: () => void;
}

export function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  return (
    <Card 
      className="masonry-item bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="overflow-hidden rounded-t-xl">
        <img 
          src={artwork.image} 
          alt={artwork.title}
          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {artwork.title}
        </h3>
        <p className="text-primary font-medium mb-3">
          by {artwork.artist}
        </p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {artwork.description}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
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
  );
}
