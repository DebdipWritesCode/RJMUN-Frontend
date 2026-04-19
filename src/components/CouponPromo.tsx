import { useState } from "react";
import { Copy, Check, Tag, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

interface CouponPromoProps {
  code: string;
  label?: string;
  description?: string;
  variant?: "inline" | "card";
  className?: string;
}

const CouponPromo = ({
  code,
  label = "Limited-time offer",
  description = "Apply at checkout for an instant discount.",
  variant = "inline",
  className = "",
}: CouponPromoProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(`Copied ${code} to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy. Please copy manually.");
    }
  };

  if (variant === "card") {
    return (
      <div
        className={`relative w-full max-w-full overflow-hidden rounded-xl border border-dashed border-[#f8c94c] bg-[#0b1f3a]/80 backdrop-blur-sm p-3 sm:p-4 shadow-md ${className}`}
      >
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[#f8c94c]/10 blur-xl pointer-events-none" />
        <div className="flex items-center gap-2 text-[#f8c94c] mb-2 min-w-0">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold truncate">
            {label}
          </span>
        </div>
        <p className="text-[#eef5ff] text-xs sm:text-sm mb-3 break-words">{description}</p>
        <div className="flex items-stretch gap-2 min-w-0">
          <div className="flex-1 min-w-0 flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg bg-[#f8c94c]/15 border border-[#f8c94c]/40">
            <Tag className="w-4 h-4 text-[#f8c94c] flex-shrink-0" />
            <span
              className="flex-1 min-w-0 font-semibold tracking-wider sm:tracking-widest text-[#f8c94c] text-sm sm:text-base truncate"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              {code}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Copy coupon code ${code}`}
            className="flex-shrink-0 flex items-center justify-center gap-1 px-2 sm:px-3 rounded-lg bg-[#f8c94c] hover:bg-[#e6b73f] text-[#0b1f3a] text-sm font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-full rounded-lg border border-dashed border-amber-400 bg-amber-50 p-3 ${className}`}
    >
      <div className="flex items-center gap-2 mb-2 min-w-0">
        <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-amber-800 truncate">
          {label}
        </span>
      </div>
      <p className="text-xs text-amber-900/80 mb-2 break-words">{description}</p>
      <div className="flex items-stretch gap-2 min-w-0">
        <div className="flex-1 min-w-0 flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md bg-white border border-amber-300">
          <Tag className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span className="flex-1 min-w-0 font-semibold tracking-wider sm:tracking-widest text-amber-800 text-sm truncate">
            {code}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy coupon code ${code}`}
          className="flex-shrink-0 flex items-center justify-center gap-1 px-2 sm:px-3 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CouponPromo;
