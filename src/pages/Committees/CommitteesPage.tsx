import { useEffect, useState } from "react";
import api from "@/api/axios";
import type { Committee } from "@/utils/interfaces";
import { Loader2 } from "lucide-react";

const CommitteesPage = () => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const res = await api.get<Committee[]>("/committees");
        setCommittees(res.data);
      } catch (err) {
        console.error("Failed to fetch committees", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommittees();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      ) : (
        <div>{committees.length} committees loaded</div>
      )}
    </div>
  );
};

export default CommitteesPage;
