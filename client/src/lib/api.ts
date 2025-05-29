import { ApiArtwork, Artwork } from '@shared/schema';

const HARVARD_API_KEY = import.meta.env.VITE_HARVARD_API_KEY || '';
const HARVARD_BASE_URL = 'https://api.harvardartmuseums.org';

export class ArtAPI {
  static async fetchHarvardArtworks(page = 1, size = 20): Promise<Artwork[]> {
    if (!HARVARD_API_KEY) {
      console.warn('Harvard API key not provided, using fallback data');
      return this.getFallbackArtworks();
    }

    try {
      const response = await fetch(
        `${HARVARD_BASE_URL}/object?apikey=${HARVARD_API_KEY}&size=${size}&page=${page}&hasimage=1&classification=Paintings|Photographs|Sculptures`
      );

      if (!response.ok) {
        throw new Error(`Harvard API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformHarvardArtworks(data.records || []);
    } catch (error) {
      console.error('Failed to fetch from Harvard API:', error);
      return this.getFallbackArtworks();
    }
  }

  private static transformHarvardArtworks(records: any[]): Artwork[] {
    return records
      .filter(record => record.primaryimageurl)
      .map(record => ({
        id: `harvard_${record.id}`,
        title: record.title || 'Untitled',
        artist: record.people?.[0]?.name || 'Unknown Artist',
        description: record.description || 'A beautiful artwork from the Harvard Art Museums collection.',
        category: this.mapClassificationToCategory(record.classification),
        year: this.extractYear(record.dated),
        image: record.primaryimageurl,
        tags: this.generateTags(record),
        isUserSubmitted: false,
      }));
  }

  private static mapClassificationToCategory(classification?: string): Artwork['category'] {
    if (!classification) return 'other';
    
    const lowerClass = classification.toLowerCase();
    if (lowerClass.includes('painting')) return 'painting';
    if (lowerClass.includes('photograph')) return 'photography';
    if (lowerClass.includes('sculpture')) return 'sculpture';
    if (lowerClass.includes('digital')) return 'digital';
    return 'other';
  }

  private static extractYear(dated?: string): number | undefined {
    if (!dated) return undefined;
    
    const yearMatch = dated.match(/\b(1[5-9]\d{2}|20[0-2]\d)\b/);
    return yearMatch ? parseInt(yearMatch[0]) : undefined;
  }

  private static generateTags(record: any): string[] {
    const tags: string[] = [];
    
    if (record.classification) {
      tags.push(record.classification.toLowerCase().replace(/\s+/g, '-'));
    }
    
    if (record.culture) {
      tags.push(record.culture.toLowerCase().replace(/\s+/g, '-'));
    }
    
    if (record.medium) {
      tags.push('traditional-medium');
    }
    
    tags.push('museum-collection', 'harvard');
    
    return tags;
  }

  private static getFallbackArtworks(): Artwork[] {
    return [
      {
        id: 'fallback_1',
        title: 'Sunset Dreams',
        artist: 'Elena Rodriguez',
        description: 'A vibrant abstract interpretation of a Mediterranean sunset, using bold oranges and deep purples to capture the emotion of twilight.',
        category: 'painting',
        year: 2023,
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000',
        tags: ['abstract', 'sunset', 'vibrant', 'emotional'],
        isUserSubmitted: false,
      },
      {
        id: 'fallback_2',
        title: 'Urban Symphony',
        artist: 'Marcus Chen',
        description: 'A black and white photographic exploration of urban architecture, highlighting the rhythm and patterns found in city landscapes.',
        category: 'photography',
        year: 2024,
        image: 'https://images.unsplash.com/photo-1493514789931-586cb221d7a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200',
        tags: ['architecture', 'urban', 'black-white', 'geometric'],
        isUserSubmitted: false,
      },
      {
        id: 'fallback_3',
        title: 'Digital Metamorphosis',
        artist: 'Sarah Kim',
        description: 'A digital artwork exploring themes of transformation and growth through organic forms and flowing colors.',
        category: 'digital',
        year: 2023,
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000',
        tags: ['digital', 'transformation', 'organic', 'colorful'],
        isUserSubmitted: false,
      },
      {
        id: 'fallback_4',
        title: 'Timeless Form',
        artist: 'Antonio Silva',
        description: 'A contemporary sculpture that plays with negative space and natural materials to create a sense of movement and flow.',
        category: 'sculpture',
        year: 2022,
        image: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200',
        tags: ['sculpture', 'contemporary', 'minimal', 'form'],
        isUserSubmitted: false,
      },
      {
        id: 'fallback_5',
        title: 'Ocean Dreams',
        artist: 'Maya Patel',
        description: 'An oil painting capturing the serene beauty of ocean waves with delicate brushwork and subtle color transitions.',
        category: 'painting',
        year: 2024,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        tags: ['ocean', 'seascape', 'oil-painting', 'serene'],
        isUserSubmitted: false,
      },
      {
        id: 'fallback_6',
        title: 'Neon Nights',
        artist: 'David Wilson',
        description: 'A digital photograph capturing the electric energy of city nightlife through neon reflections and urban landscapes.',
        category: 'photography',
        year: 2023,
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000',
        tags: ['neon', 'night', 'urban', 'energy'],
        isUserSubmitted: false,
      },
    ];
  }
}
