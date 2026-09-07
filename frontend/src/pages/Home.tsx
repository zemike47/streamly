import { useEffect, useState } from "react";

import VideoGrid from "../components/VideoGrid";
import { deleteVideo, getVideos } from "../services/video.service";

import type { Video } from "../types/video";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getVideos();

      setVideos(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load videos"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteVideo(id);

      setVideos((currentVideos) =>
        currentVideos.filter((video) => video.id !== id)
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete video");
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <section className="mb-10">
        <h1 className="text-4xl font-bold">Discover videos</h1>

        <p className="mt-2 text-gray-400">
          Watch and share videos with the community.
        </p>
      </section>

      {loading && <p className="text-gray-400">Loading videos...</p>}

      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-red-400">{error}</div>
      )}

      {!loading && !error && (
        <VideoGrid
          videos={videos}
          onDelete={
            user
              ? (id) => {
                  const video = videos.find((video) => video.id === id);

                  if (video?.userId === user.id) {
                    handleDelete(id);
                  } else {
                    alert("You can only delete your own videos.");
                  }
                }
              : undefined
          }
        />
      )}
    </main>
  );
};

export default Home;
