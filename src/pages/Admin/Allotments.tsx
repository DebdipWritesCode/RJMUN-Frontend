import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "@/api/axios";
import AllotmentTable from "@/components/admin/allotments/AllotmentTable";

export interface RegistrantRow {
  registrationId: string;
  fullName: string;
  institution: string;
  committeePreference1: string;
  committeePreference2: string;
  portfolioPreference1ForCommitteePreference1: string;
  portfolioPreference2ForCommitteePreference1: string;
  portfolioPreference1ForCommitteePreference2: string;
  portfolioPreference2ForCommitteePreference2: string;
  allotmentStatus: "allotted" | "not allotted";
  allottedCommittee?: string;
  allottedPortfolio?: string;
}

export interface Committee {
  _id: string;
  name: string;
  portfolios: string[];
}

export interface UpdateAllotments {
  registrationId: string;
  allottedCommittee: string;
  allottedPortfolio: string;
}

const Allotments = () => {
  const [registrants, setRegistrants] = useState<RegistrantRow[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [allotments, setAllotments] = useState<UpdateAllotments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [registrantsRes, committeesRes] = await Promise.all([
        api.get("/registration/registrants"),
        api.get("/committees/get-portfolios"),
      ]);

      setRegistrants(registrantsRes.data);
      setCommittees(committeesRes.data);
    } catch (err) {
      setError("Failed to fetch data, please try again later.");
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (registrants.length) {
      const initialAllotments = registrants.map((reg) => ({
        registrationId: reg.registrationId,
        allottedCommittee:
          reg.allotmentStatus === "allotted" ? reg.allottedCommittee || "" : "",
        allottedPortfolio:
          reg.allotmentStatus === "allotted" ? reg.allottedPortfolio || "" : "",
      }));

      setAllotments(initialAllotments);
    }
  }, [registrants]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="">
      <AllotmentTable
        registrants={registrants}
        committees={committees}
        allotments={allotments}
        setAllotments={setAllotments}
      />
    </div>
  );
};

export default Allotments;
