import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  RegistrantRow,
  Committee,
  UpdateAllotments,
} from "@/pages/Admin/Allotments";
import { toast } from "react-toastify";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Loader2, Search, X } from "lucide-react";

interface AllotmentTableProps {
  registrants: RegistrantRow[];
  committees: Committee[];
  allotments: UpdateAllotments[];
  setAllotments: React.Dispatch<React.SetStateAction<UpdateAllotments[]>>;
}

const AllotmentTable: React.FC<AllotmentTableProps> = ({
  registrants,
  committees,
  allotments,
  setAllotments,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const allotmentsByRegistrationId = useMemo(
    () =>
      new Map(
        allotments.map((allotment) => [allotment.registrationId, allotment])
      ),
    [allotments]
  );

  const filteredRegistrants = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

    if (!normalizedQuery) {
      return registrants;
    }

    return registrants.filter((registrant) => {
      const allotment = allotmentsByRegistrationId.get(
        registrant.registrationId
      );
      const searchableValues = [
        registrant.registrationId,
        registrant.fullName,
        registrant.institution,
        registrant.committeePreference1,
        registrant.committeePreference2,
        registrant.portfolioPreference1ForCommitteePreference1,
        registrant.portfolioPreference2ForCommitteePreference1,
        registrant.portfolioPreference1ForCommitteePreference2,
        registrant.portfolioPreference2ForCommitteePreference2,
        allotment?.allottedCommittee,
        allotment?.allottedPortfolio,
      ];

      return searchableValues.some((value) =>
        value?.toLocaleLowerCase().includes(normalizedQuery)
      );
    });
  }, [allotmentsByRegistrationId, registrants, searchQuery]);

  const handleCommitteeChange = (registrationId: string, value: string) => {
    setAllotments((prev: UpdateAllotments[]) =>
      prev.map((a: UpdateAllotments) =>
        a.registrationId === registrationId
          ? { ...a, allottedCommittee: value, allottedPortfolio: "" }
          : a
      )
    );
  };

  const handlePortfolioChange = (registrationId: string, value: string) => {
    setAllotments((prev: UpdateAllotments[]) =>
      prev.map((a: UpdateAllotments) =>
        a.registrationId === registrationId
          ? { ...a, allottedPortfolio: value }
          : a
      )
    );
  };

  const handleUpdateAllotments = async () => {
    const seen = new Set<string>();

    for (const a of allotments) {
      if (!a.allottedCommittee || !a.allottedPortfolio) continue;

      const isPress =
        a.allottedCommittee.toLowerCase().includes("international press") ||
        a.allottedCommittee.toLowerCase().includes("ip");

      if (!isPress) {
        const key = `${a.allottedCommittee}::${a.allottedPortfolio}`;
        if (seen.has(key)) {
          toast.error("Duplicate allotment found: " + key);
          return;
        }
        seen.add(key);
      }
    }

    try {
      setLoading(true);
      const res = await api.patch("/registration/allot", { allotments });
      toast.success(`Updated ${res.data.updated} allotments`);
      if (res.data.failed.length > 0) {
        toast.warn(`Failed for: ${res.data.failed.join(", ")}`);
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendAllotmentEmails = async () => {
    try {
      setLoading(true);
      toast.info("Sending allotment emails...");
      const res = await api.post("/registration/send-allotment-emails");
      console.log(res.data);
      toast.success(`Sent ${res.data.sent} emails`);
      if (res.data.failed.length) {
        toast.error(`Failed for: ${res.data.failed.join(", ")}`);
      }
    } catch {
      toast.error("Failed to send allotment emails");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSheets = async () => {
    try {
      setLoading(true);
      toast.info("Updating Google Sheets with latest allotments...");
      const res = await api.post("/registration/update-allotments-sheets");
      console.log(res.data);
      toast.success(res.data.message || "Sheets updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update allotment sheets");
    } finally {
      setLoading(false);
    }
  };

  const getAvailablePortfolios = (committeeName: string) => {
    const committee = committees.find((c) => c.name === committeeName);
    return committee?.portfolios ?? [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <label
          htmlFor="allotment-search"
          className="mb-2 block text-sm font-medium text-gray-700">
          Search registrants
        </label>
        <div className="relative max-w-xl">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          />
          <Input
            id="allotment-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name, registration ID, institution, committee, or portfolio"
            autoComplete="off"
            className="h-11 pl-10 pr-12"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear registrant search"
              className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-600" aria-live="polite">
          Showing {filteredRegistrants.length} of {registrants.length} registrants
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Institution</TableHead>
            <TableHead>MUN Count</TableHead>
            <TableHead>Preferences</TableHead>
            <TableHead>Allotted Committee</TableHead>
            <TableHead>Allotted Portfolio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRegistrants.map((reg) => {
            const allotment = allotmentsByRegistrationId.get(
              reg.registrationId
            );

            return (
              <TableRow key={reg.registrationId}>
                <TableCell className="font-medium">{reg.fullName}</TableCell>
                <TableCell>{reg.institution}</TableCell>
                <TableCell>{reg.numberOfMUNsParticipated}</TableCell>
                <TableCell>
                  <div className="text-xs space-y-1">
                    <div>Committee 1: {reg.committeePreference1}</div>
                    <div>
                      → {reg.portfolioPreference1ForCommitteePreference1}
                    </div>
                    <div>
                      → {reg.portfolioPreference2ForCommitteePreference1}
                    </div>
                    <div>Committee 2: {reg.committeePreference2}</div>
                    <div>
                      → {reg.portfolioPreference1ForCommitteePreference2}
                    </div>
                    <div>
                      → {reg.portfolioPreference2ForCommitteePreference2}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={allotment?.allottedCommittee || ""}
                    onValueChange={(value) =>
                      handleCommitteeChange(reg.registrationId, value)
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select committee" />
                    </SelectTrigger>
                    <SelectContent>
                      {committees.map((committee) => (
                        <SelectItem key={committee._id} value={committee.name}>
                          <p className="max-w-[140px]">{committee.name}</p>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={allotment?.allottedPortfolio || ""}
                    onValueChange={(value) =>
                      handlePortfolioChange(reg.registrationId, value)
                    }
                    disabled={!allotment?.allottedCommittee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select portfolio" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailablePortfolios(
                        allotment?.allottedCommittee || ""
                      ).map((portfolio) => (
                        <SelectItem key={portfolio} value={portfolio}>
                          <p className="max-w-[150px]">{portfolio}</p>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            );
          })}
          {filteredRegistrants.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center">
                <p className="font-medium text-gray-800">
                  No registrants found
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Try a different name, registration ID, institution,
                  committee, or portfolio.
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex sm:flex-row flex-col justify-end gap-4 mt-6">
        <Button
          onClick={handleUpdateSheets}
          className="bg-green-600 hover:bg-green-700 text-white">
          Update Sheets
        </Button>

        <Button
          variant="outline"
          onClick={handleSendAllotmentEmails}
          className="border-blue-500 text-blue-500">
          Send Allotment Emails
        </Button>

        <Button
          onClick={handleUpdateAllotments}
          className="bg-blue-600 hover:bg-blue-700 text-white">
          Update Allotments
        </Button>
      </div>
    </div>
  );
};

export default AllotmentTable;
