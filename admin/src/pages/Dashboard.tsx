import React from 'react';
import {
  Users,
  Car,
  DollarSign,
  AlertOctagon,
  TrendingUp,
  UserCheck,
  MapPin,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';

const mockChartData = [
  { day: 'Mon', rides: 12, revenue: 1800 },
  { day: 'Tue', rides: 18, revenue: 2700 },
  { day: 'Wed', rides: 15, revenue: 2200 },
  { day: 'Thu', rides: 25, revenue: 3800 },
  { day: 'Fri', rides: 32, revenue: 4900 },
  { day: 'Sat', rides: 45, revenue: 6800 },
  { day: 'Sun', rides: 38, revenue: 5700 },
];

const mockRecentActivities = [
  { id: 1, type: 'user_registered', title: 'New Student Registration', desc: 'Mehdi Larbi (univ-constantine2.dz) registered', time: '10 mins ago', icon: Users, color: 'text-primary bg-primary/10 border-primary/20' },
  { id: 2, type: 'host_verified', title: 'Driver Account Approved', desc: 'Anas Rahmani completed driver credentials review', time: '45 mins ago', icon: UserCheck, color: 'text-accent bg-accent/10 border-accent/20' },
  { id: 3, type: 'ride_created', title: 'Ride Created', desc: 'Alger to Constantine departing at 14:00', time: '2 hours ago', icon: Car, color: 'text-info bg-info/10 border-info/20' },
  { id: 4, type: 'report_filed', title: 'SOS Report Lodged', desc: 'Active ride SOS triggered due to delay on Route A1', time: '5 hours ago', icon: AlertOctagon, color: 'text-emergency bg-emergency/10 border-emergency/20' },
];

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Total Registered Students', value: '452', change: '+12% this week', icon: Users, color: 'text-primary bg-primary/10 border-primary/20' },
    { title: 'Active Rides Today', value: '28', change: '8 drivers currently online', icon: Car, color: 'text-accent bg-accent/10 border-accent/20' },
    { title: 'Stripe Escrow Revenue', value: '42,500 DA', change: '+24% monthly increase', icon: DollarSign, color: 'text-info bg-blue-500/10 border-blue-500/20' },
    { title: 'Pending Support Reports', value: '4', change: '2 critical SOS events', icon: AlertOctagon, color: 'text-emergency bg-emergency/10 border-emergency/20' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Alert/Banner */}
      <div className="glass-card p-6 rounded-2xl flex items-center justify-between border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
        <div>
          <h2 className="text-xl font-bold text-white">System Security Level: Standard</h2>
          <p className="text-sm text-textSecondary mt-1">All real-time Socket.io and emergency monitoring channels are reporting healthy statuses.</p>
        </div>
        <div className="flex items-center space-x-2 text-accent font-semibold text-sm">
          <TrendingUp className="h-4 w-4" />
          <span>99.8% System Uptime</span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-textSecondary font-semibold tracking-wide uppercase">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-white mt-2">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl border ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <span className="text-xs text-textSecondary font-medium mt-4 block">{stat.change}</span>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart (Area Chart) */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Rides Frequence & Trends</h3>
              <p className="text-xs text-textSecondary">Active weekly driver commutes</p>
            </div>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-xs font-semibold text-white">Weekly</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRides" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#52526b" fontSize={11} tickLine={false} />
                <YAxis stroke="#52526b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#13131A',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="rides" stroke="#6C63FF" strokeWidth={2} fillOpacity={1} fill="url(#colorRides)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart (Bar Chart) */}
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Escrow Processing (DA)</h3>
              <p className="text-xs text-textSecondary">Stripe card-payment payouts</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#52526b" fontSize={11} tickLine={false} />
                <YAxis stroke="#52526b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#13131A',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="revenue" fill="#00D4AA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Live Operations Feed</h3>
            <span className="flex items-center text-xs font-semibold text-accent space-x-1.5">
              <span className="h-2 w-2 bg-accent rounded-full animate-ping"></span>
              <span>Streaming Live</span>
            </span>
          </div>
          <div className="space-y-4">
            {mockRecentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-start justify-between p-3.5 hover:bg-white/[0.02] border border-transparent hover:border-white/5 rounded-2xl transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl border ${act.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{act.title}</h4>
                      <p className="text-xs text-textSecondary mt-0.5">{act.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-textSecondary flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{act.time}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Monitoring (Health Statuses) */}
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold text-white">Service Health Checks</h3>
          <div className="space-y-4">
            {[
              { name: 'Core API Gateway', status: 'Healthy', latency: '42ms', color: 'bg-accent' },
              { name: 'Supabase Storage Bucket', status: 'Healthy', latency: '95ms', color: 'bg-accent' },
              { name: 'Socket.io Cluster', status: 'Healthy', latency: '8ms', color: 'bg-accent' },
              { name: 'Twilio SMS Gateway', status: 'Degraded', latency: '400ms', color: 'bg-emergency' },
              { name: 'Stripe API Bridge', status: 'Healthy', latency: '120ms', color: 'bg-accent' }
            ].map((srv, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm font-semibold text-white">{srv.name}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-textSecondary font-mono">{srv.latency}</span>
                  <div className="flex items-center space-x-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${srv.color}`}></span>
                    <span className="text-xs font-semibold text-white">{srv.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
