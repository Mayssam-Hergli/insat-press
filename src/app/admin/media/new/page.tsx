import MediaAddForm from "@/components/admin/MediaAddForm";

export default function AddMediaPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">Add Media Coverage</h1>
        <p className="mt-1 text-[var(--muted)]">
          Enter the media coverage information and content below.
        </p>
      </div>

      <MediaAddForm />
    </div>
  );
}
