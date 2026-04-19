import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import CouponPromo from "@/components/CouponPromo";

const Landing = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"main" | "mun">("main");

  if (view === "main") {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-10">
        <div className="bg-[#0b1f3a]/70 backdrop-blur-md border border-[#f8c94c]/30 shadow-xl rounded-xl p-5 sm:p-8 w-full max-w-md flex flex-col items-center space-y-6 overflow-hidden">

          <h1 className="text-2xl font-bold text-[#f8c94c] text-center">
            Welcome to RJMUN Registration
          </h1>

          <p className="text-[#eef5ff] text-center text-sm">
            Choose an option below to continue.
          </p>

          <div className="w-full space-y-3">
            <CouponPromo
              variant="card"
              code="EARLYBIRD100"
              label="Early bird · MUN"
              description="Use this code on MUN registration to unlock your discount."
            />
            <CouponPromo
              variant="card"
              code="EARLYBIRDFEST100"
              label="Early bird · Fest"
              description="Use this code on Fest registration to unlock your discount."
            />
          </div>

          <Button
            className="w-full bg-[#f8c94c] hover:bg-[#e6b73f] text-[#0b1f3a] text-lg py-6 font-semibold"
            onClick={() => setView("mun")}
          >
            MUN Registration
          </Button>

          <Button
            className="w-full bg-[#f8c94c] hover:bg-[#e6b73f] text-[#0b1f3a] text-lg py-6 font-semibold"
            onClick={() => navigate("/fest/register")}
          >
            Fest Registration
          </Button>

        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-10">
      <div className="bg-[#0b1f3a]/70 backdrop-blur-md border border-[#f8c94c]/30 shadow-xl rounded-xl p-8 w-full max-w-md flex flex-col items-center space-y-6">

        <button
          type="button"
          onClick={() => setView("main")}
          className="flex items-center gap-1 text-[#f8c94c] text-sm font-medium hover:underline self-start mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-[#f8c94c] text-center">
          MUN Registration
        </h1>

        <p className="text-[#eef5ff] text-center text-sm">
          Choose an option below to continue.
        </p>

        <div className="w-full">
          <CouponPromo
            variant="card"
            code="EARLYBIRD100"
            label="Early bird · MUN"
            description="Apply this code on the next step to unlock your discount."
          />
        </div>

        <Button
          className="w-full bg-[#f8c94c] hover:bg-[#e6b73f] text-[#0b1f3a] text-lg py-6 font-semibold"
          onClick={() => navigate("/register/new")}
        >
          New Registration
        </Button>

        <Button
          className="w-full bg-[#f8c94c] hover:bg-[#e6b73f] text-[#0b1f3a] text-lg py-6 font-semibold"
          onClick={() => navigate("/register/check")}
        >
          Check Allotment
        </Button>

      </div>
    </div>
  );
};

export default Landing;