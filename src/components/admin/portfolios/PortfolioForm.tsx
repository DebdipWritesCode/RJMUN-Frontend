import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Save} from "lucide-react";
import { z } from "zod";
import api from "@/api/axios";

const schema = z.object({
  portfolios: z.string().min(1, "Portfolios cannot be empty"),
});

type PortfolioFormData = z.infer<typeof schema>;

interface PortfoliosFormProps {
  initialPortfolios: string[];
  committeeId: string;
  onClose: () => void;
  refresh: () => void;
}

const PortfoliosForm: React.FC<PortfoliosFormProps> = ({
  initialPortfolios,
  committeeId,
  onClose,
  refresh,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      portfolios: initialPortfolios.join("\n"),
    },
  });

  const onSubmit = async (data: PortfolioFormData) => {
    const updatedPortfolios = data.portfolios
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const uniqueSet = new Set(updatedPortfolios);
    if (uniqueSet.size !== updatedPortfolios.length) {
      toast.error("Portfolios must be unique. Duplicate entries found.");
      return;
    }

    try {
      await api.put(`/committees/${committeeId}/portfolios`, {
        portfolios: Array.from(uniqueSet),
      });

      toast.success("Portfolios updated");
      refresh();
      onClose();
    } catch (err) {
      toast.error("Failed to update portfolios");
    }
  };

  return (
    <div className="relative">
      {/* Decorative Background */}
      {/* <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div> */}

      <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Portfolios (one per line)
            </label>
            <Textarea
              placeholder="e.g. Design\nMarketing\nDevelopment"
              className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white transition-all duration-200 rounded-xl min-h-[140px] resize-none"
              {...register("portfolios")}
            />
            {errors.portfolios && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.portfolios.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200/50">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </div>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 hover:border-gray-300 transition-all duration-200 rounded-xl px-8 py-3">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfoliosForm;
