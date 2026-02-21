import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useState } from "react";
import { Save, X, Upload, Eye, Calendar } from "lucide-react";
import type { FestDay } from "@/utils/interfaces";

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  name: z.string().min(1, "Name is required"),
  eventsText: z.string().min(1, "At least one event is required"),
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
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FestDayFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: initialData?.date ?? "",
      name: initialData?.name ?? "",
      eventsText: initialData?.events?.join("\n") ?? "",
      price: initialData?.price ?? 0,
    },
  });

  const [preview, setPreview] = useState<string | null>(null);

  const onSubmit = async (data: FestDayFormData) => {
    const events = data.eventsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const formData = new FormData();
    formData.append("date", data.date);
    formData.append("name", data.name);
    formData.append("events", JSON.stringify(events));
    formData.append("price", String(data.price));
    if (data.image?.[0]) formData.append("image", data.image[0]);

    try {
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
            <label className="text-sm font-medium text-gray-700">Events (one per line)</label>
            <Textarea
              placeholder="Event 1&#10;Event 2&#10;Event 3"
              {...register("eventsText")}
              className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white rounded-xl min-h-[100px] resize-none"
            />
            {errors.eventsText && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full" />
                {errors.eventsText.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Image (optional)</label>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(e.target.files);
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                      className="bg-white/50 border-gray-200/50 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white hover:file:from-blue-600 hover:file:to-purple-700"
                    />
                    <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              )}
            />
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
