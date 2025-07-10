import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import api from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminLogin = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!code.trim()) {
      toast.error('Please enter a code.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/admin/login', { code });

      const { message } = res.data;
      localStorage.setItem('admin_token', message);

      toast.success('Verification successful!', {
        onClose: () => navigate('/admin/dashboard'),
      });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || 'Invalid code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="p-6 rounded-xl border shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-center">Admin Verification</h2>
        <Input
          type="text"
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button
          onClick={handleVerify}
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </Button>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default AdminLogin;
