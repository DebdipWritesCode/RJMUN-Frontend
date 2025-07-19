import { useEffect, useState } from "react";
import api from "@/api/axios";
import type { FAQ } from "@/utils/interfaces";
import { Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <div className="flex flex-col items-center min-h-[200px] px-4">
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-4xl">
          <h1 className="font-bold sm:text-[100px] text-[40px] sm:mb-20 mb-10 text-center">
            Frequently Asked Questions
          </h1>

          {faqs.length > 0 ? (
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-4"
              defaultValue={faqs[0]?._id}>
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq._id}
                  value={faq._id}
                  className="rounded-lg overflow-hidden border-none bg-[#1c2d27] text-white shadow-md">
                  <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline hover:bg-[#2B2F36] transition-colors data-[state=open]:rounded-b-none">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="bg-tertiary text-[#1c2d27] px-6 py-4 text-base leading-relaxed text-balance">
                    <p>{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-lg text-gray-500 text-center">
              No FAQs available at the moment.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FAQsPage;
