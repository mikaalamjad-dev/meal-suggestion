import { ProfileForm } from "@/components/profile/ProfileForm";
import { PageHeader } from "@/components/ui/page-header";

export default function ProfilePage() {
  return (
    <section>
      <PageHeader title="My Profile" description="Your body metrics drive calorie-aware suggestions." />
      <ProfileForm />
    </section>
  );
}
