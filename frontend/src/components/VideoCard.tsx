import type { Video } from "../types/video";

interface VideoCardProps {
  video: Video;
  onDelete?: (id: number) => void;
}

const VideoCard = ({ video, onDelete }: VideoCardProps) => {
  const videoUrl = `https://streamly-videos-m-001.s3.eu-north-1.amazonaws.com/${video.filePath}`;
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      {" "}
      <video
        src={video.filePath}
        controls
        className="aspect-video w-full bg-black object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-white">{video.title}</h3>

        {video.description && (
          <p className="mt-2 text-sm text-gray-400">{video.description}</p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {video.user?.name || "Unknown user"}
          </span>

          {onDelete && (
            <button
              onClick={() => onDelete(video.id)}
              className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
