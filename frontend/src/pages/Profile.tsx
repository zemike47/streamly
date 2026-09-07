import { FormEvent, useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/user.service";
import type { Profile as ProfileType } from "../types/user";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const data = await getProfile();

        setProfile(data);
        setName(data.name);
        setAvatarUrl(data.avatarUrl || "");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await updateProfile({
        name,
        avatarUrl: avatarUrl || undefined,
      });

      setProfile(response.user);

      setMessage("Profile updated successfully.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-gray-400">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>

        <p className="mt-2 text-gray-400">Manage your account information.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="mb-6 h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-3xl font-bold">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-gray-300">Name</label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Email</label>

            <input
              type="email"
              value={profile?.email || user?.email || ""}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-black/10 px-4 py-3 text-gray-500"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-lg bg-green-500/10 p-4 text-sm text-green-400">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Profile;
