import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const normalStudents = [
      'ahmed.benali@usthb.dz',
      'fatima.zohra@univ-oran.dz',
      'omar.mebarki@usthb.dz',
      'nadia.brahimi@univ-oran.dz'
    ];

    setTimeout(() => {
      const lowerEmail = email.toLowerCase().trim();
      const isDemoAdmin = lowerEmail === 'admin@campuscovoiturage.dz';
      const isAnyAdmin = lowerEmail.includes('admin');
      const isCorrectAdminPassword = password === 'admin123' || password === 'Admin123!';

      if ((isDemoAdmin && isCorrectAdminPassword) || (isAnyAdmin && password.length >= 4)) {
        const mockToken = 'mock_jwt_admin_token_xyz123';
        const mockUser = {
          fullName: isDemoAdmin ? 'Anas Rahmani' : 'System Administrator',
          email: lowerEmail,
          role: 'SUPER_ADMIN'
        };
        localStorage.setItem('admin_token', mockToken);
        localStorage.setItem('admin_user', JSON.stringify(mockUser));
        onLoginSuccess(mockToken, mockUser);
      } else if (normalStudents.includes(lowerEmail)) {
        setError(`Access Denied: The account "${email}" is registered as a Student/Driver. Only Administrative accounts can access this control center. Please log in using the Campus Covoiturage Mobile App.`);
      } else {
        setError('Invalid administrative credentials. If you are a Student, please log in via the mobile app. Administrator demo accounts use "admin@campuscovoiturage.dz" with password "admin123" or "Admin123!".');
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="w-full h-full bg-[#0A0A0F] flex flex-col items-center justify-center p-4 relative overflow-y-auto safe-scroll">
      {/* Background glowing blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-primary/10 rounded-full blur-[60px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[200px] h-[200px] bg-accent/10 rounded-full blur-[60px] pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full z-10 max-w-[340px]">
        <div className="text-center mb-4">
          <div className="inline-flex bg-primary/10 p-2.5 rounded-xl border border-primary/20 mb-2 shadow-lg shadow-primary/5">
            <ShieldCheck className="h-7 w-7 text-primary animate-pulse" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-wide">Campus Covoiturage</h1>
          <p className="text-[11px] text-textSecondary mt-0.5">Control Center Access</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-5 rounded-xl relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-2.5 bg-emergency/10 border border-emergency/20 text-emergency rounded-lg text-[10px] font-semibold leading-relaxed">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-textSecondary" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@campuscovoiturage.dz"
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/5 rounded-lg text-xs text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-textSecondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-white/5 border border-white/5 rounded-lg text-xs text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-textSecondary hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-lg shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 flex items-center justify-center space-x-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In Securely</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center mt-4">
          <p className="text-[9px] text-textSecondary leading-normal">
            Demo admins: <span className="text-accent font-semibold">admin@campuscovoiturage.dz</span> / <span className="text-accent font-semibold">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );

};

export default Login;
