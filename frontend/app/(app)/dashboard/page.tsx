import { PageHeader } from "@/components/ui/page-header";
import { SuggestionFeed } from "@/components/suggestions/SuggestionFeed";

export default function DashboardPage() {
  return (
    <section>
      <PageHeader title="My Suggestions" description="Meals ranked for your profile, pantry, and preferences." />
      <SuggestionFeed />
    </section>
  );
}
