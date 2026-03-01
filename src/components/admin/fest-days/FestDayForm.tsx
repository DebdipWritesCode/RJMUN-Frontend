import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Save, X, Upload, Eye, Calendar, Plus, Trash2 } from "lucide-react";
import type { FestDay, FestDayEvent } from "@/utils/interfaces";

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  price: z.number().min(0, "Price must be 0 or more"),
  image: z.any().optional(),
});

type FestDayFormData = z.infer<typeof schema>;

interface FestDayFormProps {
  initialData?: FestDay;
  onClose: () => void;
}

const FestDayForm: React.FC<FestDayFormProps> = ({ initialData, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FestDayFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: initialData?.date ?? "",
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
    },
  });

  // When switching to a different fest day (e.g. Edit another day), sync form with new initialData
  useEffect(() => {
    reset({
      date: initialData?.date ?? "",
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
    });
    setEvents(initialData?.events ?? []);
  }, [initialData?._id, reset, initialData]);

  const [preview, setPreview] = useState<string | null>(null);
  const [events, setEvents] = useState<FestDayEvent[]>(initialData?.events ?? []);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");

  const addEvent = () => {
    if (!newEventTitle.trim()) {
      toast.error("Event title is required");
      return;
    }
    setEvents([...events, { title: newEventTitle, description: newEventDescription }]);
    setNewEventTitle("");
    setNewEventDescription("");
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FestDayFormData) => {
    const formData = new FormData();
    formData.append("date", data.date);
    formData.append("name", data.name);
    formData.append("description", data.description ?? "");
    formData.append("price", String(data.price));
    formData.append("events", JSON.stringify(events));
    if (data.image?.[0]) formData.append("image", data.image[0]);

    try {
      console.log("Submitting fest day with data:", {
        date: data.date,
        name: data.name,
        description: data.description,
        price: data.price,
        events,
        image: data.image?.[0],
      });
      if (initialData?._id) {
        await api.put(`/fest-days/${initialData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Fest day updated");
      } else {
        await api.post("/fest-days", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Fest day added");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save fest day");
    }
  };

  return (
    <div className="relative">
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
                {initialData ? "Update fest day" : "Create a new fest day"}
              </p>
            </div>
          </div>
          <Button type="button" variant="ghost" onClick={onClose} className="rounded-full w-10 h-10 p-0 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <Input
                placeholder='e.g. January 15'
                {...register("date")}
                className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white rounded-xl"
              />
              {errors.date && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  {errors.date.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <Input
                placeholder="Display name for the day"
                {...register("name")}
                className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white rounded-xl"
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Price (INR)</label>
            <Input
              type="number"
              min={0}
              step={1}
              {...register("price", { valueAsNumber: true })}
              className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white rounded-xl"
            />
            {errors.price && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full" />
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register("description")}
              placeholder="Enter a simple text description"
              className="w-full min-h-[120px] px-4 py-3 bg-white/50 border border-gray-200/50 focus:border-blue-500 focus:bg-white focus:outline-none rounded-xl resize-none"
            />
          </div>

          <div className="space-y-3 border-t border-gray-200/50 pt-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Events</label>
              <span className="text-xs text-gray-500">{events.length} event(s)</span>
            </div>

            {/* Existing Events */}
            {events.length > 0 && (
              <div className="space-y-3 bg-gray-50/50 rounded-xl p-4 border border-gray-200/30">
                {events.map((event, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 flex items-start justify-between gap-4 border border-gray-200/50">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 break-words">{event.title}</p>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-1 break-words">{event.description}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeEvent(index)}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Event */}
            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/30 space-y-3">
              <p className="text-xs font-medium text-gray-600 uppercase">Add Event</p>
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Event title"
                className="w-full px-4 py-2 bg-white border border-gray-200/50 focus:border-blue-500 focus:bg-white focus:outline-none rounded-lg text-sm"
              />
              <textarea
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                placeholder="Event description (optional)"
                className="w-full min-h-[60px] px-4 py-2 bg-white border border-gray-200/50 focus:border-blue-500 focus:bg-white focus:outline-none rounded-lg resize-none text-sm"
              />
              <Button
                type="button"
                onClick={addEvent}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Image (optional)</label>
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                {...register("image")}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                }}
                className="bg-white/50 border-gray-200/50 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white hover:file:from-blue-600 hover:file:to-purple-700"
              />
              <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {preview && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Eye className="w-4 h-4" /> Image Preview
              </label>
              <div className="bg-white/50 border border-gray-200/50 rounded-xl p-4">
                <img src={preview} alt="Preview" className="w-full max-w-md h-auto rounded-lg border shadow-sm" />
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t border-gray-200/50">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg rounded-xl py-3 disabled:opacity-50"
            >
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
            <Button type="button" variant="secondary" onClick={onClose} className="rounded-xl px-8 py-3">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FestDayForm;
