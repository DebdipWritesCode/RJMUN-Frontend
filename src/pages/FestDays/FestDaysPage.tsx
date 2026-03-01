import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { toast } from "react-toastify";
import type { FestDay } from "@/utils/interfaces";
import { Calendar, IndianRupee, Zap, ChevronLeft, ChevronRight } from "lucide-react";

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

  // Handle fade animation when day changes
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
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading fest days...</p>
        </div>
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 mt-[-35px]">
            <h1 className="text-5xl md:text-8xl font-bold text-gray-800 mb-4">
              FEST DAYS
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our exciting fest days packed with events, activities, and experiences
            </p>
          </div>
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No fest days available yet</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedDay = days[selectedDayIndex];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="text-center py-8 px-4 border-b border-gray-200">
        <h1 className="text-5xl md:text-8xl font-bold text-gray-800 mb-4">
          FEST DAYS
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore our exciting fest days packed with events, activities, and experiences
        </p>
      </div>

      {/* Day Selection Buttons */}
      <div className="sticky top-0 z-40 backdrop-blur-md border-b border-gray-200 py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {days.map((day, index) => (
            <button
              key={day._id}
              onClick={() => setSelectedDayIndex(index)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedDayIndex === index
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Day {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Full Screen Day Details */}
      <div className="min-h-[calc(100vh-200px)] py-8 px-4">
        <div className={`max-w-4xl mx-auto transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
          {/* Image */}
          <div className="relative h-80 md:h-96 bg-gradient-to-br from-orange-100 to-purple-100 rounded-2xl overflow-hidden mb-8 shadow-xl">
            {selectedDay.imageUrl ? (
              <img
                src={selectedDay.imageUrl}
                alt={selectedDay.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Calendar className="w-32 h-32 text-gray-300" />
              </div>
            )}
          </div>

          {/* Day Title and Details */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Title and Date */}
            <div className="mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                {selectedDay.name}
              </h2>
              <p className="text-lg text-gray-600 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                {selectedDay.date}
              </p>
            </div>

            {/* Price Badge */}
            <div className="flex items-center gap-2 text-2xl font-bold text-orange-600 bg-orange-50 py-3 px-4 rounded-xl w-fit mb-6">
              <IndianRupee className="w-6 h-6" />
              {selectedDay.price}
            </div>

            {/* Description */}
            {selectedDay.description && (
              <div className="mb-8">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedDay.description}
                </p>
              </div>
            )}

            {/* Events Section */}
            {selectedDay.events && selectedDay.events.length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-6 h-6 text-amber-500" />
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {selectedDay.events.length} Event{selectedDay.events.length !== 1 ? "s" : ""}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDay.events.map((event, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                    >
                      {/* Event Image */}
                      {event.imageUrl && (
                        <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      {/* Event Content */}
                      <div className="p-5">
                        <p className="font-semibold text-gray-800 text-lg mb-2">
                          {event.title}
                        </p>
                        {event.description && (
                          <p className="text-gray-600 leading-relaxed text-sm">
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
              <div className="border-t border-gray-200 pt-8">
                <p className="text-gray-500 flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-gray-300" />
                  No events scheduled yet
                </p>
              </div>
            )}

            {/* Register Button */}
            <button
              onClick={() => navigate("/fest/register")}
              className="w-full mt-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 text-lg"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-8 left-8 right-8 md:left-auto md:right-8 flex gap-4 justify-center md:justify-end">
        <button
          onClick={handlePrevDay}
          className="bg-white hover:bg-gray-100 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl"
          title="Previous day"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNextDay}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl"
          title="Next day"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default FestDaysPage;
