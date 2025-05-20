import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import GuideBar from './GuideBar';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Email input, 2 = Verification code input
  
  const { requestVerificationCode, verifyCodeAndLogin } = useAuth();
  const navigate = useNavigate();
  
  const handleRequestCode = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await requestVerificationCode(email);
      
      if (result.success) {
        toast.success('Verification code sent to your email');
        setStep(2); // Move to verification code step
      } else {
        toast.error(result.message || 'Failed to send verification code');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await verifyCodeAndLogin(email, verificationCode);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate('/admin');
      } else {
        toast.error(result.message || 'Invalid verification code');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-base-100">
      <GuideBar />
      <div className="container mx-auto p-8">
        <div className="max-w-md mx-auto card bg-base-200 shadow-xl">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-center mb-6">Admin Login</h1>
            
            {step === 1 ? (
              // Step 1: Email Input
              <form onSubmit={handleRequestCode}>
                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input 
                    type="email" 
                    placeholder="Enter your admin email" 
                    className="input input-bordered" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-control mt-6">
                  <button 
                    type="submit" 
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </button>
                </div>
              </form>
            ) : (
              // Step 2: Verification Code Input
              <form onSubmit={handleVerifyCode}>
                <div className="text-center mb-4">
                  <p>A verification code has been sent to</p>
                  <p className="font-semibold">{email}</p>
                </div>
                
                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text">Verification Code</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit code" 
                    className="input input-bordered" 
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
                
                <div className="form-control mt-6">
                  <button 
                    type="submit" 
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Login'}
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="btn btn-link"
                  >
                    Back to Email
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 