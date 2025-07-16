import { useEffect, useState } from "react";
import api from "@/api/axios";
import type { TeamMember } from "@/utils/interfaces";
import { Loader2 } from "lucide-react";
import ProfileCard from "@/components/cards/ProfileCard";

const TeamsPage = () => {
  const [teams, setTeams] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const FIRST_SPLIT_INDEX = 2;
  const SECOND_SPLIT_INDEX = 4;

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

  const canSplit =
    teams.length > FIRST_SPLIT_INDEX && teams.length > SECOND_SPLIT_INDEX;

  const firstGroup = canSplit ? teams.slice(0, FIRST_SPLIT_INDEX) : teams;
  const secondGroup = canSplit ? teams.slice(FIRST_SPLIT_INDEX, SECOND_SPLIT_INDEX) : [];
  const thirdGroup = canSplit ? teams.slice(SECOND_SPLIT_INDEX) : [];

  const renderTeamGroup = (group: TeamMember[]) => (
    <div className="flex md:flex-row flex-col md:gap-20 flex-wrap gap-20 justify-center">
      {group.map((member) => (
        <ProfileCard
          key={member._id}
          heading={member.name}
          subheading={member.position}
          imageSrc={
            member.image && member.imageMimeType
              ? `data:${member.imageMimeType};base64,${member.image}`
              : "/default-profile.png" // fallback image
          }
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
