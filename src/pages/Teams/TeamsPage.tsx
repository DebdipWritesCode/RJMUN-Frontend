import { useEffect, useState } from "react";
import api from "@/api/axios";
import type { TeamMember } from "@/utils/interfaces";
import { Loader2 } from "lucide-react";

const TeamsPage = () => {
  const [teams, setTeams] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get<TeamMember[]>("/team-members");
        setTeams(res.data);
      } catch (err) {
        console.error("Failed to fetch teams", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      ) : (
        <div>{teams.length} teams loaded</div>
      )}
    </div>
  );
};

export default TeamsPage;
