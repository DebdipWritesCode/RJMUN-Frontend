import { IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pricingItems, pricingNote, paymentMethods } from "@/utils/pricing";

const PricingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-bold sm:text-[60px] text-primary text-[40px] sm:mb-20 mb-15 text-center">
        PRICING
      </h1>

      <div className="w-full space-y-16">
        <section className="w-full">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Registration Fees
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6 space-y-8">
            {pricingItems.map((item, index) => (
              <div key={index}>
                <h4 className="text-xl font-semibold mb-2 text-primary">
                  {item.title}
                </h4>
                <p className="text-base leading-relaxed mb-4 text-[#eef5ff]">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-2xl font-bold text-[#f8c94c] bg-[#0b1f3a]/80 border border-[#f8c94c]/40 py-3 px-4 rounded-xl w-fit">
                  <IndianRupee className="w-6 h-6" />
                  {item.price}
                </div>
                {item.note && (
                  <p className="text-sm text-[#eef5ff]/70 mt-2">{item.note}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="w-full">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Fest Day Passes
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            <p className="text-base leading-relaxed text-[#eef5ff]">
              {pricingNote}
            </p>
            <button
              onClick={() => navigate("/fest-days")}
              className="mt-4 inline-block underline text-accent text-base hover:opacity-80 transition-opacity"
            >
              View Fest Days & Pricing
            </button>
          </div>
        </section>

        <section className="w-full text-[#eef5ff]">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Payment Information
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            <ul className="space-y-4">
              {paymentMethods.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-[#f8c94c] rounded-full mt-2 mr-4 flex-shrink-0 opacity-60"></span>
                  <span className="text-base leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="w-full">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Refunds
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            <p className="text-base leading-relaxed text-[#eef5ff]">
              For details on our cancellation and refund terms, please refer to
              our{" "}
              <a href="/refund-policy" className="underline text-accent">
                Cancellation & Refund Policy
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PricingPage;
