import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const FestSuccessPage = () => {
  const location = useLocation();
  const state = location.state as
    | { registrationId?: string; email?: string }
    | undefined;
  const registrationId = state?.registrationId;
  const email = state?.email;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Registration successful
        </h1>
        <p className="text-gray-600 mb-6 break-words">
          Your fest day registration is complete. A confirmation email
          {email ? " will be sent to " : ""}
          {email && <span className="font-medium break-all">{email}</span>}.
        </p>
        {registrationId && (
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg py-3 px-4 mb-6 font-mono">
            Registration ID: <strong>{registrationId}</strong>
          </p>
        )}
        <div className="flex justify-center">
          <Button asChild className="rounded-xl">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FestSuccessPage;
