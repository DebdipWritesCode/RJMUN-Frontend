import { IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  festPricingItems,
  pricingItems,
  paymentMethods,
} from "@/utils/pricing";
import {
  EARLY_BIRD_DISPLAY_DEADLINE,
  isEarlyBirdActive,
} from "@/utils/registration-pricing";

const PricingPage = () => {
  const navigate = useNavigate();
  const earlyBirdActive = isEarlyBirdActive();

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto px-6 py-12 bg-[#0b1f3a]/85 border border-[#f8c94c]/30 rounded-2xl shadow-xl">
      <h1 className="font-bold sm:text-[60px] text-primary text-[40px] sm:mb-20 mb-15 text-center">
        PRICING
      </h1>

      <div className="w-full space-y-16">
        <section className="rounded-xl border-2 border-[#f8c94c] bg-[#07172c] p-5 text-[#eef5ff]">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f8c94c]">
            {earlyBirdActive ? "Early-bird deadline" : "Regular pricing active"}
          </p>
          <p className="mt-2 text-2xl font-black sm:text-3xl">
            {EARLY_BIRD_DISPLAY_DEADLINE}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#eef5ff]/85">
            {earlyBirdActive
              ? "Early-bird fees are applied automatically. Regular fees begin at the cutoff."
              : "The early-bird window has ended. The regular fees shown below now apply."}
          </p>
        </section>

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
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border-2 border-[#f8c94c] bg-[#07172c] p-4 text-[#f8c94c]">
                    <p className="text-xs font-bold uppercase tracking-wide">
                      Early bird {earlyBirdActive ? "· current" : "· ended"}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-3xl font-black tabular-nums">
                      <IndianRupee className="h-6 w-6" />
                      {item.earlyBirdPrice}
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#f8c94c]/40 bg-[#0b1f3a]/80 p-4 text-[#eef5ff]">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#eef5ff]/70">
                      Regular {earlyBirdActive ? "· from cutoff" : "· current"}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-2xl font-bold tabular-nums">
                      <IndianRupee className="h-5 w-5" />
                      {item.regularPrice}
                    </div>
                  </div>
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
          <div className="border-l-2 border-[#f8c94c]/30 pl-6 space-y-8">
            {festPricingItems.map((item) => (
              <div key={item.title}>
                <h4 className="text-xl font-semibold mb-2 text-primary">
                  {item.title}
                </h4>
                <p className="text-base leading-relaxed mb-4 text-[#eef5ff]">
                  {item.description}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border-2 border-[#f8c94c] bg-[#07172c] p-4 text-[#f8c94c]">
                    <p className="text-xs font-bold uppercase tracking-wide">
                      Early bird {earlyBirdActive ? "· current" : "· ended"}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-3xl font-black tabular-nums">
                      <IndianRupee className="h-6 w-6" />
                      {item.earlyBirdPrice}
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#f8c94c]/40 bg-[#0b1f3a]/80 p-4 text-[#eef5ff]">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#eef5ff]/70">
                      Regular {earlyBirdActive ? "· from cutoff" : "· current"}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-2xl font-bold tabular-nums">
                      <IndianRupee className="h-5 w-5" />
                      {item.regularPrice}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
