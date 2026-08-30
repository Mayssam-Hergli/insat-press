import MediaAddForm from "@/components/admin/MediaAddForm";

export default function AddMediaPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add Media Coverage</h1>
        <p className="text-gray-600 mt-1">
          Enter the media coverage information and content below.
        </p>
      </div>

      <MediaAddForm />
    </div>
  );
}
