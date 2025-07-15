import { useEffect, useState } from "react";
import api from "@/api/axios";
import type { FAQ } from "@/utils/interfaces";
import { Loader2 } from "lucide-react";

const FAQsPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await api.get<FAQ[]>("/faqs");
        setFaqs(res.data);
      } catch (err) {
        console.error("Failed to fetch FAQs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      ) : (
        <div>{faqs.length} FAQs loaded</div>
      )}
    </div>
  );
};

export default FAQsPage;
