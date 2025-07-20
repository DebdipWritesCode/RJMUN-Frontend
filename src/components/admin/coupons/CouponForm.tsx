import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const schema = z.object({
  code: z.string().min(1, "Code is required"),
  amountOff: z.number().min(0, "Amount off must be positive"),
  redemptionsLeft: z.number().min(1, "Redemptions left must be positive"),
});

type CouponFormData = z.infer<typeof schema>;

interface CouponFormProps {
  initialData?: {
    _id: string;
    code: string;
    amountOff: number;
    redemptionsLeft: number;
  };
  onClose: () => void;
}

const CouponForm: React.FC<CouponFormProps> = ({
  initialData,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: initialData?.code || "",
      amountOff: initialData?.amountOff || 0,
      redemptionsLeft: initialData?.redemptionsLeft || 1,
    },
  });

  const onSubmit = async (data: CouponFormData) => {
    try {
      if (initialData?._id) {
        await api.patch(`/coupons/${initialData._id}`, data)
        toast.success("Coupon updated");
      } else {
        await api.post("/coupons", data);
        toast.success("Coupon added");
      }

      onClose();
    } catch (err) {
      toast.error("Failed to submit Coupon");
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
                {initialData ? "Edit Coupon" : "Add Coupon"}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {initialData ? "Update Coupon information" : "Create a new Coupon"}
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

          {/* Question Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Code
            </label>
            <Input
              placeholder="Enter the coupon code"
              type="text"
              {...register("code")}
              className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white transition-all duration-200 rounded-xl"
            />
            {errors.code && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.code.message}
              </p>
            )}
          </div>

          {/* Amount Off Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Amount Off
            </label>
            <Input
              placeholder="Enter amount off"
              type="number"
              {...register("amountOff", { valueAsNumber: true })}
              className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white transition-all duration-200 rounded-xl"
            />
            {errors.amountOff && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.amountOff.message}
              </p>
            )}
          </div>

          {/* Redemptions Left Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Redemptions Left
            </label>
            <Input
              placeholder="Enter redemptions left"
              type="number"
              {...register("redemptionsLeft", { valueAsNumber: true })}
              className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white transition-all duration-200 rounded-xl"
            />
            {errors.redemptionsLeft && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.redemptionsLeft.message}
              </p>
            )}
          </div>

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
                  {initialData ? "Update Coupon" : "Create Coupon"}
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

export default CouponForm;