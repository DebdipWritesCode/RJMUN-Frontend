import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { Save, X } from "lucide-react";

const schema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

type FAQFormData = z.infer<typeof schema>;

interface FAQFormProps {
  initialData?: {
    _id: string;
    question: string;
    answer: string;
  };
  onClose: () => void;
}

const FAQForm: React.FC<FAQFormProps> = ({
  initialData,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FAQFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      question: initialData?.question || "",
      answer: initialData?.answer || "",
    },
  });

  const onSubmit = async (data: FAQFormData) => {
    const formData = new FormData();
    formData.append("question", data.question);
    formData.append("answer", data.answer);

    try {
      if (initialData?._id) {
        await api.put(`/faqs/${initialData._id}`, formData)
        toast.success("FAQ updated");
      } else {
        await api.post("/faqs", formData);
        toast.success("FAQ added");
      }

      onClose();
    } catch (err) {
      toast.error("Failed to submit FAQ");
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
                {initialData ? "Edit FAQ" : "Add FAQ"}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {initialData ? "Update FAQ information" : "Create a new FAQ"}
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
              Question
            </label>
            <Textarea
              placeholder="Write the question for the FAQ..."
              {...register("question")}
              className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white transition-all duration-200 rounded-xl min-h-[120px] resize-none"
            />
            {errors.question && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.question.message}
              </p>
            )}
          </div>

          {/* Answer Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Answer
            </label>
            <Textarea
              placeholder="Write the answer for the FAQ..."
              {...register("answer")}
              className="bg-white/50 border-gray-200/50 focus:border-blue-500 focus:bg-white transition-all duration-200 rounded-xl min-h-[120px] resize-none"
            />
            {errors.answer && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.answer.message}
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
                  {initialData ? "Update FAQ" : "Create FAQ"}
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

export default FAQForm;