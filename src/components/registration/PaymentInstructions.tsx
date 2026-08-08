import {
  AlertTriangle,
  Landmark,
  Loader2,
  MessageCircle,
  Upload,
} from "lucide-react";
import { formatInr } from "@/utils/registration-pricing";

interface PaymentInstructionsProps {
  amount?: number;
  amountError?: string | null;
  isCalculating: boolean;
  inputId: string;
  screenshotError?: string | null;
  onScreenshotChange: (file: File | null) => void;
}

const PaymentInstructions = ({
  amount,
  amountError,
  isCalculating,
  inputId,
  screenshotError,
  onScreenshotChange,
}: PaymentInstructionsProps) => (
  <section
    aria-labelledby={`${inputId}-title`}
    className="space-y-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
  >
    <div className="text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
        Payment details
      </p>
      <h3 id={`${inputId}-title`} className="mt-1 text-xl font-bold text-slate-900">
        Scan the official QR and upload your receipt
      </h3>
    </div>

    <div className="grid items-start gap-5 md:grid-cols-[minmax(180px,0.8fr)_minmax(0,1.2fr)]">
      <div className="mx-auto w-full max-w-[260px] rounded-xl border border-slate-200 bg-slate-50 p-3">
        <img
          src="/payment-qr.png"
          alt="Official RJMUN payment QR code for the IDFC First Bank account"
          width="648"
          height="756"
          className="h-auto w-full"
        />
      </div>

      <div className="space-y-4">
        <div className="rounded-xl bg-slate-50 p-4 text-slate-800">
          <div className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
            <Landmark aria-hidden="true" className="h-5 w-5 text-amber-700" />
            Bank transfer details
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
            <dt className="text-slate-500">Bank</dt>
            <dd className="font-semibold">IDFC First Bank</dd>
            <dt className="text-slate-500">Branch</dt>
            <dd className="font-semibold">Aurangabad</dd>
            <dt className="text-slate-500">Account no.</dt>
            <dd className="font-semibold tabular-nums">10196190819</dd>
            <dt className="text-slate-500">IFSC</dt>
            <dd className="font-semibold tracking-wide">IDFB0043491</dd>
          </dl>
        </div>

        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-center">
          <p className="text-sm font-semibold text-amber-900">Pay exactly</p>
          <p className="mt-1 text-3xl font-black tabular-nums text-amber-800" aria-live="polite">
            {isCalculating ? (
              <span className="flex items-center justify-center gap-2 text-lg">
                <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
                Calculating…
              </span>
            ) : amountError ? (
              <span className="text-base text-red-700">Check the coupon code</span>
            ) : amount === undefined ? (
              <span className="text-base text-slate-600">Select an option first</span>
            ) : (
              formatInr(amount)
            )}
          </p>
        </div>
      </div>
    </div>

    <div role="alert" className="flex gap-3 rounded-xl border-2 border-red-300 bg-red-50 p-4 text-red-900">
      <AlertTriangle aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-red-700" />
      <div>
        <p className="font-extrabold">Verify the amount before paying.</p>
        <p className="mt-1 text-sm font-semibold leading-6">
          A registration paid with an incorrect amount will not be considered,
          and the amount will not be refunded.
        </p>
      </div>
    </div>

    <div className="rounded-xl border border-slate-200 p-4">
      <label htmlFor={inputId} className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <Upload aria-hidden="true" className="h-5 w-5 text-amber-700" />
        Payment receipt screenshot <span className="text-red-600">*</span>
      </label>
      <p className="mt-1 text-xs leading-5 text-slate-600">
        Complete the payment first, then upload a clear image of the receipt here.
      </p>
      <input
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => onScreenshotChange(event.target.files?.[0] ?? null)}
        className="mt-3 block min-h-11 w-full cursor-pointer text-sm text-slate-700 file:mr-4 file:min-h-11 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#0b1f3a] file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-[#16345c]"
        aria-describedby={screenshotError ? `${inputId}-error` : undefined}
      />
      {screenshotError && (
        <p id={`${inputId}-error`} role="alert" className="mt-2 text-sm font-medium text-red-700">
          {screenshotError}
        </p>
      )}
    </div>

    <p className="flex flex-wrap items-center justify-center gap-2 text-center text-sm text-slate-700">
      <MessageCircle aria-hidden="true" className="h-5 w-5 text-green-700" />
      Payment help:
      <a
        href="https://wa.me/919340187056"
        target="_blank"
        rel="noreferrer"
        className="min-h-11 content-center font-bold text-green-800 underline underline-offset-4"
      >
        WhatsApp 9340187056
      </a>
    </p>
  </section>
);

export default PaymentInstructions;
