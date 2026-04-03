import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { IndianRupee, Calendar, Tag } from "lucide-react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import type { FestDay, FestDayOffers } from "@/utils/interfaces";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be exactly 10 digits"),
  couponCode: z.string().optional().or(z.literal("")),
});

type FestFormData = z.infer<typeof schema>;

export interface FestRegistrationFormProps {
  days: FestDay[];
  offers: FestDayOffers;
}

function computeDisplayPricing(
  selectedDays: FestDay[],
  offers: FestDayOffers
): { subtotal: number; discountPercent: number; afterDiscount: number } {
  const subtotal = selectedDays.reduce((s, d) => s + d.price, 0);
  const k = selectedDays.length;
  const discountPercent = k >= 2 ? offers[String(k)] ?? 0 : 0;
  const afterDiscount = subtotal * (1 - discountPercent / 100);
  return { subtotal, discountPercent, afterDiscount };
}

const FestRegistrationForm: React.FC<FestRegistrationFormProps> = ({
  days,
  offers,
}) => {
  const [selectedDayIds, setSelectedDayIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FestFormData>({
    resolver: zodResolver(schema),
    defaultValues: { couponCode: "" },
  });

  const selectedDays = days.filter((d) => selectedDayIds.has(d._id));
  const { subtotal, discountPercent, afterDiscount } = computeDisplayPricing(
    selectedDays,
    offers
  );

  const toggleDay = (id: string) => {
    setSelectedDayIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onSubmit = async (formData: FestFormData) => {
    const ids = Array.from(selectedDayIds);
    if (ids.length === 0) {
      toast.error("Select at least one day");
      return;
    }
    if (!paymentScreenshot) {
      setScreenshotError("Payment screenshot is required.");
      return;
    }
    setScreenshotError(null);

    const data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      selectedDayIds: ids,
    };

    try {
      const fd = new FormData();
      fd.append("data", JSON.stringify(data));
      fd.append("paymentScreenshot", paymentScreenshot);
      if (formData.couponCode?.trim()) {
        fd.append("couponCode", formData.couponCode.trim());
      }

      const response = await api.post("/day-registration/register-with-qr", fd, {
        headers: { "Content-Type": undefined },
      });
      const { message: msg, registrationId } = response.data;
      toast.success(msg || "Registration completed successfully!");
      navigate("/fest/success", { state: { registrationId, email: formData.email } });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to submit registration"
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-muted p-8 rounded-xl shadow-lg text-form-text">
      <h2 className="text-2xl font-bold mb-6 text-primary text-center">
        Fest Day Registration
      </h2>

      {/* Day selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Select days
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {days.map((day) => (
            <label
              key={day._id}
              className={`flex cursor-pointer rounded-xl border-2 p-4 transition-all ${
                selectedDayIds.has(day._id)
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedDayIds.has(day._id)}
                onChange={() => toggleDay(day._id)}
                className="mr-3 mt-1 h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800">{day.name}</div>
                <div className="text-sm text-gray-600">{day.date}</div>
                <div className="flex items-center gap-1 text-amber-700 font-medium mt-1">
                  <IndianRupee className="w-4 h-4" />
                  {day.price}
                </div>
                {day.description && (
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {day.description}
                  </div>
                )}
                {day.events && day.events.length > 0 && (
                  <div className="text-xs text-amber-700 font-medium mt-2">
                    {day.events.length} event(s) scheduled
                  </div>
                )}
              </div>
              {day.imageUrl && (
                <img
                  src={day.imageUrl}
                  alt=""
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
              )}
            </label>
          ))}
        </div>
        {selectedDays.length >= 2 && offers[String(selectedDays.length)] != null && (
          <p className="text-sm text-green-700 mt-2">
            {offers[String(selectedDays.length)]}% off for {selectedDays.length} days
          </p>
        )}
      </div>

      {/* Pricing summary */}
      {selectedDays.length > 0 && (
        <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <IndianRupee className="w-4 h-4" />
            Pricing
          </h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Subtotal ({selectedDays.length} day(s))</span>
              <span>₹{subtotal}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Multi-day discount ({discountPercent}%)</span>
                <span>-₹{(subtotal - afterDiscount).toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Amount before coupon</span>
              <span>₹{afterDiscount.toFixed(0)}</span>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              Coupon (if any) will be applied at checkout.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">First name</label>
            <Input {...register("firstName")} placeholder="First name" />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Last name</label>
            <Input {...register("lastName")} placeholder="Last name" />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <Input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Phone (10 digits)</label>
          <Input {...register("phone")} placeholder="9876543210" />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className="flex items-center gap-1 mb-1 text-sm font-medium">
            <Tag className="w-4 h-4" />
            Coupon code (optional)
          </label>
          <Input {...register("couponCode")} placeholder="Enter coupon if you have one" />
        </div>

        {/* QR Payment */}
        <div className="rounded-xl border border-border bg-background p-5 space-y-4">
          <p className="text-sm font-medium text-center">
            Scan the QR code below and pay the registration fee, then upload a
            screenshot of the payment.
          </p>
          <div className="flex justify-center">
            <img
              src="/payment.jpeg"
              alt="Payment QR code"
              className="w-56 h-56 object-contain rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Payment Screenshot <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setPaymentScreenshot(e.target.files?.[0] ?? null);
                setScreenshotError(null);
              }}
              className="block w-full text-sm text-form-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
            />
            {screenshotError && (
              <p className="text-sm text-red-500 mt-1">{screenshotError}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || selectedDayIds.size === 0}
          className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Registration"}
        </Button>
      </form>
    </div>
  );
};

export default FestRegistrationForm;
