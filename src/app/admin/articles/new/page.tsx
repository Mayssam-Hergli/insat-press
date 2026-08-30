import { getAllWriters } from "@/lib/data/writers";
import ArticleAddForm from "@/components/admin/ArticleAddForm";

export default async function AddArticlePage(){
  const  [writers] = await Promise.all([
    getAllWriters(),
  ]);


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add Article</h1>
        <p className="text-gray-600 mt-1">
          Enter the article information and content below.
        </p>
      </div>

      <ArticleAddForm  writers={writers} />
    </div>
  );
}
