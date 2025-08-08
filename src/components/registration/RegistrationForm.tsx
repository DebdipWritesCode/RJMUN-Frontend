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
import api from "@/api/axios";
import { useRazorpay, type RazorpayOrderOptions } from "react-razorpay";
import { useNavigate } from "react-router-dom";

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

const RegistrationForm: React.FC<RegistrationFormProps> = ({ portfolios }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      couponCode: "",
    },
  });

  const navigate = useNavigate();

  const { Razorpay, error } = useRazorpay();

  const watchCommittee1 = useWatch({ control, name: "committeePreference1" });
  const watchCommittee2 = useWatch({ control, name: "committeePreference2" });

  const getPortfoliosByCommittee = (committeeName: string | undefined) => {
    return (
      portfolios.find((p) => p.committee === committeeName)?.portfolios ?? []
    );
  };

  const onSubmit = async (formData: RegistrationFormData) => {
    try {
      const { couponCode, ...data } = formData;

      const payload = {
        data,
        ...(couponCode && { couponCode }),
      };

      const response = await api.post("/registration/initiate", payload);
      const { order, finalAmount, currency, message, registrationId } =
        response.data;

      if (finalAmount <= 0 && registrationId) {
        toast.success(message || "Registration completed successfully!");
        navigate("/"); // redirect immediately
        return;
      }

      const options: RazorpayOrderOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: finalAmount * 100,
        currency,
        name: "RJMUN 2.0 Registration Fee",
        description:
          "Individual Delegate Registration for RJMUN 2.0 by" +
          ` ${formData.fullName}`,
        order_id: order.id,
        handler: (_: any) => {
          toast.success(
            "Payment successful! Registration will be confirmed shortly."
          );
          navigate("/");
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzpInstance = new Razorpay(options);
      rzpInstance.open();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to submit application"
      );
    }
  };
  if (error) {
    toast.error("Failed to load Razorpay. Please try again later.");
  }
  return (
    <div className="max-w-xl mx-auto mt-10 bg-gray-100 p-8 rounded-xl shadow-lg text-form-text">
      <h2 className="text-2xl font-bold mb-6 text-[#1c2d27] text-center">
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
        <div>
          <label className="block mb-1 text-sm font-medium">
            Coupon Code (Optional)
          </label>
          <Input
            {...register("couponCode")}
            placeholder="Enter coupon code if any"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1c2d27] text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50">
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;
