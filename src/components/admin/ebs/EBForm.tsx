import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useState } from "react";
import { Save, X, Upload, Eye } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  committee: z.string().min(1, "Committee is required"),
  image: z.any().optional(),
});

type EBFormData = z.infer<typeof schema>;

interface EBFormProps {
  initialData?: {
    _id: string;
    name: string;
    position: string;
    committee: string;
  };
  onClose: () => void;
}

const EBForm: React.FC<EBFormProps> = ({
  initialData,
  onClose,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EBFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || "",
      position: initialData?.position || "",
      committee: initialData?.committee || "",
    },
  });

  const [preview, setPreview] = useState<string | null>(null);

  const onSubmit = async (data: EBFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("position", data.position);
    formData.append("committee", data.committee);
    if (data.image && data.image[0]) formData.append("image", data.image[0]);

    try {
      if (initialData?._id) {
        await api.put(`/eb/${initialData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("EB updated");
      } else {
        await api.post("/eb", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("EB added");
      }

      onClose();
    } catch (err) {
      toast.error("Failed to submit EB form");
    }
  };

  return (
    <div className="relative">
      {/* Background decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      
      <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Save className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {initialData ? "Edit EB Member" : "Add EB Member"}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {initialData ? "Update EB member information" : "Create a new EB member"}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="rounded-full w-10 h-10 p-0 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                EB Name
              </label>
              <Input
                placeholder="Enter EB name"
                {...register("name")}
                className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white transition-all duration-200 rounded-xl"
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Position Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Position
              </label>
              <Input
                placeholder="Enter position"
                {...register("position")}
                className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white transition-all duration-200 rounded-xl"
              />
              {errors.position && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.position.message}
                </p>
              )}
            </div>

            {/* Committee Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Committee
              </label>
              <Input
                placeholder="Enter committee name"
                {...register("committee")}
                className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white transition-all duration-200 rounded-xl"
              />
              {errors.committee && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.committee.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                EB Image
              </label>
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
                        className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white transition-all duration-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white hover:file:from-blue-600 hover:file:to-purple-700"
                      />
                      <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.image && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.image.message as string}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
  
            {/* Image Preview */}
            {preview && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Image Preview
                </label>
                <div className="bg-white/50 border border-gray-200/50 rounded-xl p-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-w-md h-auto rounded-lg border shadow-sm"
                  />
                </div>
              </div>
            )}
  
            {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200/50">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {initialData ? "Updating..." : "Creating..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {initialData ? "Update EB Member" : "Create EB Member"}
                </div>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 hover:border-gray-300 transition-all duration-200 rounded-xl px-8 py-3"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EBForm;