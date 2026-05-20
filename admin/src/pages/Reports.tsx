import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Shield,
  CheckCircle,
  AlertOctagon,
  Image as ImageIcon,
  User,
  MessageSquare,
  Search,
  Filter,
  PhoneCall,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface DisputeReport {
  id: string;
  reporterName: string;
  reportedName: string;
  rideId: string;
  type: 'sos_trigger' | 'dispute' | 'bad_behavior' | 'payment_issue';
  description: string;
  evidencePhoto?: string;
  status: 'critical' | 'pending' | 'resolved';
  timestamp: string;
  route: string;
}

const mockReports: DisputeReport[] = [
  {
    id: 'REP-082',
    reporterName: 'Amine Khelifa',
    reportedName: 'Mehdi Larbi',
    rideId: 'RIDE-829',
    type: 'sos_trigger',
    description: 'Student triggered safety SOS due to vehicle breakdown on highway N5. Requesting emergency pickup or contact assistance.',
    status: 'critical',
    timestamp: '10 mins ago',
    route: 'Alger to USTHB'
  },
  {
    id: 'REP-047',
    reporterName: 'Sarah Bouaziz',
    reportedName: 'Sofiane Hamadi',
    rideId: 'RIDE-905',
    type: 'payment_issue',
    description: 'Driver cancelled the ride at the last minute but the Stripe escrow payment has not been refunded to my wallet yet.',
    status: 'pending',
    timestamp: '2 hours ago',
    route: 'Bir El Djir to USTO'
  },
  {
    id: 'REP-019',
    reporterName: 'Yanis Touati',
    reportedName: 'Anas Rahmani',
    rideId: 'RIDE-402',
    type: 'bad_behavior',
    description: 'Driver was driving dangerously and speeding past the university limits. I felt extremely unsafe.',
    status: 'pending',
    timestamp: '5 hours ago',
    route: 'El Khroub to Université Constantine 2'
  },
  {
    id: 'REP-005',
    reporterName: 'Lamine Meziane',
    reportedName: 'Amine Bensaoud',
    rideId: 'RIDE-301',
    type: 'dispute',
    description: 'Disagreement regarding the agreed pickup point near the main gate. Handled with mutual agreement later but logging incident.',
    status: 'resolved',
    timestamp: '1 day ago',
    route: 'Tlemcen Center to Université Tlemcen'
  }
];

