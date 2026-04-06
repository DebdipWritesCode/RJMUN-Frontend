import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { IndianRupee, Calendar, Tag, Loader2, AlertCircle, Check } from "lucide-react";
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

interface AmountData {
  subtotal: number;
  discountFromMultiDay: number;
  discountFromCoupon: number;
  finalAmount: number;
  coupon: { code: string; discountAmount: number } | null;
  currency: string;
}

const FestRegistrationForm: React.FC<FestRegistrationFormProps> = ({
  days,
  offers,
}) => {
  const [selectedDayIds, setSelectedDayIds] = useState<Set<string>>(new Set());
  const [selectedActivitiesPerDay, setSelectedActivitiesPerDay] = useState<Record<string, number[]>>({});
  const navigate = useNavigate();
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [isCalculatingAmount, setIsCalculatingAmount] = useState(false);
  const [amountData, setAmountData] = useState<AmountData | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FestFormData>({
    resolver: zodResolver(schema),
    defaultValues: { couponCode: "" },
  });

  const couponCode = watch("couponCode");

  const calculateAmount = useCallback(async () => {
    const ids = Array.from(selectedDayIds);
    if (ids.length === 0) {
      setAmountData(null);
      setAmountError(null);
      return;
    }

    setIsCalculatingAmount(true);
    setAmountError(null);

    try {
      const response = await api.post<AmountData>("/day-registration/calculate-amount", {
        selectedDayIds: ids,
        couponCode: couponCode?.trim() || undefined,
        selectedActivitiesPerDay: selectedActivitiesPerDay,
      });
      setAmountData(response.data);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || "Failed to calculate amount";
      setAmountError(errorMsg);
      setAmountData(null);
    } finally {
      setIsCalculatingAmount(false);
    }
  }, [selectedDayIds, couponCode, selectedActivitiesPerDay]);

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateAmount();
    }, 300); // Debounce to avoid too many API calls

    return () => clearTimeout(timer);
  }, [calculateAmount]);

  const selectedDays = days.filter((d) => selectedDayIds.has(d._id));
  const { subtotal, discountPercent, afterDiscount } = computeDisplayPricing(
    selectedDays,
    offers
  );

  const toggleDay = (id: string) => {
    setSelectedDayIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        // Clear activities for this day when deselected
        setSelectedActivitiesPerDay((prevActivities) => {
          const updated = { ...prevActivities };
          delete updated[id];
          return updated;
        });
      } else {
        next.add(id);
        // Initialize empty activity array for this day
        setSelectedActivitiesPerDay((prevActivities) => ({
          ...prevActivities,
          [id]: [],
        }));
      }
      return next;
    });
  };

  const isActivityLimitReached = (dayId: string): boolean => {
    return (selectedActivitiesPerDay[dayId]?.length ?? 0) >= 3;
  };

  const isActivitySelected = (dayId: string, activityIndex: number): boolean => {
    return (selectedActivitiesPerDay[dayId] ?? []).includes(activityIndex);
  };

  const toggleActivity = (dayId: string, activityIndex: number) => {
    setSelectedActivitiesPerDay((prev) => {
      const current = prev[dayId] ?? [];
      let updated: number[];

      if (current.includes(activityIndex)) {
        updated = current.filter((idx) => idx !== activityIndex);
      } else {
        if (current.length >= 3) {
          toast.error("Maximum 3 activities allowed per day");
          return prev;
        }
        updated = [...current, activityIndex];
      }

      return {
        ...prev,
        [dayId]: updated,
      };
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
      selectedActivitiesPerDay: selectedActivitiesPerDay,
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

      {/* Activities Selection */}
      {selectedDays.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Select Activities (Optional - Max 3 per day)
          </h3>
          <div className="space-y-4">
            {selectedDays.map((day) => (
              <div key={day._id} className="p-4 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{day.name}</h4>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    {selectedActivitiesPerDay[day._id]?.length ?? 0}/3 selected
                  </span>
                </div>

                {!day.events || day.events.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No activities scheduled for this day</p>
                ) : (
                  <div className="space-y-2">
                    {day.events.map((event, idx) => (
                      <label
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isActivitySelected(day._id, idx)
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-200 hover:border-gray-300"
                        } ${
                          isActivityLimitReached(day._id) && !isActivitySelected(day._id, idx)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isActivitySelected(day._id, idx)}
                          onChange={() => toggleActivity(day._id, idx)}
                          disabled={
                            isActivityLimitReached(day._id) &&
                            !isActivitySelected(day._id, idx)
                          }
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 flex items-center gap-2">
                            {event.title}
                            {isActivitySelected(day._id, idx) && (
                              <Check className="w-4 h-4 text-amber-600" />
                            )}
                          </div>
                          {event.description && (
                            <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                          )}
                        </div>
                        {event.imageUrl && (
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-14 h-14 object-cover rounded flex-shrink-0"
                          />
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing summary */}
      {selectedDays.length > 0 && (
        <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <IndianRupee className="w-4 h-4" />
            <h3 className="font-semibold">Price Breakdown</h3>
            {isCalculatingAmount && <Loader2 className="w-4 h-4 animate-spin text-amber-600" />}
          </div>

          {amountError ? (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">{amountError}</p>
            </div>
          ) : amountData ? (
            <div className="text-sm space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-700">Subtotal ({selectedDays.length} day{selectedDays.length !== 1 ? "s" : ""})</span>
                <span className="font-medium">₹{selectedDays.reduce((sum, day) => sum + day.price, 0)}</span>
              </div>

              {amountData.discountFromMultiDay > 0 && (
                <div className="flex justify-between py-2 border-b text-green-700">
                  <span>Multi-day discount</span>
                  <span className="font-medium">-₹{amountData.discountFromMultiDay}</span>
                </div>
              )}

              {amountData.discountFromCoupon > 0 && (
                <div className="flex justify-between py-2 border-b text-green-700">
                  <span>Coupon discount ({amountData.coupon?.code})</span>
                  <span className="font-medium">-₹{amountData.discountFromCoupon}</span>
                </div>
              )}

              <div className="flex justify-between pt-3 font-bold bg-amber-50 p-2 rounded-lg">
                <span className="text-lg">Total Amount</span>
                <span className="text-lg text-amber-700">₹{amountData.finalAmount}</span>
              </div>

              {(amountData.discountFromMultiDay > 0 || amountData.discountFromCoupon > 0) && (
                <p className="text-xs text-green-700 pt-1">
                  You saved: ₹{amountData.discountFromMultiDay + amountData.discountFromCoupon}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Select days to see pricing</p>
          )}
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

        {/* Razorpay Payment */}
        <div className="rounded-xl border border-border bg-background p-5 space-y-4">
          <p className="text-sm font-medium text-center">
            Click the button below to complete your payment via Razorpay, then upload a
            screenshot of the payment receipt.
          </p>
          
          {/* Payment Amount Box - Always Visible */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 min-h-24 sm:min-h-20 flex flex-col items-center justify-center">
            <p className="text-xs sm:text-sm text-gray-600 text-center mb-2">Payment Amount</p>
            <p className="text-center text-lg sm:text-xl md:text-2xl font-bold break-words max-w-full px-2">
              {isCalculatingAmount ? (
                <span className="text-amber-600 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Calculating...</span>
                </span>
              ) : amountError ? (
                <span className="text-red-600">Invalid Coupon</span>
              ) : amountData?.finalAmount === 0 ? (
                <span className="text-green-600 text-sm sm:text-base md:text-lg">🎉 Your registration is free!</span>
              ) : amountData ? (
                <span className="text-amber-700">₹{amountData.finalAmount}</span>
              ) : (
                <span className="text-gray-500 text-xs sm:text-sm">Select days to continue</span>
              )}
            </p>
          </div>

          <Button
            type="button"
            disabled={isCalculatingAmount || !amountData || !!amountError || selectedDayIds.size === 0 || amountData?.finalAmount === 0}
            onClick={() => {
              if (amountData) {
                window.open("https://rzp.io/rzp/RgMwms9", "_blank");
              }
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCalculatingAmount ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Calculating...
              </>
            ) : (
              "Pay with Razorpay"
            )}
          </Button>
          <p className="text-xs text-gray-600 text-center">
            A new window will open. Complete your payment and return to upload the receipt.
          </p>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Payment Receipt Screenshot <span className="text-red-500">*</span>
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
          disabled={isSubmitting || isCalculatingAmount || selectedDayIds.size === 0 || !paymentScreenshot}
          className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Registration"
          )}
        </Button>
      </form>
    </div>
  );
};

export default FestRegistrationForm;
