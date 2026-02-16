import { useState } from 'react';
import api from '@/api/axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

interface AllotmentStatus {
  fullName: string;
  status: 'not_allotted' | 'allotted';
  allottedCommittee?: string;
  allottedPortfolio?: string;
}

const CheckAllot = () => {
  const [registrationId, setRegistrationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [allotment, setAllotment] = useState<AllotmentStatus | null>(null);

  const handleSubmit = async () => {
    if (!registrationId.trim()) {
      toast.error('Please enter a Registration ID');
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/registration/status/${registrationId.trim()}`);
      setAllotment(res.data);
    } catch (err) {
      toast.error('Invalid Registration ID or failed to fetch status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-card shadow-lg rounded-xl p-6 max-w-md w-full text-center space-y-6 text-card-foreground">
        <h1 className="text-2xl font-bold text-primary">Check Allotment Status</h1>

        {!allotment ? (
          <>
            <Input
              placeholder="Enter your Registration ID"
              value={registrationId}
              onChange={(e) => setRegistrationId(e.target.value)}
              disabled={loading}
            />
            <Button
              onClick={handleSubmit}
              className="w-full bg-primary text-warm-tan font-semibold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Check Status'}
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-foreground">{allotment.fullName}</h2>
            {allotment.status === 'not_allotted' ? (
              <p className="text-muted-foreground">
                Portfolios have <span className="font-semibold text-destructive">not</span> been allotted to you yet. Please check back later.
              </p>
            ) : (
              <>
                <p className="text-foreground">
                  You’ve been allotted to:
                </p>
                <p className="text-lg font-medium text-chart-3">
                  {allotment.allottedCommittee}
                </p>
                <p className="text-sm font-semibold text-chart-4">
                  Portfolio: {allotment.allottedPortfolio}
                </p>
              </>
            )}
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-warm-tan" onClick={() => setAllotment(null)}>
              Check Another ID
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckAllot;
