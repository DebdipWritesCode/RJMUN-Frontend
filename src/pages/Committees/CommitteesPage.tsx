import { useEffect, useState } from "react";
import api from "@/api/axios";
import type { Committee } from "@/utils/interfaces";
import { Loader2 } from "lucide-react";
import InfoCard from "@/components/cards/InfoCard";
import EmptyFallback from "@/components/EmptyFallback";

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
      ) : committees.length === 0 ? (
        <EmptyFallback />
      ) : (
        <div>
          <h1 className="font-bold sm:text-[100px] text-[40px] sm:mb-20 mb-15 text-center">
            COMMITTEES
          </h1>
          <div className="flex flex-col gap-15">
            {committees.map((committee) => (
              <InfoCard key={committee._id} heading={committee.name}>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {committee.image && (
                    <img
                      src={`data:${committee.imageMimeType};base64,${committee.image}`}
                      alt={`${committee.name} committee`}
                      className="w-full max-w-xs"
                    />
                  )}

                  <div className="text-left space-y-4 flex flex-col justify-between h-full">
                    <p className="sm:text-2xl text-lg font-bold text-justify bg-[#c0b8a2] text-primary-background">
                      {committee.agenda}
                    </p>

                    {committee.backgroundGuideURL && (
                      <a
                        href={committee.backgroundGuideURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 mt-2 text-white bg-[#1C1F26] hover:bg-black rounded-2xl transition"
                      >
                        View Background Guide
                      </a>
                    )}
                  </div>
                </div>
              </InfoCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitteesPage;
