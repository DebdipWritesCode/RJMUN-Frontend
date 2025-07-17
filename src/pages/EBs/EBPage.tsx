import { useEffect, useState } from "react";
import api from "@/api/axios";
import type { EB } from "@/utils/interfaces";
import { Loader2 } from "lucide-react";
import ProfileCard from "@/components/cards/ProfileCard";
import EmptyFallback from "@/components/EmptyFallback"; // Import fallback component

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
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      {/* Always show the image */}
      <img src="./images/EB2.png" alt="EB" className="sm:h-[600px] h-[400px]" />

      {/* Heading */}
      <h1 className="font-bold sm:text-[100px] text-[40px] sm:mb-20 mb-15 text-center">
        EXECUTIVE BOARD
      </h1>

      {/* Content */}
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      ) : ebMembers.length === 0 ? (
        <EmptyFallback />
      ) : (
        <div className="flex md:flex-row flex-col md:gap-20 flex-wrap gap-30">
          {ebMembers.map((member) => (
            <ProfileCard
              key={member._id}
              heading={member.name}
              subheading={`${member.committee} - ${member.position}`}
              imageSrc={`data:${member.imageMimeType};base64,${member.image}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EBPage;
