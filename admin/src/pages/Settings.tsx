import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
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
  const [activeThemeMode, setActiveThemeMode] = useState<'dark_only' | 'system_adaptive'>('dark_only');

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
    <div className="space-y-6 animate-fade-in text-[#F0F0F5]">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">System Settings Control</h2>
          <p className="text-xs text-textSecondary mt-1">Configure Stripe commission cuts, safety parameters, email templates, and dashboard security</p>
        </div>
        {savedStatus && (
          <div className="px-4 py-2 bg-accent/15 border border-accent/20 text-accent rounded-xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
            <CheckCircle className="h-4 w-4" />
            <span>{savedStatus}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: System Configurations Form (takes 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rules and Fees */}
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <div className="flex items-center space-x-2.5 border-b border-white/5 pb-4">
              <Sliders className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold text-white">Algorithmic Rules & Fees</h3>
            </div>

            <form onSubmit={triggerSaveSettings} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stripe fee */}
                <div className="space-y-1.5">
                  <label className="text-textSecondary font-bold uppercase tracking-wider flex items-center space-x-1">
                    <Percent className="h-3.5 w-3.5" />
                    <span>System Platform Fee (%)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={stripeFeePercent}
                    onChange={(e) => setStripeFeePercent(parseFloat(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary/50"
                  />
                </div>

                {/* Escrow delay */}
                <div className="space-y-1.5">
                  <label className="text-textSecondary font-bold uppercase tracking-wider flex items-center space-x-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>Escrow Release Hold Time (Hours)</span>
                  </label>
                  <input
                    type="number"
                    value={escrowHoldHours}
                    onChange={(e) => setEscrowHoldHours(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-3">
                {/* Manual driver check */}
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <span className="text-white font-semibold block">Require Manual Admin Driver Verification</span>
                    <span className="text-[10px] text-textSecondary">New host registrations are put in pending status until verified by admins.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRequireDriverManualVerify(!requireDriverManualVerify)}
                    className="text-primary hover:text-white transition-colors"
                  >
                    {requireDriverManualVerify ? <ToggleRight className="h-7 w-7 text-accent" /> : <ToggleLeft className="h-7 w-7 text-textSecondary" />}
                  </button>
                </div>

                {/* Twilio SMS check */}
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <span className="text-white font-semibold block">Enable Twilio Live SMS Gateway</span>
                    <span className="text-[10px] text-textSecondary">Sends actual SMS text verification codes. Fallback is internal local console logging.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnableTwilioSms(!enableTwilioSms)}
                    className="text-primary hover:text-white transition-colors"
                  >
                    {enableTwilioSms ? <ToggleRight className="h-7 w-7 text-accent" /> : <ToggleLeft className="h-7 w-7 text-textSecondary" />}
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center space-x-1.5 self-start"
              >
                <Save className="h-4 w-4" />
                <span>Save Platform Rules</span>
              </button>
            </form>
          </div>

          {/* Email template config */}
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <div className="flex items-center space-x-2.5 border-b border-white/5 pb-4">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold text-white">Automated SMTP Templates</h3>
            </div>

            <form onSubmit={triggerSaveSettings} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-textSecondary font-bold uppercase tracking-wider">Welcome Email Subject</label>
                <input
                  type="text"
                  value={welcomeSubject}
                  onChange={(e) => setWelcomeSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-textSecondary font-bold uppercase tracking-wider">Welcome Email Body (Markdown Supported)</label>
                <textarea
                  value={welcomeBody}
                  onChange={(e) => setWelcomeBody(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary/50 resize-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center space-x-1.5"
              >
                <Save className="h-4 w-4" />
                <span>Save Mail Template</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Security Password settings */}
        <div className="space-y-6">
          {/* Admin profile security */}
          <div className="glass-card p-6 rounded-2xl space-y-6 border border-primary/10 bg-gradient-to-b from-primary/[0.02] to-transparent">
            <div className="flex items-center space-x-2.5 border-b border-white/5 pb-4">
              <Shield className="h-5 w-5 text-accent" />
              <h3 className="text-base font-bold text-white">Access Credentials</h3>
            </div>

            <form onSubmit={triggerUpdatePassword} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-textSecondary font-bold uppercase tracking-wider flex items-center space-x-1">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Current Passcode</span>
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-white placeholder-textSecondary focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-textSecondary font-bold uppercase tracking-wider flex items-center space-x-1">
                  <Lock className="h-3.5 w-3.5" />
                  <span>New Passcode</span>
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-white placeholder-textSecondary focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-textSecondary font-bold uppercase tracking-wider flex items-center space-x-1">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Confirm New Passcode</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-white placeholder-textSecondary focus:outline-none focus:border-primary/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent hover:bg-accent/95 text-background font-bold rounded-xl shadow-lg shadow-accent/15 transition-all flex items-center justify-center space-x-1.5"
              >
                <Shield className="h-4 w-4 text-background" />
                <span>Update Administrative Keys</span>
              </button>
            </form>
          </div>

          {/* Database System Diagnostics */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-white/5 pb-4">
              <Database className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold text-white">System Diagnostics</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-textSecondary">Active DB Collections</span>
                <span className="text-white font-mono font-bold">12 tables (MongoDB)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-textSecondary">Database Storage Size</span>
                <span className="text-white font-mono font-bold">14.2 MB</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-textSecondary">Mongoose Connection Pool</span>
                <span className="text-accent font-semibold flex items-center space-x-1">
                  <span className="h-2 w-2 bg-accent rounded-full animate-ping"></span>
                  <span>5 Active Pipes</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
