import { api } from "./api";
import type { Profile } from "../types/user";

interface UpdateProfileData {
  name: string;
  avatarUrl?: string;
}

export const getProfile = async (): Promise<Profile> => {
  return api("/users/profile");
};

export const updateProfile = async (
  data: UpdateProfileData
): Promise<{ message: string; user: Profile }> => {
  return api("/users/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
