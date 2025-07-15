import { useEffect, useState } from "react";
import api from "@/api/axios";
import type { Sponsor } from "@/utils/interfaces";
import { Loader2 } from "lucide-react";

const SponsorsPage = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await api.get<Sponsor[]>("/sponsors");
        setSponsors(res.data);
      } catch (err) {
        console.error("Failed to fetch sponsors", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      ) : (
        <div>{sponsors.length} sponsors loaded</div>
      )}
    </div>
  );
};

export default SponsorsPage;
