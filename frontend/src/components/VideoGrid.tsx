import type { Video } from "../types/video";
import VideoCard from "./VideoCard";

interface VideoGridProps {
  videos: Video[];
  onDelete?: (id: number) => void;
}

const VideoGrid = ({ videos, onDelete }: VideoGridProps) => {
  if (videos.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400">
        No videos available.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default VideoGrid;
