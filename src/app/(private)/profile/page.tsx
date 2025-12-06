"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";

export default function ProfilePage() {
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);

      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      if (data?.avatar_url) {
        const { data: file } = supabase.storage
          .from("avatars")
          .getPublicUrl(data.avatar_url);

        setAvatarUrl(file.publicUrl);
      }
    }
    loadUser();
  }, [supabase]);

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    if (!userId) return;

    const file = event.target.files?.[0];
    if (!file) return;

    const filePath = `${userId}-${Date.now()}`;

    // Upload
    await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });


    // Save in user profile
    await supabase
      .from("profiles")
      .update({ avatar_url: filePath })
      .eq("id", userId);


    // Update preview
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    console.log("Public URL", data.publicUrl);

    setPreview(data.publicUrl);
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <div className="flex flex-col items-center gap-4">
        <img
          src={preview || avatarUrl || "/default-avatar.png"}
          className="w-32 h-32 rounded-full object-cover border"
        />

        <input type="file" accept="image/*" onChange={uploadAvatar} />
      </div>
    </div>
  );
}
