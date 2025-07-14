import api from "@/api/axios";
import RegistrationForm from "@/components/registration/RegistrationForm"
import type { RegistrationFormProps } from "@/components/registration/RegistrationForm"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface BackendResponse {
  _id: string;
  name: string;
  portfolios: string[];
}

const NewRegistration = () => {
  const [portfolios, setPortfolios] = useState<RegistrationFormProps["portfolios"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await api.get("/committees/get-portfolios");
        const data: BackendResponse[] = response.data;

        const transformed = data.map(item => ({
          id: item._id,
          committee: item.name,
          portfolios: item.portfolios
        }));

        setPortfolios(transformed);
      } catch (err: any) {
        toast.error("Failed to fetch portfolios. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  if (loading) {
    return <div className="text-center">Loading portfolios...</div>;
  }

  return (
    <div>
      <RegistrationForm portfolios={portfolios} />
    </div>
  )
}

export default NewRegistration