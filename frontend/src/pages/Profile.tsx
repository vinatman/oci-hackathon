import { useState } from "react";
import { api } from "../api/client";
import { PageHeader } from "../components/PageHeader";
import { PremiumBadge } from "../components/PremiumBadge";
import { ProfileForm, type ProfileFormValue } from "../components/ProfileForm";
import { useDemoUser } from "../hooks/useDemoUser";

export function Profile() {
  const { user, userId, setUser } = useDemoUser();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  if (!user || !userId) {
    return null;
  }

  const save = async (value: ProfileFormValue) => {
    setSaving(true);
    setMessage("");
    try {
      const response = await api.updateProfile(userId, value);
      setUser(response.user);
      setMessage("Preferences saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Your game-day preferences" eyebrow={`Hey ${user.displayName}!`}>
        <PremiumBadge active={user.isPremium} />
      </PageHeader>
      {message ? <p className="mb-4 rounded border border-action/30 bg-action/10 p-3 text-sm text-action">{message}</p> : null}
      <ProfileForm user={user} onSubmit={save} saving={saving} />
    </>
  );
}
