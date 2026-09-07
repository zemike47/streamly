import { api } from "./api";
import type { Video } from "../types/video";

export const getVideos = async (): Promise<Video[]> => {
  return api("/videos");
};

export const getVideoById = async (id: number): Promise<Video> => {
  return api(`/videos/${id}`);
};

export const uploadVideo = async (formData: FormData): Promise<Video> => {
  return api("/videos", {
    method: "POST",
    body: formData,
  });
};

export const deleteVideo = async (id: number) => {
  return api(`/videos/${id}`, {
    method: "DELETE",
  });
};
