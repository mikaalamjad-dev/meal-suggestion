import { ProfileForm } from "@/components/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold text-[--color-primary]">My Profile</h1>
      <ProfileForm />
    </section>
  );
}
