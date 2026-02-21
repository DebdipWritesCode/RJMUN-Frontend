import { useEffect, useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import type { FestDayOffers } from "@/utils/interfaces";
import { Percent, Plus, Trash2, Save } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type OfferRow = { days: string; percent: string };

const FestOffers = () => {
  const [rows, setRows] = useState<OfferRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchOffers = async () => {
    try {
      const res = await api.get<FestDayOffers>("/fest-days/offers");
      const data = res.data ?? {};
      setRows(
        Object.entries(data).map(([days, percent]) => ({
          days,
          percent: String(percent),
        }))
      );
    } catch (err) {
      toast.error("Failed to fetch offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const addRow = () => {
    setRows((r) => [...r, { days: "", percent: "" }]);
  };

  const removeRow = (index: number) => {
    setRows((r) => r.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: "days" | "percent", value: string) => {
    setRows((r) =>
      r.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const buildDiscounts = (): Record<string, number> => {
    const out: Record<string, number> = {};
    for (const row of rows) {
      const d = row.days.trim();
      const p = parseInt(row.percent.trim(), 10);
      if (d && !isNaN(p) && p >= 0 && p <= 100) {
        out[d] = p;
      }
    }
    return out;
  };

  const handleSave = async () => {
    const discounts = buildDiscounts();
    setSaving(true);
    try {
      await api.put("/fest-days/offers", { discounts }, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Offers saved");
      setRows(
        Object.entries(discounts).map(([days, percent]) => ({
          days,
          percent: String(percent),
        }))
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save offers");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-gray-600">Loading offers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
          <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Percent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Multi-day Offers
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Set percentage discount by number of days (e.g. 2 days → 10% off)
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={addRow}
                  className="rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add row
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg rounded-xl px-6 py-3 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save offers"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number of days</TableHead>
                <TableHead>Percentage off (%)</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                    No rows. Click &quot;Add row&quot; to add an offer.
                  </TableCell>
                </TableRow>
              )}
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      placeholder="e.g. 2"
                      value={row.days}
                      onChange={(e) => updateRow(index, "days", e.target.value)}
                      className="max-w-[120px] rounded-lg"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="e.g. 10"
                      value={row.percent}
                      onChange={(e) => updateRow(index, "percent", e.target.value)}
                      className="max-w-[120px] rounded-lg"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default FestOffers;
