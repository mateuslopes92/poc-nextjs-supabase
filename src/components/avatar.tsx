"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Avatar() {
  const router = useRouter();
  const supabase = createClient()

  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setEmail(user.email);

      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      if (data?.avatar_url) {
        // Get a public URL
        const { data: file } = supabase.storage
          .from("avatars")
          .getPublicUrl(data.avatar_url);

        setAvatarUrl(file.publicUrl);
      }
    }

    loadProfile();
  }, [supabase]);

  const fallback = email ? email[0].toUpperCase() : "?";

  return (
    <button
      onClick={() => router.push("/profile")}
      className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center overflow-hidden"
    >
      {avatarUrl ? (
        <img src={avatarUrl} className="w-full h-full object-cover" />
      ) : (
        <span className="text-lg font-semibold">{fallback}</span>
      )}
    </button>
  );
}