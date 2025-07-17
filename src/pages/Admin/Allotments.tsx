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

  // 📊 Calculate the number of allotments per committee
  const committeeAllotmentCount = committees.map((committee) => {
    const count = allotments.filter(
      (a) => a.allottedCommittee === committee.name
    ).length;
    return { name: committee.name, count };
  });

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Allotment Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          {committeeAllotmentCount.map((item, index) => {
            const colors = [
              "bg-blue-100 text-blue-800",
              "bg-green-100 text-green-800",
              "bg-yellow-100 text-yellow-800",
              "bg-purple-100 text-purple-800",
              "bg-pink-100 text-pink-800",
              "bg-red-100 text-red-800",
              "bg-orange-100 text-orange-800",
              "bg-gray-100 text-gray-800",
              "bg-teal-100 text-teal-800",
              "bg-lime-100 text-lime-800",
            ];
            const color = colors[index % colors.length];

            return (
              <div
                key={item.name}
                className={`px-3 py-2 rounded-md ${color} text-center`}>
                <span className="font-medium">{item.name}:</span>{" "}
                <span className="font-bold text-black">{item.count}</span>
              </div>
            );
          })}
        </div>
      </div>

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
