import { useEffect, useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Edit, Users } from "lucide-react";
import PortfolioForm from "@/components/admin/portfolios/PortfolioForm";

interface Committee {
  _id: string;
  name: string;
  portfolios: string[];
}

const Portfolios = () => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // NEW: Track expanded committees
  const [expandedCommittees, setExpandedCommittees] = useState<
    Record<string, boolean>
  >({});

  const fetchPortfolios = async () => {
    try {
      const res = await api.get("/committees/get-portfolios");
      setCommittees(res.data);
    } catch (err) {
      toast.error("Failed to fetch committees");
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  // Toggle expand/collapse
  const toggleExpand = (id: string) => {
    setExpandedCommittees((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Manage Committee Portfolios
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Edit portfolios for each committee
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {committees.map((committee, index) => {
            const isExpanded = expandedCommittees[committee._id];
            const portfoliosToShow = isExpanded
              ? committee.portfolios
              : committee.portfolios.slice(0, 7);

            return (
              <div
                key={committee._id}
                className="group relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {committee.name}
                  </h2>

                  <ul className="text-gray-600 text-sm mb-4 list-disc ml-5">
                    {portfoliosToShow.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>

                  {committee.portfolios.length > 7 && (
                    <button
                      onClick={() => toggleExpand(committee._id)}
                      className="text-sm text-blue-600 hover:underline transition">
                      {isExpanded ? "Show Less" : "Show More"}
                    </button>
                  )}
                </div>

                <div className="px-6 pb-6">
                  <Button
                    variant="outline"
                    onClick={() => setEditingId(committee._id)}
                    className="w-full bg-white/50 hover:bg-white/80 border-gray-200/50 hover:border-gray-300/50 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-xl">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Portfolios
                  </Button>
                </div>

                {editingId === committee._id && (
                  <div className="absolute top-0 left-0 right-0 z-50 flex justify-center bg-white/90 backdrop-blur-sm p-4 overflow-y-scroll h-full">
                    <div className="w-full max-w-xl mb-10 relative">
                      <PortfolioForm
                        initialPortfolios={committee.portfolios}
                        committeeId={committee._id}
                        onClose={() => setEditingId(null)}
                        refresh={fetchPortfolios}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {committees.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Committees found
            </h3>
            <p className="text-gray-600 mb-6">
              Make sure you have added committees with portfolios.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolios;
