import { useState } from "react";
import api from "@/api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface AllotmentStatus {
  fullName: string;
  status: "not_allotted" | "allotted";
  allottedCommittee?: string;
  allottedPortfolio?: string;
}

const CheckAllot = () => {
  const [registrationId, setRegistrationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [allotment, setAllotment] = useState<AllotmentStatus | null>(null);

  const handleSubmit = async () => {
    if (!registrationId.trim()) {
      toast.error("Please enter a Registration ID");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(
        `/registration/status/${registrationId.trim()}`
      );

      setAllotment(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        toast.error("No registration found with this ID");
      } else {
        toast.error("Failed to fetch allotment status");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="bg-[#0b1f3a]/70 backdrop-blur-md border border-[#f8c94c]/30 shadow-xl rounded-xl p-6 max-w-md w-full text-center space-y-6">

        <h1 className="text-2xl font-bold text-[#f8c94c]">
          Check Allotment Status
        </h1>

        {!allotment ? (
          <>
            <Input
              placeholder="Enter your Registration ID"
              value={registrationId}
              onChange={(e) => setRegistrationId(e.target.value)}
              disabled={loading}
              className="bg-[#0b1f3a]/60 border-[#f8c94c]/30 text-[#eef5ff]"
            />

            <Button
              onClick={handleSubmit}
              className="w-full bg-[#f8c94c] hover:bg-[#e6b73f] text-[#0b1f3a] font-semibold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Checking..." : "Check Status"}
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-[#f8c94c]">
              {allotment.fullName}
            </h2>

            {allotment.status === "not_allotted" ? (
              <p className="text-[#eef5ff]">
                Portfolios have{" "}
                <span className="font-semibold text-red-400">
                  not
                </span>{" "}
                been allotted yet. Please check back later.
              </p>
            ) : (
              <>
                <p className="text-[#eef5ff]">
                  You’ve been allotted to:
                </p>

                <p className="text-lg font-medium text-[#f8c94c]">
                  {allotment.allottedCommittee}
                </p>

                <p className="text-sm font-semibold text-[#eef5ff]">
                  Portfolio: {allotment.allottedPortfolio}
                </p>
              </>
            )}

            <Button
              variant="outline"
              className="border-[#f8c94c] text-[#f8c94c] hover:bg-[#f8c94c] hover:text-[#0b1f3a]"
              onClick={() => setAllotment(null)}
            >
              Check Another ID
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckAllot;