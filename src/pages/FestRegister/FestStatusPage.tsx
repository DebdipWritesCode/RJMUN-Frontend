import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import type { FestDay } from "@/utils/interfaces";
import { Search, Loader2, Calendar, IndianRupee } from "lucide-react";

interface StatusResponse {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  paymentStatus: "pending" | "completed" | "failed";
  selectedDays: FestDay[];
}

const FestStatusPage = () => {
  const [registrationId, setRegistrationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatusResponse | null>(null);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = registrationId.trim().toUpperCase();
    if (!id) {
      toast.error("Enter a registration ID");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await api.get<StatusResponse>(
        `/day-registration/status/${encodeURIComponent(id)}`
      );
      setResult(res.data);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        toast.error("Registration not found");
      } else {
        toast.error(err?.response?.data?.message ?? "Failed to fetch status");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Check registration status
          </h1>
          <p className="text-gray-600 text-sm text-center mb-6">
            Enter your Fest registration ID (e.g. FEST-A1B2C3D4)
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <Input
              placeholder="FEST-XXXX"
              value={registrationId}
              onChange={(e) => setRegistrationId(e.target.value)}
              className="flex-1 rounded-xl font-mono uppercase"
            />
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl px-6"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </form>

          {result && (
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Name</span>
                <span className="font-medium">
                  {result.firstName} {result.lastName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{result.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium">{result.phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment</span>
                <span
                  className={`font-medium ${
                    result.paymentStatus === "completed"
                      ? "text-green-600"
                      : result.paymentStatus === "failed"
                        ? "text-red-600"
                        : "text-amber-600"
                  }`}
                >
                  {result.paymentStatus}
                </span>
              </div>
              {result.selectedDays?.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Selected days
                  </p>
                  <ul className="space-y-1">
                    {result.selectedDays.map((day) => (
                      <li
                        key={day._id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>
                          {day.name} ({day.date})
                        </span>
                        <span className="flex items-center gap-0.5 text-amber-700">
                          <IndianRupee className="w-3 h-3" />
                          {day.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => navigate("/fest/register")}
              className="rounded-xl"
            >
              New registration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestStatusPage;
