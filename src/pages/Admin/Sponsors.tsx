import { useEffect, useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import SponsorForm from "@/components/admin/sponsors/SponsorForm";

interface Sponsor {
  _id: string;
  name: string;
  type: 'endorsement' | 'partner' | 'college';
  imageUrl?: string;
}

const Sponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [selected, setSelected] = useState<Sponsor | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchSponsors = async () => {
    try {
      const res = await api.get("/sponsors");
      setSponsors(res.data);
    } catch (err) {
      toast.error("Failed to fetch Sponsors");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/sponsors/${id}`);
      toast.success("Sponsor deleted");
      fetchSponsors();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchSponsors();
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
                    Manage Sponsors
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Create and manage your organization's sponsors
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
                Add Sponsor
              </Button>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="mb-8">
            <SponsorForm
              initialData={selected ?? undefined}
              onClose={() => {
                setShowForm(false);
                fetchSponsors();
              }}
            />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor._id}
              className="group relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                {sponsor.imageUrl ? (
                  <img
                    src={sponsor.imageUrl}
                    alt={sponsor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {sponsor.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  Type: {sponsor.type}
                </p>
              </div>

              <div className="px-6 pb-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelected(sponsor);
                    setShowForm(true);
                  }}
                  className="flex-1 bg-white/50 hover:bg-white/80 border-gray-200/50 hover:border-gray-300/50 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-xl"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(sponsor._id)}
                  className="bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white border-red-200 hover:border-red-500 transition-all duration-200 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {sponsors.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No sponsors yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first sponsor.
            </p>
            <Button
              onClick={() => {
                setSelected(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-3"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Sponsor
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sponsors;