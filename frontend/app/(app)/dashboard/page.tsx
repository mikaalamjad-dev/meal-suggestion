import { SuggestionFeed } from "@/components/suggestions/SuggestionFeed";

export default function DashboardPage() {
  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold text-[--color-primary]">My Suggestions</h1>
      <SuggestionFeed />
    </section>
  );
}