const Reports: React.FC = () => {
  const [reports, setReports] = useState<DisputeReport[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'pending' | 'resolved'>('all');
  const [selectedReport, setSelectedReport] = useState<DisputeReport | null>(null);

  const filteredReports = reports.filter(rep => {
    const matchesSearch = rep.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.reportedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || rep.status === filterType;

    return matchesSearch && matchesFilter;
  });

  const resolveReport = (id: string) => {
    setReports(prev => prev.map(rep => {
      if (rep.id === id) {
        return { ...rep, status: 'resolved' };
      }
      return rep;
    }));
    setSelectedReport(prev => prev && prev.id === id ? { ...prev, status: 'resolved' } : prev);
  };

  const getReportTypeBadge = (type: DisputeReport['type']) => {
    switch (type) {
      case 'sos_trigger':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emergency/15 border border-emergency/20 text-emergency">SOS EMERGENCY</span>;
      case 'payment_issue':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 border border-blue-500/20 text-blue-400">PAYMENT DISPUTE</span>;
      case 'bad_behavior':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 border border-purple-500/20 text-purple-400">CONDUCT VIOLATION</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/15 border border-yellow-500/20 text-yellow-400">DISPUTE</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#F0F0F5]">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Security & Disputes Control Room</h2>
          <p className="text-xs text-textSecondary mt-1">Review active SOS distress calls, passenger disputes, and administrative tickets in real-time</p>
        </div>
        <div className="flex items-center space-x-2 bg-white/5 border border-white/5 rounded-xl px-4 py-2">
          <AlertOctagon className="h-4 w-4 text-emergency animate-pulse" />
          <span className="text-xs font-semibold text-white">
            {reports.filter(r => r.status === 'critical').length} Critical SOS Event Active
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-textSecondary" />
          <input
            type="text"
            placeholder="Search by student, details, report ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-xs text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Status Category filter */}
        <div className="flex items-center space-x-2 bg-white/5 border border-white/5 px-3 py-2 rounded-xl text-xs w-full md:w-auto justify-between">
          <span className="text-textSecondary">Dispute Urgency:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-surface">All Incidents</option>
            <option value="critical" className="bg-surface text-emergency">SOS Critical</option>
            <option value="pending" className="bg-surface text-yellow-400">Pending Review</option>
            <option value="resolved" className="bg-surface text-accent">Resolved</option>
          </select>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Reports */}
        <div className="lg:col-span-2 space-y-4">
          {filteredReports.map((rep) => (
            <div
              key={rep.id}
              onClick={() => setSelectedReport(rep)}
              className={`glass-card p-5 rounded-2xl cursor-pointer transition-all border ${
                selectedReport?.id === rep.id ? 'border-primary bg-primary/5' : 'border-white/5'
              } ${rep.status === 'critical' ? 'border-l-4 border-l-emergency' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-white/5 text-textSecondary text-[10px] font-mono px-2 py-0.5 rounded border border-white/5">
                      {rep.id}
                    </span>
                    {getReportTypeBadge(rep.type)}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      rep.status === 'critical' ? 'bg-emergency/20 text-emergency' :
                      rep.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-accent/20 text-accent'
                    }`}>
                      {rep.status}
                    </span>
                  </div>

                  <p className="text-xs text-white leading-relaxed line-clamp-2">{rep.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-textSecondary font-semibold">
                    <span className="flex items-center space-x-1">
                      <User className="h-3.5 w-3.5 text-primary" />
                      <span>Reporter: {rep.reporterName}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5 text-accent" />
                      <span>{rep.timestamp}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Detail Card */}
        <div>
          {selectedReport ? (
            <div className={`glass-card p-6 rounded-2xl space-y-6 sticky top-24 border ${
              selectedReport.status === 'critical' ? 'border-emergency/30 bg-emergency/5' : 'border-white/5'
            }`}>
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Incident Docket</h3>
                  <code className="text-[10px] text-textSecondary font-mono">{selectedReport.id}</code>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  selectedReport.status === 'critical' ? 'bg-emergency/20 text-emergency border border-emergency/20' :
                  selectedReport.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' :
                  'bg-accent/20 text-accent border border-accent/20'
                }`}>
                  {selectedReport.status}
                </span>
              </div>

              {/* SOS Emergency Special Alert */}
              {selectedReport.status === 'critical' && (
                <div className="p-4 bg-emergency/15 border border-emergency/30 rounded-xl space-y-2 animate-pulse">
                  <div className="flex items-center space-x-2 text-emergency font-bold text-xs uppercase">
                    <AlertOctagon className="h-4 w-4" />
                    <span>Active SOS Alarm Channel</span>
                  </div>
                  <p className="text-[11px] text-textSecondary">GPS Coordinates lock active on associated Flutter App. Commute route requires immediate resolution check.</p>
                </div>
              )}

              {/* Incident Details */}
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider block">Description of Event</span>
                  <p className="text-white mt-1.5 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">{selectedReport.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider block">Reporting Party</span>
                    <span className="text-white font-semibold mt-1 block">{selectedReport.reporterName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider block">Accused Driver/User</span>
                    <span className="text-white font-semibold mt-1 block">{selectedReport.reportedName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider block">Commuter Route</span>
                    <span className="text-white font-semibold mt-1 block">{selectedReport.route}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider block">Ride Reference</span>
                    <span className="text-white font-mono font-bold mt-1 block">{selectedReport.rideId}</span>
                  </div>
                </div>
              </div>

              {/* Evidence photo placeholder */}
              <div className="border border-dashed border-white/10 rounded-xl p-6 bg-white/[0.01] text-center space-y-2">
                <ImageIcon className="h-8 w-8 text-textSecondary mx-auto" />
                <p className="text-xs font-semibold text-white">Review Evidence Image</p>
                <p className="text-[10px] text-textSecondary">File submitted by reporter at time of complaint</p>
                <button className="px-3 py-1 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded text-[10px] font-bold inline-flex items-center space-x-1">
                  <span>Open attachment</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>

              {/* Resolution options */}
              {selectedReport.status !== 'resolved' && (
                <div className="pt-4 border-t border-white/5 space-y-3">
                  {selectedReport.status === 'critical' && (
                    <button className="w-full py-2.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2">
                      <PhoneCall className="h-4 w-4" />
                      <span>Initiate Emergency Callback</span>
                    </button>
                  )}

                  <button
                    onClick={() => resolveReport(selectedReport.id)}
                    className="w-full py-3 bg-accent hover:bg-accent/95 text-background font-bold text-xs rounded-xl shadow-lg shadow-accent/15 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle className="h-4 w-4 text-background" />
                    <span>Mark Incident as Resolved</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-8 rounded-2xl border-dashed border-white/10 text-center flex flex-col items-center justify-center h-80">
              <Shield className="h-10 w-10 text-textSecondary mb-3 animate-pulse" />
              <p className="text-xs text-textSecondary">Select an active security ticket from the operations queue to view timeline details, evidence uploads, and mitigation commands.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
