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
import EarlyBirdPricingNotice from "@/components/registration/EarlyBirdPricingNotice";
import PaymentInstructions from "@/components/registration/PaymentInstructions";
import axios from "axios";

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
  regularAmount: number;
  discountFromCoupon: number;
  finalAmount: number;
  coupon: { code: string; discountAmount: number } | null;
  currency: string;
  pricingPhase: "early_bird" | "regular";
  earlyBirdEndsAt: string;
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
    } catch (error: unknown) {
      const errorMsg = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || "Failed to calculate amount"
        : "Failed to calculate amount";
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
    try {
      const { couponCode, ...data } = formData;

      const fd = new FormData();
      fd.append("data", JSON.stringify(data));
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
    } catch (error: unknown) {
      toast.error(
        axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message || "Failed to submit application"
          : "Failed to submit application"
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-muted p-8 rounded-xl shadow-lg text-form-text">
      <h2 className="text-2xl font-bold mb-6 text-primary text-center">
        Delegate Application Form
      </h2>
      <EarlyBirdPricingNotice tone="light" className="mb-6" />
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
          <label className="block mb-1 text-sm font-medium">
            Coupon Code (Optional)
          </label>
          <Input
            {...register("couponCode")}
            placeholder="Enter an official partner code"
          />
          <p className="text-xs leading-5 text-slate-600">
            Early-bird pricing is automatic and does not require a coupon.
          </p>
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
                <span className="text-gray-700">
                  {amountData.pricingPhase === "early_bird"
                    ? "Early-bird registration"
                    : "Registration fee"}
                </span>
                <span className="font-medium">₹{amountData.baseAmount}</span>
              </div>

              {amountData.pricingPhase === "early_bird" && (
                <div className="flex justify-between py-2 border-b text-green-700">
                  <span>Early-bird saving</span>
                  <span className="font-medium">
                    -₹{amountData.regularAmount - amountData.baseAmount}
                  </span>
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

        <PaymentInstructions
          amount={amountData?.finalAmount}
          amountError={amountError}
          isCalculating={isCalculatingAmount}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || isCalculatingAmount}
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
