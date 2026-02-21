import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'main' | 'mun'>('main');

  // Main view: two tabs – MUN Registration | Fest Registration
  if (view === 'main') {
    return (
      <div className="flex items-center justify-center">
        <div className="bg-warm-tan shadow-xl rounded-xl p-8 w-full max-w-sm flex flex-col items-center space-y-6">
          <h1 className="text-2xl font-bold text-primary mb-2 text-center">
            Welcome to RJMUN Registration
          </h1>
          <p className="text-primary text-center text-sm mb-4">
            Choose an option below to continue.
          </p>

          <Button
            className="w-full bg-primary text-warm-tan text-lg py-6"
            onClick={() => setView('mun')}
          >
            MUN Registration
          </Button>

          <Button
            className="w-full bg-primary text-warm-tan text-lg py-6"
            onClick={() => navigate('/fest/register')}
          >
            Fest Registration
          </Button>
        </div>
      </div>
    );
  }

  // MUN view: same card with New Registration and Check Allotment
  return (
    <div className="flex items-center justify-center">
      <div className="bg-warm-tan shadow-xl rounded-xl p-8 w-full max-w-sm flex flex-col items-center space-y-6">
        <button
          type="button"
          onClick={() => setView('main')}
          className="flex items-center gap-1 text-primary text-sm font-medium hover:underline self-start mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-primary mb-2 text-center">
          MUN Registration
        </h1>
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
