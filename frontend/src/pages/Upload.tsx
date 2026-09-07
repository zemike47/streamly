import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { uploadVideo } from "../services/video.service";

const Upload = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!videoFile) {
      setError("Please select a video file.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("video", videoFile);

      await uploadVideo(formData);

      navigate("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload a video</h1>

        <p className="mt-2 text-gray-400">
          Share a video with the Streamly community.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-gray-300">Video</label>

            <input
              type="file"
              accept="video/*"
              required
              onChange={(event) => {
                setVideoFile(event.target.files?.[0] || null);
              }}
              className="block w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-gray-400 file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-4 file:py-2 file:font-medium file:text-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Title</label>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter video title"
              required
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your video"
              rows={5}
              className="w-full resize-none rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-white/30"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload video"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Upload;
