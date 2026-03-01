import { useEffect, useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import FestDayForm from "@/components/admin/fest-days/FestDayForm";
import type { FestDay } from "@/utils/interfaces";
import { Plus, Edit, Trash2, Calendar, IndianRupee } from "lucide-react";

const FestDays = () => {
  const [days, setDays] = useState<FestDay[]>([]);
  const [selected, setSelected] = useState<FestDay | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchDays = async () => {
    try {
      const res = await api.get("/fest-days");
      setDays(res.data);
    } catch (err) {
      toast.error("Failed to fetch fest days");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/fest-days/${id}`);
      toast.success("Fest day deleted");
      fetchDays();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchDays();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
          <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Manage Fest Days
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Create and manage fest days (date, name, description, price, image)
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
                Add Fest Day
              </Button>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="mb-8">
            <FestDayForm
              initialData={selected ?? undefined}
              onClose={() => {
                setShowForm(false);
                fetchDays();
              }}
            />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {days.map((day) => (
            <div
              key={day._id}
              className="group relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              style={{ animation: "fadeInUp 0.6s ease-out forwards" }}
            >
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                {day.imageUrl ? (
                  <img
                    src={day.imageUrl}
                    alt={day.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">{day.name}</h2>
                <p className="text-gray-600 text-sm mb-2">{day.date}</p>
                <p className="flex items-center gap-1 text-blue-700 font-semibold mb-3">
                  <IndianRupee className="w-4 h-4" />
                  {day.price}
                </p>
                {day.description && (
                  <div className="line-clamp-3 text-gray-700 text-sm mb-3">
                    {day.description}
                  </div>
                )}
                <div className="text-xs text-gray-600 bg-blue-50 rounded-lg p-2 mb-3">
                  <span className="font-medium">{day.events?.length ?? 0} event(s)</span>
                </div>
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelected(day);
                    setShowForm(true);
                  }}
                  className="flex-1 rounded-xl"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(day._id)}
                  className="rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {days.length === 0 && !showForm && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No fest days yet</h3>
            <p className="text-gray-600 mb-6">Create your first fest day to get started.</p>
            <Button
              onClick={() => {
                setSelected(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-3"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Fest Day
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FestDays;
