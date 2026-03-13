import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { toast } from "react-toastify";
import type { FestDay } from "@/utils/interfaces";
import {
  Calendar,
  IndianRupee,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const FestDaysPage = () => {
  const navigate = useNavigate();
  const [days, setDays] = useState<FestDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

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

  useEffect(() => {
    setIsAnimating(false);
    const timer = setTimeout(() => setIsAnimating(true), 50);
    return () => clearTimeout(timer);
  }, [selectedDayIndex]);

  const handlePrevDay = () => {
    setSelectedDayIndex((prev) => (prev === 0 ? days.length - 1 : prev - 1));
  };

  const handleNextDay = () => {
    setSelectedDayIndex((prev) => (prev === days.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#f8c94c]/30 border-t-[#f8c94c] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#eef5ff]">Loading fest days...</p>
        </div>
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 mt-[-35px]">
            <h1 className="text-5xl md:text-8xl font-bold text-[#f8c94c] mb-4">
              FEST DAYS
            </h1>
            <p className="text-[#eef5ff] text-lg max-w-2xl mx-auto">
              Explore our exciting fest days packed with events, activities,
              and experiences
            </p>
          </div>

          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-[#f8c94c]/40 mx-auto mb-4" />
            <p className="text-[#eef5ff]/70 text-lg">
              No fest days available yet
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedDay = days[selectedDayIndex];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="text-center py-8 px-4 border-b border-[#f8c94c]/30">
        <h1 className="text-5xl md:text-8xl font-bold text-[#f8c94c] mb-4">
          FEST DAYS
        </h1>
        <p className="text-[#eef5ff] text-lg max-w-2xl mx-auto">
          Explore our exciting fest days packed with events, activities, and
          experiences
        </p>
      </div>

      {/* Day Selection */}
      <div className="sticky top-0 z-40 backdrop-blur-md border-b border-[#f8c94c]/30 py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {days.map((day, index) => (
            <button
              key={day._id}
              onClick={() => setSelectedDayIndex(index)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedDayIndex === index
                  ? "bg-[#0b1f3a] text-[#f8c94c] border border-[#f8c94c] shadow-[0_0_10px_rgba(248,201,76,0.35)]"
                  : "bg-[#0b1f3a]/60 text-[#f8c94c] border border-[#f8c94c]/30 hover:bg-[#0b1f3a]"
              }`}
            >
              Day {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Day Details */}
      <div className="min-h-[calc(100vh-200px)] py-8 px-4">
        <div
          className={`max-w-4xl mx-auto transition-opacity duration-300 ${
            isAnimating ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Image */}
          <div className="relative h-80 md:h-96 bg-[#0b1f3a]/70 border border-[#f8c94c]/30 rounded-2xl overflow-hidden mb-8 shadow-xl">
            {selectedDay.imageUrl ? (
              <img
                src={selectedDay.imageUrl}
                alt={selectedDay.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Calendar className="w-32 h-32 text-[#f8c94c]/40" />
              </div>
            )}
          </div>

          {/* Main Card */}
          <div className="bg-[#0b1f3a]/70 backdrop-blur-md border border-[#f8c94c]/30 rounded-2xl shadow-xl p-8 mb-8">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-[#f8c94c] mb-3">
                {selectedDay.name}
              </h2>

              <p className="text-lg text-[#eef5ff] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#f8c94c]" />
                {selectedDay.date}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 text-2xl font-bold text-[#f8c94c] bg-[#0b1f3a]/80 border border-[#f8c94c]/40 py-3 px-4 rounded-xl w-fit mb-6">
              <IndianRupee className="w-6 h-6" />
              {selectedDay.price}
            </div>

            {/* Description */}
            {selectedDay.description && (
              <div className="mb-8">
                <p className="text-[#eef5ff] text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedDay.description}
                </p>
              </div>
            )}

            {/* Events */}
            {selectedDay.events && selectedDay.events.length > 0 && (
              <div className="border-t border-[#f8c94c]/30 pt-8">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-6 h-6 text-[#f8c94c]" />
                  <h3 className="text-2xl font-semibold text-[#f8c94c]">
                    {selectedDay.events.length} Event
                    {selectedDay.events.length !== 1 ? "s" : ""}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDay.events.map((event, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0b1f3a]/80 rounded-xl border border-[#f8c94c]/30 hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      {event.imageUrl && (
                        <div className="h-40 overflow-hidden">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="p-5">
                        <p className="font-semibold text-[#f8c94c] text-lg mb-2">
                          {event.title}
                        </p>

                        {event.description && (
                          <p className="text-[#eef5ff]/80 text-sm leading-relaxed">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Events */}
            {(!selectedDay.events || selectedDay.events.length === 0) && (
              <div className="border-t border-[#f8c94c]/30 pt-8">
                <p className="text-[#eef5ff]/70 flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-[#f8c94c]/40" />
                  No events scheduled yet
                </p>
              </div>
            )}

            {/* Register */}
            <button
              onClick={() => navigate("/fest/register")}
              className="w-full mt-8 bg-[#f8c94c] hover:bg-[#e6b73f] text-[#0b1f3a] font-semibold py-4 px-6 rounded-lg transition-all duration-200 text-lg"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 left-8 right-8 md:left-auto md:right-8 flex gap-4 justify-center md:justify-end">
        <button
          onClick={handlePrevDay}
          className="bg-[#0b1f3a]/80 border border-[#f8c94c]/40 text-[#f8c94c] rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNextDay}
          className="bg-[#f8c94c] text-[#0b1f3a] rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default FestDaysPage;