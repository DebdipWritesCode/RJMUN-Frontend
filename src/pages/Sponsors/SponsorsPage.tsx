import { useEffect, useState } from "react";
import api from "@/api/axios";
import type { Sponsor } from "@/utils/interfaces";
import { Loader2 } from "lucide-react";
import InfoCard from "@/components/cards/InfoCard";
import EmptyFallback from "@/components/EmptyFallback"; // <-- Import the fallback

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

  const groupSponsorsByType = (type: Sponsor["type"]) =>
    sponsors.filter((sponsor) => sponsor.type === type);

  const renderSponsorsSection = (title: string, type: Sponsor["type"]) => {
    const group = groupSponsorsByType(type);
    if (group.length === 0) return null;

    return (
      <div className="mt-16 w-full max-w-4xl">
        <InfoCard heading={title}>
          <div className="mt-15">
            {group.map((sponsor) => (
              <img
                key={sponsor._id}
                src={sponsor.imageUrl ?? "/default-logo.png"}
                alt={sponsor.name}
                className="w-full h-auto mt-6"
              />
            ))}
          </div>
        </InfoCard>
      </div>
    );
  };

  const hasSponsors = sponsors.length > 0;

  return (
    <div className="flex flex-col items-center min-h-[200px] px-4">
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <h1 className="font-bold sm:text-[100px] text-primary text-[40px] mb-10 text-center">
            SPONSORS
          </h1>

          {hasSponsors ? (
            <>
              {renderSponsorsSection("Our Partners", "partner")}
              {renderSponsorsSection("Our Collabs", "college")}
              {renderSponsorsSection("Endorsements", "endorsement")}
            </>
          ) : (
            <EmptyFallback />
          )}
        </div>
      )}
    </div>
  );
};

export default SponsorsPage;
