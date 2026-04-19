import { useState, useEffect, useCallback } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { Loader2, AlertCircle, IndianRupee } from "lucide-react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import CouponPromo from "@/components/CouponPromo";

export interface RegistrationFormProps {
  portfolios: {
    id: string;
    committee: string;
    portfolios: string[];
  }[];
}

const schema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    institution: z.string().min(1, "Institution is required"),
    numberOfMUNsParticipated: z.number().min(0, "Must be a positive number"),
    committeePreference1: z.string().min(1, "Please select a committee"),
    portfolioPreference1ForCommitteePreference1: z
      .string()
      .min(1, "Please select a portfolio"),
    portfolioPreference2ForCommitteePreference1: z
      .string()
      .min(1, "Please select a portfolio"),
    committeePreference2: z.string().min(1, "Please select a committee"),
    portfolioPreference1ForCommitteePreference2: z
      .string()
      .min(1, "Please select a portfolio"),
    portfolioPreference2ForCommitteePreference2: z
      .string()
      .min(1, "Please select a portfolio"),
    couponCode: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.committeePreference1 !== data.committeePreference2, {
    message: "Committee preferences must be different",
    path: ["committeePreference2"],
  });

type RegistrationFormData = z.infer<typeof schema>;

interface AmountData {
  baseAmount: number;
  discountFromCoupon: number;
  finalAmount: number;
  coupon: { code: string; discountAmount: number } | null;
  currency: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ portfolios }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      couponCode: "",
    },
  });

  const navigate = useNavigate();
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [isCalculatingAmount, setIsCalculatingAmount] = useState(false);
  const [amountData, setAmountData] = useState<AmountData | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  const watchCommittee1 = useWatch({ control, name: "committeePreference1" });
  const watchCommittee2 = useWatch({ control, name: "committeePreference2" });
  const couponCode = watch("couponCode");

  const getPortfoliosByCommittee = (committeeName: string | undefined) => {
    return (
      portfolios.find((p) => p.committee === committeeName)?.portfolios ?? []
    );
  };

  const calculateAmount = useCallback(async () => {
    setIsCalculatingAmount(true);
    setAmountError(null);

    try {
      const response = await api.post<AmountData>("/registration/calculate-amount", {
        couponCode: couponCode?.trim() || undefined,
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
  }, [couponCode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateAmount();
    }, 300); // Debounce to avoid too many API calls

    return () => clearTimeout(timer);
  }, [calculateAmount]);

  const onSubmit = async (formData: RegistrationFormData) => {
    if (!paymentScreenshot) {
      setScreenshotError("Payment screenshot is required.");
      return;
    }
    setScreenshotError(null);

    try {
      const { couponCode, ...data } = formData;

      const fd = new FormData();
      fd.append("data", JSON.stringify(data));
      fd.append("paymentScreenshot", paymentScreenshot);
      if (couponCode?.trim()) {
        fd.append("couponCode", couponCode.trim());
      }

      const response = await api.post("/registration/register-with-qr", fd, {
        headers: { "Content-Type": undefined },
      });
      const { message, registrationId } = response.data;
      toast.success(
        message || `Registration successful! Your ID: ${registrationId}`
      );
      navigate("/");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to submit application"
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-muted p-8 rounded-xl shadow-lg text-form-text">
      <h2 className="text-2xl font-bold mb-6 text-primary text-center">
        Delegate Application Form
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block mb-1 text-sm font-medium">Full Name</label>
          <Input {...register("fullName")} placeholder="John Doe" />
          {errors.fullName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
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

        {/* Phone */}
        <div>
          <label className="block mb-1 text-sm font-medium">Phone</label>
          <Input {...register("phone")} placeholder="1234567890" />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Institution */}
        <div>
          <label className="block mb-1 text-sm font-medium">Institution</label>
          <Input
            {...register("institution")}
            placeholder="Your college/school"
          />
          {errors.institution && (
            <p className="text-sm text-red-500 mt-1">
              {errors.institution.message}
            </p>
          )}
        </div>

        {/* Number of MUNs Participated */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Number of MUNs Participated
          </label>
          <Input
            {...register("numberOfMUNsParticipated", {
              valueAsNumber: true,
            })}
            type="number"
            placeholder="0"
          />
          {errors.numberOfMUNsParticipated && (
            <p className="text-sm text-red-500 mt-1">
              {errors.numberOfMUNsParticipated.message}
            </p>
          )}
        </div>

        {/* Committee Preference 1 */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Committee Preference 1
          </label>
          <Controller
            name="committeePreference1"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Committee" />
                </SelectTrigger>
                <SelectContent>
                  {portfolios.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={c.committee}
                      className="whitespace-normal break-words">
                      <p className="sm:w-full max-w-[180px]">{c.committee}</p>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.committeePreference1 && (
            <p className="text-sm text-red-500 mt-1">
              {errors.committeePreference1.message}
            </p>
          )}
        </div>

        {/* Portfolio 1 for Committee 1 */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Portfolio Preference 1 (for Committee 1)
          </label>
          <Controller
            name="portfolioPreference1ForCommitteePreference1"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Portfolio" />
                </SelectTrigger>
                <SelectContent>
                  {getPortfoliosByCommittee(watchCommittee1).map(
                    (portfolio) => (
                      <SelectItem
                        key={portfolio}
                        value={portfolio}
                        className="whitespace-normal break-words">
                        <p className="sm:w-full max-w-[180px]">{portfolio}</p>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.portfolioPreference1ForCommitteePreference1 && (
            <p className="text-sm text-red-500 mt-1">
              {errors.portfolioPreference1ForCommitteePreference1.message}
            </p>
          )}
        </div>

        {/* Portfolio 2 for Committee 1 */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Portfolio Preference 2 (for Committee 1)
          </label>
          <Controller
            name="portfolioPreference2ForCommitteePreference1"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Portfolio" />
                </SelectTrigger>
                <SelectContent>
                  {getPortfoliosByCommittee(watchCommittee1).map(
                    (portfolio) => (
                      <SelectItem
                        key={portfolio}
                        value={portfolio}
                        className="whitespace-normal break-words">
                        <p className="sm:w-full max-w-[180px]">{portfolio}</p>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.portfolioPreference2ForCommitteePreference1 && (
            <p className="text-sm text-red-500 mt-1">
              {errors.portfolioPreference2ForCommitteePreference1.message}
            </p>
          )}
        </div>

        {/* Committee Preference 2 */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Committee Preference 2
          </label>
          <Controller
            name="committeePreference2"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Committee" />
                </SelectTrigger>
                <SelectContent>
                  {portfolios
                    .filter((c) => c.committee !== watchCommittee1)
                    .map((c) => (
                      <SelectItem
                        key={c.id}
                        value={c.committee}
                        className="whitespace-normal break-words">
                        <p className="sm:w-full max-w-[180px]">{c.committee}</p>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.committeePreference2 && (
            <p className="text-sm text-red-500 mt-1">
              {errors.committeePreference2.message}
            </p>
          )}
        </div>

        {/* Portfolio Preferences for Committee 2 */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Portfolio Preference 1 (for Committee 2)
          </label>
          <Controller
            name="portfolioPreference1ForCommitteePreference2"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Portfolio" />
                </SelectTrigger>
                <SelectContent>
                  {getPortfoliosByCommittee(watchCommittee2).map(
                    (portfolio) => (
                      <SelectItem
                        key={portfolio}
                        value={portfolio}
                        className="whitespace-normal break-words">
                        <p className="sm:w-full max-w-[180px]">{portfolio}</p>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.portfolioPreference1ForCommitteePreference2 && (
            <p className="text-sm text-red-500 mt-1">
              {errors.portfolioPreference1ForCommitteePreference2.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Portfolio Preference 2 (for Committee 2)
          </label>
          <Controller
            name="portfolioPreference2ForCommitteePreference2"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Portfolio" />
                </SelectTrigger>
                <SelectContent>
                  {getPortfoliosByCommittee(watchCommittee2).map(
                    (portfolio) => (
                      <SelectItem
                        key={portfolio}
                        value={portfolio}
                        className="whitespace-normal break-words">
                        <p className="sm:w-full max-w-[180px]">{portfolio}</p>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.portfolioPreference2ForCommitteePreference2 && (
            <p className="text-sm text-red-500 mt-1">
              {errors.portfolioPreference2ForCommitteePreference2.message}
            </p>
          )}
        </div>

        {/* Optional Coupon Code */}
        <div className="space-y-2">
          <CouponPromo
            code="EARLYBIRD100"
            label="Early bird offer"
            description="Use this code below to unlock your MUN discount."
          />
          <label className="block mb-1 text-sm font-medium">
            Coupon Code (Optional)
          </label>
          <Input
            {...register("couponCode")}
            placeholder="Enter coupon code if any"
          />
        </div>

        {/* Pricing summary */}
        <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <IndianRupee className="w-4 h-4" />
            <h3 className="font-semibold">Amount Breakdown</h3>
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
                <span className="text-gray-700">Base Amount</span>
                <span className="font-medium">₹{amountData.baseAmount}</span>
              </div>

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

              {amountData.discountFromCoupon > 0 && (
                <p className="text-xs text-green-700 pt-1">
                  You saved: ₹{amountData.discountFromCoupon}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Loading pricing...</p>
          )}
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
                <span className="text-gray-500 text-xs sm:text-sm">Loading pricing...</span>
              )}
            </p>
          </div>

          <Button
            type="button"
            disabled={isCalculatingAmount || !amountData || !!amountError || amountData?.finalAmount === 0}
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || isCalculatingAmount || !paymentScreenshot}
          className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;
