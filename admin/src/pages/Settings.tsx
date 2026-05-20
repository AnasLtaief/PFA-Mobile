import React, { useState } from 'react';
import {
  Shield,
  Bell,
  Mail,
  Save,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Database,
  Lock,
  Percent,
  Sliders,
  DollarSign
} from 'lucide-react';

const Settings: React.FC = () => {
  // System Configurations
  const [stripeFeePercent, setStripeFeePercent] = useState<number>(3.5);
  const [escrowHoldHours, setEscrowHoldHours] = useState<number>(24);
  const [requireDriverManualVerify, setRequireDriverManualVerify] = useState<boolean>(true);
  const [enableTwilioSms, setEnableTwilioSms] = useState<boolean>(false);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Email Template Form
  const [welcomeSubject, setWelcomeSubject] = useState('Welcome to Campus Covoiturage!');
  const [welcomeBody, setWelcomeBody] = useState('Bonjour {student_name}, Welcome to Algeria’s premium student ride-pooling community. Complete your profile verification to start matching routes.');

  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const triggerSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedStatus('Saving configurations...');
    setTimeout(() => {
      setSavedStatus('System updates broadcasted successfully!');
      setTimeout(() => setSavedStatus(null), 3000);
    }, 1000);
  };

  const triggerUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setSavedStatus('Updating security keys...');
    setTimeout(() => {
      setSavedStatus('Admin credentials modified securely.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSavedStatus(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-4 animate-fade-in text-[#F0F0F5] pb-6">
      {/* Header Info */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-extrabold text-white">System Settings Control</h2>
        <p className="text-[11px] text-textSecondary leading-relaxed">Configure Stripe commission cuts, safety parameters, email templates, and dashboard security.</p>
        {savedStatus && (
          <div className="px-3 py-2 bg-accent/15 border border-accent/20 text-accent rounded-xl text-[10px] font-bold flex items-center justify-center space-x-1.5 animate-bounce">
            <CheckCircle className="h-3.5 w-3.5 animate-pulse" />
            <span>{savedStatus}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Rules and Fees */}
        <div className="glass-card p-4 rounded-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
            <Sliders className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Algorithmic Rules & Fees</h3>
          </div>

          <form onSubmit={triggerSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 gap-4">
              {/* Stripe fee */}
              <div className="space-y-1">
                <label className="text-textSecondary text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                  <Percent className="h-3 w-3 text-primary" />
                  <span>System Platform Fee (%)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={stripeFeePercent}
                  onChange={(e) => setStripeFeePercent(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary/50 text-xs"
                />
              </div>

              {/* Escrow delay */}
              <div className="space-y-1">
                <label className="text-textSecondary text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                  <DollarSign className="h-3 w-3 text-accent" />
                  <span>Escrow Release Hold Time (Hours)</span>
                </label>
                <input
                  type="number"
                  value={escrowHoldHours}
                  onChange={(e) => setEscrowHoldHours(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary/50 text-xs"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-1">
              {/* Manual driver check */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-white text-[11px] font-bold block leading-tight">Require Driver Verification</span>
                  <span className="text-[9px] text-textSecondary mt-0.5 block leading-normal">Hosts are pending until manual admin approval.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRequireDriverManualVerify(!requireDriverManualVerify)}
                  className="text-primary hover:text-white transition-colors shrink-0"
                >
                  {requireDriverManualVerify ? <ToggleRight className="h-6 w-6 text-accent" /> : <ToggleLeft className="h-6 w-6 text-textSecondary" />}
                </button>
              </div>

              {/* Twilio SMS check */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-white text-[11px] font-bold block leading-tight">Twilio SMS Gateway</span>
                  <span className="text-[9px] text-textSecondary mt-0.5 block leading-normal">Sends live SMS verification codes to students.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableTwilioSms(!enableTwilioSms)}
                  className="text-primary hover:text-white transition-colors shrink-0"
                >
                  {enableTwilioSms ? <ToggleRight className="h-6 w-6 text-accent" /> : <ToggleLeft className="h-6 w-6 text-textSecondary" />}
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center space-x-1.5"
            >
              <Save className="h-4 w-4" />
              <span>Save Platform Rules</span>
            </button>
          </form>
        </div>

        {/* Email template config */}
        <div className="glass-card p-4 rounded-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
            <Mail className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Automated SMTP Templates</h3>
          </div>

          <form onSubmit={triggerSaveSettings} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-textSecondary text-[10px] font-bold uppercase tracking-wider">Welcome Email Subject</label>
              <input
                type="text"
                value={welcomeSubject}
                onChange={(e) => setWelcomeSubject(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary/50 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-textSecondary text-[10px] font-bold uppercase tracking-wider">Welcome Email Body</label>
              <textarea
                value={welcomeBody}
                onChange={(e) => setWelcomeBody(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary/50 resize-none font-mono text-[10px] leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center space-x-1.5"
            >
              <Save className="h-4 w-4" />
              <span>Save Mail Template</span>
            </button>
          </form>
        </div>

        {/* Access Credentials */}
        <div className="glass-card p-4 rounded-xl space-y-4 border border-primary/10 bg-gradient-to-b from-primary/[0.02] to-transparent">
          <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
            <Shield className="h-4 w-4 text-accent" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Access Credentials</h3>
          </div>

          <form onSubmit={triggerUpdatePassword} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-textSecondary text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                <Lock className="h-3 w-3 text-accent" />
                <span>Current Passcode</span>
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-textSecondary text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                <Lock className="h-3 w-3 text-accent" />
                <span>New Passcode</span>
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-textSecondary text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                <Lock className="h-3 w-3 text-accent" />
                <span>Confirm New Passcode</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-accent hover:bg-accent/95 text-background font-bold text-xs rounded-xl shadow-lg shadow-accent/15 transition-all flex items-center justify-center space-x-1.5"
            >
              <Shield className="h-4 w-4 text-background" />
              <span>Update Administrative Keys</span>
            </button>
          </form>
        </div>

        {/* Database System Diagnostics */}
        <div className="glass-card p-4 rounded-xl space-y-3">
          <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
            <Database className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">System Diagnostics</h3>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-0.5 border-b border-white/5">
              <span className="text-textSecondary text-[11px]">Active DB Collections</span>
              <span className="text-white font-mono font-bold text-[11px]">12 tables (MongoDB)</span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-white/5">
              <span className="text-textSecondary text-[11px]">Database Storage Size</span>
              <span className="text-white font-mono font-bold text-[11px]">14.2 MB</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="text-textSecondary text-[11px]">Mongoose Connection</span>
              <span className="text-accent font-semibold flex items-center space-x-1 text-[11px]">
                <span className="h-1.5 w-1.5 bg-accent rounded-full animate-ping"></span>
                <span>5 Active Pipes</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
