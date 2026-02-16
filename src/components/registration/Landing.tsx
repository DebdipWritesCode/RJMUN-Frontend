import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center">
      <div className="bg-warm-tan shadow-xl rounded-xl p-8 w-full max-w-sm flex flex-col items-center space-y-6">
        <h1 className="text-2xl font-bold text-primary mb-2 text-center">Welcome to RJMUN Registration</h1>
        <p className="text-primary text-center text-sm mb-4">
          Choose an option below to continue.
        </p>

        <Button
          className="w-full bg-primary text-warm-tan text-lg py-6"
          onClick={() => navigate('/register/new')}
        >
          New Registration
        </Button>

        <Button
          className="w-full bg-primary text-warm-tan text-lg py-6"
          onClick={() => navigate('/register/check')}
        >
          Check Allotment
        </Button>
      </div>
    </div>
  );
};

export default Landing;
