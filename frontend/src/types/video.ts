import type { User } from "./auth";

export interface Video {
  id: number;
  title: string;
  description: string | null;
  filePath: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user?: User;
}
