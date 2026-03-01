import { useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Plus, Trash2, Upload, X, Calendar, Save, Eye } from "lucide-react";
import type { FestDay, FestDayEvent } from "@/utils/interfaces";

interface EventFormData extends FestDayEvent {
  id: string;
  imageFile?: File; // Temporary storage for new image file
}

interface FestDayFormProps {
  initialData?: FestDay;
  onClose: () => void;
}

const FestDayForm = ({ initialData, onClose }: FestDayFormProps) => {
  const [formData, setFormData] = useState({
    date: initialData?.date || "",
    name: initialData?.name || "",
    price: initialData?.price || 0,
    description: initialData?.description || "",
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [events, setEvents] = useState<EventFormData[]>(
    initialData?.events?.map((e, i) => ({
      ...e,
      id: `${i}`,
    })) || [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setMainImage(file || null);
    if (file) {
      setMainImagePreview(URL.createObjectURL(file));
    } else {
      setMainImagePreview(null);
    }
  };

  const handleEventImageChange = (eventId: string, file: File | null) => {
    setEvents(
      events.map((e) =>
        e.id === eventId ? { ...e, imageFile: file || undefined } : e,
      ),
    );
  };

  const addEvent = () => {
    setEvents([
      ...events,
      {
        id: Date.now().toString(),
        title: "",
        description: "",
      },
    ]);
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate events - each must have at least a title
      const validEvents = events.filter((event) => event.title.trim() !== "");

      if (validEvents.length === 0 && events.length > 0) {
        toast.error("Each event must have a title");
        setIsSubmitting(false);
        return;
      }

      const payload = new FormData();

      // Add main image if selected
      if (mainImage) {
        payload.append("image", mainImage);
      }

      // Add basic fest day info
      payload.append("date", formData.date);
      payload.append("name", formData.name);
      payload.append("price", String(formData.price));
      payload.append("description", formData.description);

      validEvents.forEach((e, index) => {
        payload.append(`events[${index}][title]`, e.title.trim());
        if (e.description?.trim()) {
          payload.append(`events[${index}][description]`, e.description.trim());
        }
        if (e.imageUrl) {
          payload.append(`events[${index}][imageUrl]`, e.imageUrl);
        }
        if (e.imagePublicId) {
          payload.append(`events[${index}][imagePublicId]`, e.imagePublicId);
        }
      });

      // Add event images (using valid events indices)
      validEvents.forEach((event, index) => {
        if (event.imageFile) {
          payload.append(`event_${index}_image`, event.imageFile);
        }
      });

      if (initialData?._id) {
        await api.put(`/fest-days/${initialData._id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Fest day updated successfully");
      } else {
        await api.post("/fest-days", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Fest day created successfully");
      }
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to save fest day");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
      <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {initialData ? "Edit Fest Day" : "Add Fest Day"}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {initialData
                  ? "Update fest day details"
                  : "Create a new fest day"}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="rounded-full w-10 h-10 p-0 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Main image upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50/50">
            <label className="flex flex-col items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="font-medium text-gray-700">
                Upload Main Image
              </span>
              <span className="text-sm text-gray-500">
                Click to select or drag and drop
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="hidden"
              />
            </label>
            {mainImage && (
              <p className="text-sm text-blue-600 mt-3 text-center">
                ✓ {mainImage.name}
              </p>
            )}
            {!mainImage && initialData?.imageUrl && (
              <p className="text-sm text-gray-600 mt-3 text-center">
                Current image: {initialData.imageUrl.split("/").pop()}
              </p>
            )}
          </div>

          {mainImagePreview && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Eye className="w-4 h-4" /> Main Image Preview
              </label>
              <img
                src={mainImagePreview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg shadow-sm"
              />
            </div>
          )}

          {/* Basic fest day info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <Input
                placeholder="e.g. January 15"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <Input
                placeholder="Fest Day Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Price (INR)
            </label>
            <Input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              required
              className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full min-h-[120px] px-4 py-3 bg-white/50 border border-gray-200/50 focus:border-blue-500 focus:bg-white focus:outline-none rounded-xl resize-none"
            />
          </div>

          {/* Events Section */}
          <div className="border-t border-gray-200/50 pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Events</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {events.length} event(s)
                </p>
              </div>
              <Button
                type="button"
                onClick={addEvent}
                variant="outline"
                size="sm"
                className="rounded-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>

            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className="border-2 border-gray-200/50 rounded-lg p-5 bg-gray-50/50 space-y-4 hover:border-blue-300/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-800">
                        Event {index + 1}
                      </h4>
                      <Button
                        type="button"
                        onClick={() => removeEvent(event.id)}
                        variant="destructive"
                        size="sm"
                        className="rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <Input
                      placeholder="Event Title"
                      value={event.title}
                      onChange={(e) =>
                        setEvents(
                          events.map((ev) =>
                            ev.id === event.id
                              ? { ...ev, title: e.target.value }
                              : ev,
                          ),
                        )
                      }
                      required
                      className="bg-white border-gray-200/50 focus:border-blue-500 rounded-lg"
                    />

                    <textarea
                      placeholder="Event Description (Optional)"
                      value={event.description || ""}
                      onChange={(e) =>
                        setEvents(
                          events.map((ev) =>
                            ev.id === event.id
                              ? { ...ev, description: e.target.value }
                              : ev,
                          ),
                        )
                      }
                      className="w-full min-h-[80px] px-4 py-2 bg-white border border-gray-200/50 focus:border-blue-500 focus:outline-none rounded-lg resize-none text-sm"
                    />

                    {/* Event image upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                      <label className="flex flex-col items-center justify-center gap-2 cursor-pointer">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          Upload Event Image
                        </span>
                        <span className="text-xs text-gray-500">
                          (Optional)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleEventImageChange(
                              event.id,
                              e.target.files?.[0] || null,
                            )
                          }
                          className="hidden"
                        />
                      </label>
                      {event.imageFile && (
                        <p className="text-xs text-blue-600 mt-3 text-center">
                          ✓ {event.imageFile.name}
                        </p>
                      )}
                      {event.imageUrl && !event.imageFile && (
                        <p className="text-xs text-gray-600 mt-3 text-center">
                          Current: {event.imageUrl.split("/").pop()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-600 text-sm">
                  No events yet. Click "Add Event" to create one.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200/50">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg rounded-xl py-3 disabled:opacity-50">
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {initialData ? "Updating..." : "Creating..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {initialData ? "Update Fest Day" : "Create Fest Day"}
                </div>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl px-8 py-3">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FestDayForm;
