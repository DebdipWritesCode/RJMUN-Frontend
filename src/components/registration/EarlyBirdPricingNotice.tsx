import { Clock3 } from "lucide-react";
import {
  EARLY_BIRD_DISPLAY_DEADLINE,
  formatInr,
  isEarlyBirdActive,
  REGISTRATION_PRICES,
} from "@/utils/registration-pricing";

interface EarlyBirdPricingNoticeProps {
  tone?: "dark" | "light";
  className?: string;
}

const EarlyBirdPricingNotice = ({
  tone = "dark",
  className = "",
}: EarlyBirdPricingNoticeProps) => {
  const isDark = tone === "dark";
  const earlyBirdActive = isEarlyBirdActive();

  return (
    <section
      aria-labelledby="early-bird-pricing-title"
      className={`w-full rounded-xl border p-4 ${
        isDark
          ? "border-[#f8c94c]/50 bg-[#07172c]/90 text-[#eef5ff]"
          : "border-amber-300 bg-amber-50 text-slate-900"
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        <Clock3
          aria-hidden="true"
          className={`mt-0.5 h-5 w-5 shrink-0 ${
            isDark ? "text-[#f8c94c]" : "text-amber-700"
          }`}
        />
        <div className="min-w-0 flex-1">
          <h2
            id="early-bird-pricing-title"
            className={`text-base font-bold ${
              isDark ? "text-[#f8c94c]" : "text-amber-900"
            }`}
          >
            {earlyBirdActive
              ? "Early-bird pricing is applied automatically"
              : "Regular pricing is now active"}
          </h2>
          <p className="mt-1 text-sm leading-6">
            {earlyBirdActive ? "Available until" : "Early-bird pricing ended at"}{" "}
            <strong>{EARLY_BIRD_DISPLAY_DEADLINE}</strong>.
          </p>
          <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide opacity-75">
                MUN registration
              </dt>
              <dd className="mt-1 text-2xl font-black tabular-nums">
                {formatInr(
                  earlyBirdActive
                    ? REGISTRATION_PRICES.mun.earlyBird
                    : REGISTRATION_PRICES.mun.regular
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide opacity-75">
                DESTINIQUE
              </dt>
              <dd className="mt-1 text-2xl font-black tabular-nums">
                {formatInr(
                  earlyBirdActive
                    ? REGISTRATION_PRICES.fest.earlyBirdPerDay
                    : REGISTRATION_PRICES.fest.regularPerDay
                )}{" "}
                / day
              </dd>
              <p className="text-xs opacity-80">
                Both days:{" "}
                {formatInr(
                  earlyBirdActive
                    ? REGISTRATION_PRICES.fest.earlyBirdBothDays
                    : REGISTRATION_PRICES.fest.regularBothDays
                )}
              </p>
            </div>
          </dl>
          {earlyBirdActive && (
            <p className="mt-3 border-t border-current/20 pt-3 text-xs leading-5 opacity-85">
              From the cutoff: MUN {formatInr(REGISTRATION_PRICES.mun.regular)};
              DESTINIQUE {formatInr(REGISTRATION_PRICES.fest.regularPerDay)} per
              day or {formatInr(REGISTRATION_PRICES.fest.regularBothDays)} for both days.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default EarlyBirdPricingNotice;
