import { useEffect, useState } from "react";
import api from "@/api/axios";
import type { TeamMember } from "@/utils/interfaces";
import { Loader2 } from "lucide-react";
import ProfileCard from "@/components/cards/ProfileCard";
import EmptyFallback from "@/components/EmptyFallback";

const TeamsPage = () => {
  const [teams, setTeams] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get<TeamMember[]>("/team-members");
        setTeams(res.data);
      } catch (err) {
        console.error("Failed to fetch team members", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const firstGroup = teams.filter((member) => member.type === "super");
  const secondGroup = teams.filter((member) => member.type === "head");
  const thirdGroup = teams.filter((member) => member.type === "manager");

  const renderTeamGroup = (group: TeamMember[]) => (
    <div className="flex md:flex-row flex-col md:gap-20 flex-wrap gap-20 justify-center">
      {group.map((member) => (
        <ProfileCard
          key={member._id}
          heading={member.name}
          subheading={member.position}
          imageSrc={member.imageUrl ?? "/default-profile.png"}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center min-h-[200px] px-4">
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : teams.length === 0 ? (
        <EmptyFallback />
      ) : (
        <div className="flex flex-col items-center w-full">
          <h1 className="font-bold sm:text-[100px] text-[40px] sm:mb-20 mb-10 text-center">
            MEET THE TEAM
          </h1>

          {renderTeamGroup(firstGroup)}

          {secondGroup.length > 0 && (
            <>
              <h1 className="font-bold mt-10 sm:text-[80px] text-[32px] sm:my-16 my-10 text-center">
                Heads
              </h1>
              {renderTeamGroup(secondGroup)}
            </>
          )}

          {thirdGroup.length > 0 && (
            <>
              <h1 className="font-bold mt-10 sm:text-[80px] text-[32px] sm:my-16 my-10 text-center">
                Managers
              </h1>
              {renderTeamGroup(thirdGroup)}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
