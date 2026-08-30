import { CalendarX2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FestRegistrationPage = () => (
  <>
    <section
      aria-hidden="true"
      className="relative min-h-[65vh] overflow-hidden border-y border-slate-200 bg-[#f7f7f8]"
    >
      <div className="absolute inset-0 grid grid-cols-4 opacity-70 sm:grid-cols-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index} className="border-r border-slate-200" />
        ))}
      </div>
      <div className="absolute inset-x-0 top-1/3 border-t border-slate-200" />
      <div className="absolute inset-x-0 top-2/3 border-t border-slate-200" />
    </section>

    <Dialog open>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        className="max-h-[calc(100dvh-2rem)] gap-0 overflow-x-hidden overflow-y-auto rounded-none border-0 bg-white p-0 shadow-[0_24px_80px_rgba(15,23,42,0.28)] motion-reduce:animate-none sm:max-w-xl"
      >
        <div className="h-2 bg-[#002fa7]" />
        <div className="p-6 sm:p-8">
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-12 w-12 items-center justify-center bg-[#002fa7] text-white">
              <CalendarX2 aria-hidden="true" className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#002fa7]">
              Registration update
            </p>
            <DialogTitle className="text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Fest registrations are closed
            </DialogTitle>
            <DialogDescription className="max-w-md pt-2 text-base leading-7 text-slate-600">
              Registration for DESTINIQUE is now closed. MUN registrations remain
              open and are not affected by this closure.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 border-y border-slate-200 py-4">
            <p className="flex items-start gap-3 text-sm font-semibold leading-6 text-slate-800">
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-[#002fa7]"
              />
              Already registered for the Fest? You can still check your registration
              status.
            </p>
          </div>

          <DialogFooter className="flex-col gap-3 sm:flex-row sm:justify-start">
            <Button
              asChild
              size="lg"
              className="min-h-11 rounded-none bg-[#002fa7] px-5 font-bold text-white hover:bg-[#002680] focus-visible:ring-[#002fa7]"
            >
              <Link to="/register/new">Register for MUN</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-h-11 rounded-none border-slate-400 bg-white px-5 font-bold text-slate-900 hover:bg-slate-100"
            >
              <Link to="/fest/status">Check Fest status</Link>
            </Button>
          </DialogFooter>

          <Link
            to="/fest-days"
            className="mt-5 inline-flex min-h-11 items-center text-sm font-bold text-[#002fa7] underline decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002fa7] focus-visible:ring-offset-2"
          >
            View the Fest schedule
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  </>
);

export default FestRegistrationPage;
