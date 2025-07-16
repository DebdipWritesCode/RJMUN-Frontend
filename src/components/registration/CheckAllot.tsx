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
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold text-[#1c2d27]">Check Allotment Status</h1>

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
              className="w-full bg-[#1c2d27] text-[#9e9776] font-semibold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Check Status'}
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-700">{allotment.fullName}</h2>
            {allotment.status === 'not_allotted' ? (
              <p className="text-gray-600">
                Portfolios have <span className="font-semibold text-red-600">not</span> been allotted to you yet. Please check back later.
              </p>
            ) : (
              <>
                <p className="text-gray-700">
                  You’ve been allotted to:
                </p>
                <p className="text-lg font-medium text-blue-600">
                  {allotment.allottedCommittee}
                </p>
                <p className="text-sm font-semibold text-purple-600">
                  Portfolio: {allotment.allottedPortfolio}
                </p>
              </>
            )}
            <Button variant="outline" className='border-[#1c2d27] text-[#1c2d27] hover:bg-[#1c2d27] hover:text-[#9e9776]' onClick={() => setAllotment(null)}>
              Check Another ID
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckAllot;
