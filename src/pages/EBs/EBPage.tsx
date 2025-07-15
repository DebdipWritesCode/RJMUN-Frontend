import { useEffect, useState } from "react";
import api from "@/api/axios";
import type { EB } from "@/utils/interfaces";
import { Loader2 } from "lucide-react";

const EBPage = () => {
  const [ebMembers, setEbMembers] = useState<EB[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEBs = async () => {
      try {
        const res = await api.get<EB[]>("/eb");
        setEbMembers(res.data);
      } catch (err) {
        console.error("Failed to fetch EB data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEBs();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      ) : (
        <div>{ebMembers.length} EB members loaded</div>
      )}
    </div>
  );
};

export default EBPage;
