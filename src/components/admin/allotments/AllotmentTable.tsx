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

      const key = `${a.allottedCommittee}::${a.allottedPortfolio}`;
      if (seen.has(key)) {
        toast.error("Duplicate allotment found: " + key);
        return;
      }
      seen.add(key);
    }

    try {
      const res = await api.patch("/registration/allot", { allotments });
      toast.success(`Updated ${res.data.updated} allotments`);
      if (res.data.failed.length > 0) {
        toast.warn(`Failed for: ${res.data.failed.join(", ")}`);
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleSendAllotmentEmails = async () => {
    // TO DO: Implement email sending logic
  };

  const getAvailablePortfolios = (committeeName: string) => {
    const committee = committees.find((c) => c.name === committeeName);
    return committee?.portfolios ?? [];
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Institution</TableHead>
            <TableHead>Preferences</TableHead>
            <TableHead>Allotted Committee</TableHead>
            <TableHead>Allotted Portfolio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrants.map((reg, _) => {
            const allotment = allotments.find(
              (a) => a.registrationId === reg.registrationId
            );

            return (
              <TableRow key={reg.registrationId}>
                <TableCell className="font-medium">{reg.fullName}</TableCell>
                <TableCell>{reg.institution}</TableCell>
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
                          {committee.name}
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
                          {portfolio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={handleSendAllotmentEmails} className="border-blue-500 text-blue-500">
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
