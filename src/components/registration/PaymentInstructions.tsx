import {
  AlertTriangle,
  Landmark,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { formatInr } from "@/utils/registration-pricing";

interface PaymentInstructionsProps {
  amount?: number;
  amountError?: string | null;
  isCalculating: boolean;
}

const PaymentInstructions = ({
  amount,
  amountError,
  isCalculating,
}: PaymentInstructionsProps) => (
  <section
    aria-labelledby="payment-instructions-title"
    className="space-y-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
  >
    <div className="text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
        Payment details
      </p>
      <h3 id="payment-instructions-title" className="mt-1 text-xl font-bold text-slate-900">
        Scan the official QR to complete payment
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

    <div className="flex flex-col items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-center text-green-950 sm:flex-row sm:text-left">
      <MessageCircle aria-hidden="true" className="h-6 w-6 shrink-0 text-green-700" />
      <p className="flex-1 text-sm font-medium leading-6">
        After payment, send your payment receipt on WhatsApp with the participant's
        name and email address.
      </p>
      <a
        href="https://wa.me/919340187056?text=Hello%2C%20I%20have%20completed%20my%20RJMUN%20payment%20and%20am%20sharing%20my%20payment%20receipt."
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-green-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
      >
        Send receipt on WhatsApp
      </a>
    </div>
  </section>
);

export default PaymentInstructions;
