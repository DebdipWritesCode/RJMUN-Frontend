import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { toast } from "react-toastify";
import type { FestDay } from "@/utils/interfaces";
import { Calendar, IndianRupee, Zap } from "lucide-react";

const FestDaysPage = () => {
  const navigate = useNavigate();
  const [days, setDays] = useState<FestDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const res = await api.get("/fest-days");
        setDays(res.data);
      } catch {
        toast.error("Failed to load fest days");
      } finally {
        setLoading(false);
      }
    };

    fetchDays();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-transparent to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading fest days...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-[-35px]">
          <h1 className="text-5xl md:text-8xl font-bold text-gray-800 mb-4">
            FEST DAYS
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our exciting fest days packed with events, activities, and experiences
          </p>
        </div>

        {/* No Days Message */}
        {days.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No fest days available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {days.map((day) => (
              <div
                key={day._id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow border border-gray-100 group"
              >
                {/* Image Container */}
                <div className="relative h-48 bg-gradient-to-br from-orange-100 to-purple-100 overflow-hidden">
                  {day.imageUrl ? (
                    <img
                      src={day.imageUrl}
                      alt={day.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="w-20 h-20 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Title and Date */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">{day.name}</h2>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {day.date}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-1 text-lg font-bold text-orange-600 bg-orange-50 py-2 px-3 rounded-lg w-fit">
                    <IndianRupee className="w-5 h-5" />
                    {day.price}
                  </div>

                  {/* Description */}
                  {day.description && (
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {day.description}
                    </p>
                  )}

                  {/* Events Section */}
                  {day.events && day.events.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <p className="font-semibold text-gray-800 text-sm">
                          {day.events.length} Event{day.events.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="space-y-3">
                        {day.events.map((event, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                          >
                            <p className="font-medium text-gray-800 text-sm mb-1">
                              {event.title}
                            </p>
                            {event.description && (
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {event.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Events */}
                  {(!day.events || day.events.length === 0) && (
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-gray-300" />
                        No events scheduled yet
                      </p>
                    </div>
                  )}

                  {/* Register Button */}
                  <button
                    onClick={() => navigate("/fest/register")}
                    className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FestDaysPage;
