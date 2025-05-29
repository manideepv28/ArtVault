import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  joinDate: z.number(),
});

export const insertUserSchema = userSchema.pick({
  email: true,
  fullName: true,
}).extend({
  password: z.string().min(6),
});

export const artworkSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  description: z.string(),
  category: z.enum(['painting', 'sculpture', 'photography', 'digital', 'mixed', 'other']),
  year: z.number().optional(),
  image: z.string().url(),
  tags: z.array(z.string()),
  isUserSubmitted: z.boolean(),
  submittedBy: z.string().optional(),
  submittedAt: z.string().optional(),
});

export const insertArtworkSchema = artworkSchema.pick({
  title: true,
  artist: true,
  description: true,
  category: true,
  year: true,
  image: true,
  tags: true,
});

export const apiArtworkSchema = z.object({
  id: z.number(),
  title: z.string(),
  peoplecount: z.number().optional(),
  people: z.array(z.object({
    name: z.string(),
  })).optional(),
  classification: z.string().optional(),
  dated: z.string().optional(),
  description: z.string().optional(),
  primaryimageurl: z.string().optional(),
  images: z.array(z.object({
    baseimageurl: z.string(),
  })).optional(),
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Artwork = z.infer<typeof artworkSchema>;
export type InsertArtwork = z.infer<typeof insertArtworkSchema>;
export type ApiArtwork = z.infer<typeof apiArtworkSchema>;
