import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm flex flex-col items-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to RJMUN Registration</h1>
        <p className="text-gray-500 text-center text-sm mb-4">
          Choose an option below to continue.
        </p>

        <Button
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg py-6"
          onClick={() => navigate('/register/new')}
        >
          New Registration
        </Button>

        <Button
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-lg py-6"
          onClick={() => navigate('/register/check')}
        >
          Check Allotment
        </Button>
      </div>
    </div>
  );
};

export default Landing;
