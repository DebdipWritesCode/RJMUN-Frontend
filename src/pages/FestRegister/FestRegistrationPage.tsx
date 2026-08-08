import { useEffect, useState } from "react";
import api from "@/api/axios";
import { toast } from "react-toastify";
import FestRegistrationForm from "@/components/fest/FestRegistrationForm";
import type { DayRegistrationDaysResponse } from "@/utils/interfaces";
import { Loader2 } from "lucide-react";
import {
  EARLY_BIRD_ENDS_AT,
  isEarlyBirdActive,
  REGISTRATION_PRICES,
} from "@/utils/registration-pricing";

const FestRegistrationPage = () => {
  const [data, setData] = useState<DayRegistrationDaysResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const res = await api.get<DayRegistrationDaysResponse>("/day-registration/days");
        setData(res.data);
      } catch {
        toast.error("Failed to load fest days. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDays();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
          <p className="text-gray-600">Loading fest days...</p>
        </div>
      </div>
    );
  }

  if (!data?.days?.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center text-gray-600">
          <p className="text-lg font-medium">No fest days available yet.</p>
          <p className="text-sm mt-2">Check back later for registration.</p>
        </div>
      </div>
    );
  }

  const earlyBirdFallback = isEarlyBirdActive();
  const pricing = data.pricing ?? {
    phase: earlyBirdFallback ? ("early_bird" as const) : ("regular" as const),
    earlyBirdEndsAt: EARLY_BIRD_ENDS_AT,
    perDayAmount: earlyBirdFallback
      ? REGISTRATION_PRICES.fest.earlyBirdPerDay
      : REGISTRATION_PRICES.fest.regularPerDay,
    regularPerDayAmount: REGISTRATION_PRICES.fest.regularPerDay,
  };
  const days = data.pricing
    ? data.days
    : data.days.map((day) => ({ ...day, price: pricing.perDayAmount }));

  return (
    <div className="container mx-auto px-4 py-8">
      <FestRegistrationForm
        days={days}
        offers={data.offers ?? {}}
        pricing={pricing}
      />
    </div>
  );
};

export default FestRegistrationPage;
