import { useEffect, useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import FAQForm from "@/components/admin/faqs/FAQForm";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

const FAQs = () => {
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [selected, setSelected] = useState<FAQ | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchFAQs = async () => {
    try {
      const res = await api.get("/faqs");
      setFAQs(res.data);
    } catch (err) {
      toast.error("Failed to fetch FAQs");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/faqs/${id}`);
      toast.success("FAQ deleted");
      fetchFAQs();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Manage FAQs
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Create and manage your organization's FAQs
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setSelected(null);
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="mb-8">
            <FAQForm
              initialData={selected ?? undefined}
              onClose={() => {
                setShowForm(false);
                fetchFAQs();
              }}
            />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {faqs.map((faq, index) => (
            <div
              key={faq._id}
              className="group relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {faq.question}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  Answer: {faq.answer}
                </p>
              </div>

              <div className="px-6 pb-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelected(faq);
                    setShowForm(true);
                  }}
                  className="flex-1 bg-white/50 hover:bg-white/80 border-gray-200/50 hover:border-gray-300/50 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-xl"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(faq._id)}
                  className="bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white border-red-200 hover:border-red-500 transition-all duration-200 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {faqs.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No FAQs yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first FAQ.
            </p>
            <Button
              onClick={() => {
                setSelected(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-3"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First FAQ
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQs;