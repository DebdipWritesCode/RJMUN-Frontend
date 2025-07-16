import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1C1F26] text-white px-4 text-center">
      <h1 className="text-[80px] sm:text-[120px] font-bold mb-4">404</h1>
      <h2 className="text-2xl sm:text-4xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-xl">
        The page you're looking for doesn’t exist or has been moved.
      </p>
      <Button variant="default" size="lg">
        <Link to="/" className="text-[#d1c19e] font-semibold">
          Go to Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
