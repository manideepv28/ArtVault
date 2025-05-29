import { Artwork, InsertArtwork } from '@shared/schema';
import { LocalStorage, STORAGE_KEYS } from './storage';
import { ArtAPI } from './api';

export class ArtworkManager {
  private static userArtworks: Artwork[] = [];
  private static apiArtworks: Artwork[] = [];
  private static isLoaded = false;

  static async initialize(): Promise<void> {
    if (this.isLoaded) return;

    this.userArtworks = LocalStorage.get<Artwork[]>(STORAGE_KEYS.ARTWORKS, []);
    
    try {
      this.apiArtworks = await ArtAPI.fetchHarvardArtworks();
    } catch (error) {
      console.error('Failed to load API artworks:', error);
      this.apiArtworks = [];
    }

    this.isLoaded = true;
  }

  static async getAllArtworks(): Promise<Artwork[]> {
    await this.initialize();
    return [...this.apiArtworks, ...this.userArtworks];
  }

  static async getFilteredArtworks(
    filter: string = 'all',
    sort: string = 'newest',
    searchQuery?: string
  ): Promise<Artwork[]> {
    let artworks = await this.getAllArtworks();

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      artworks = artworks.filter(artwork =>
        artwork.title.toLowerCase().includes(query) ||
        artwork.artist.toLowerCase().includes(query) ||
        artwork.description.toLowerCase().includes(query) ||
        artwork.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filter !== 'all') {
      artworks = artworks.filter(artwork => artwork.category === filter);
    }

    // Apply sorting
    switch (sort) {
      case 'newest':
        artworks.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case 'oldest':
        artworks.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case 'artist':
        artworks.sort((a, b) => a.artist.localeCompare(b.artist));
        break;
      case 'popular':
        // For user-submitted artworks, prioritize recent submissions
        artworks.sort((a, b) => {
          if (a.isUserSubmitted && !b.isUserSubmitted) return -1;
          if (!a.isUserSubmitted && b.isUserSubmitted) return 1;
          return (b.year || 0) - (a.year || 0);
        });
        break;
    }

    return artworks;
  }

  static submitArtwork(artworkData: InsertArtwork, userId: string): Artwork {
    const newArtwork: Artwork = {
      id: Date.now().toString(),
      ...artworkData,
      isUserSubmitted: true,
      submittedBy: userId,
      submittedAt: new Date().toISOString(),
    };

    this.userArtworks.push(newArtwork);
    LocalStorage.set(STORAGE_KEYS.ARTWORKS, this.userArtworks);

    return newArtwork;
  }

  static getUserArtworks(userId: string): Artwork[] {
    return this.userArtworks.filter(artwork => artwork.submittedBy === userId);
  }

  static getArtworkById(id: string): Artwork | undefined {
    return [...this.apiArtworks, ...this.userArtworks].find(artwork => artwork.id === id);
  }

  static deleteUserArtwork(id: string, userId: string): boolean {
    const index = this.userArtworks.findIndex(
      artwork => artwork.id === id && artwork.submittedBy === userId
    );

    if (index !== -1) {
      this.userArtworks.splice(index, 1);
      LocalStorage.set(STORAGE_KEYS.ARTWORKS, this.userArtworks);
      return true;
    }

    return false;
  }

  static saveDraft(artworkData: Partial<InsertArtwork>, userId: string): void {
    const drafts = LocalStorage.get<Record<string, Partial<InsertArtwork>>>(STORAGE_KEYS.DRAFTS, {});
    drafts[userId] = artworkData;
    LocalStorage.set(STORAGE_KEYS.DRAFTS, drafts);
  }

  static loadDraft(userId: string): Partial<InsertArtwork> | null {
    const drafts = LocalStorage.get<Record<string, Partial<InsertArtwork>>>(STORAGE_KEYS.DRAFTS, {});
    return drafts[userId] || null;
  }

  static clearDraft(userId: string): void {
    const drafts = LocalStorage.get<Record<string, Partial<InsertArtwork>>>(STORAGE_KEYS.DRAFTS, {});
    delete drafts[userId];
    LocalStorage.set(STORAGE_KEYS.DRAFTS, drafts);
  }
}
