import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import api from "@/api/axios";

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  institution: z.string().min(1, "Institution is required"),
  whyJoin: z.string().min(1, "Please tell us why you want to join"),
  experience: z.string().min(1, "Please share your experience"),
});

type CaFormData = z.infer<typeof schema>;

const CaForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CaFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: CaFormData) => {
    try {
      await api.post("/ca", data);
      toast.success("Application submitted successfully!");
      reset();
    } catch (err) {
      toast.error("Failed to submit application");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-gray-100 p-8 rounded-xl shadow-lg text-tertiary-dark">
      <h2 className="text-2xl font-bold mb-6 text-[#1c2d27] text-center">CA Application Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Full Name</label>
          <Input {...register("fullName")} placeholder="John Doe" />
          {errors.fullName && (
            <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <Input {...register("email")} type="email" placeholder="you@example.com" />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Phone</label>
          <Input {...register("phone")} placeholder="1234567890" />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Institution</label>
          <Input {...register("institution")} placeholder="Your college/school" />
          {errors.institution && (
            <p className="text-sm text-red-500 mt-1">{errors.institution.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Why do you want to join?</label>
          <Textarea
            {...register("whyJoin")}
            placeholder="Tell us why you're interested in joining..."
            className="min-h-[100px]"
          />
          {errors.whyJoin && (
            <p className="text-sm text-red-500 mt-1">{errors.whyJoin.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Experience</label>
          <Textarea
            {...register("experience")}
            placeholder="Tell us about your relevant experience..."
            className="min-h-[100px]"
          />
          {errors.experience && (
            <p className="text-sm text-red-500 mt-1">{errors.experience.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1c2d27] text-tertiary font-semibold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
};

export default CaForm;
