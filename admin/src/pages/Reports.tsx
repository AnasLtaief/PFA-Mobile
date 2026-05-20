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
    <div className="space-y-4 animate-fade-in text-[#F0F0F5] relative h-full">
      {/* Header Info */}
      <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-2xl p-3.5">
        <div>
          <h2 className="text-sm font-bold text-white">Security Controls</h2>
          <p className="text-[10px] text-textSecondary mt-0.5">SOS distress & dispute monitoring</p>
        </div>
        <div className="flex items-center space-x-1.5 bg-emergency/15 border border-emergency/25 rounded-lg px-2.5 py-1 text-emergency font-bold animate-pulse text-[10px]">
          <AlertOctagon className="h-3.5 w-3.5" />
          <span>{reports.filter(r => r.status === 'critical').length} Active SOS</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-3 rounded-xl flex flex-col gap-2.5">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-textSecondary" />
          <input
            type="text"
            placeholder="Search by student, ID, details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Dropdown status */}
        <div className="flex items-center justify-between bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-lg text-xs w-full">
          <span className="text-textSecondary">Urgency:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs"
          >
            <option value="all" className="bg-surface text-white">All Incidents</option>
            <option value="critical" className="bg-surface text-emergency">SOS Critical</option>
            <option value="pending" className="bg-surface text-yellow-400">Pending Review</option>
            <option value="resolved" className="bg-surface text-accent">Resolved</option>
          </select>
        </div>
      </div>

      {/* Reports Queue */}
      <div className="space-y-3 pb-8">
        {filteredReports.length > 0 ? (
          filteredReports.map((rep) => (
            <div
              key={rep.id}
              onClick={() => setSelectedReport(rep)}
              className={`glass-card p-4 rounded-xl cursor-pointer transition-all border ${
                selectedReport?.id === rep.id ? 'border-primary bg-primary/5' : 'border-white/5 hover:border-white/10'
              } ${rep.status === 'critical' ? 'border-l-4 border-l-emergency' : ''}`}
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1.5 text-[9px] font-mono">
                    <span className="bg-white/5 text-textSecondary px-1.5 py-0.5 rounded border border-white/5">
                      {rep.id}
                    </span>
                    {getReportTypeBadge(rep.type)}
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                    rep.status === 'critical' ? 'bg-emergency/20 text-emergency' :
                    rep.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-accent/20 text-accent'
                  }`}>
                    {rep.status}
                  </span>
                </div>

                <p className="text-[11px] text-white leading-relaxed line-clamp-2">{rep.description}</p>

                <div className="flex justify-between items-center pt-2 border-t border-white/[0.03] text-[9px] text-textSecondary">
                  <span className="flex items-center space-x-1">
                    <User className="h-3 w-3 text-primary" />
                    <span>From: {rep.reporterName}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-accent" />
                    <span>{rep.timestamp}</span>
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-6 rounded-xl border-dashed border-white/10 text-center flex flex-col items-center justify-center">
            <Shield className="h-8 w-8 text-textSecondary mb-2" />
            <p className="text-xs text-textSecondary">No security incidents match filters.</p>
          </div>
        )}
      </div>

      {/* Selected Report slide-up bottom sheet overlay */}
      {selectedReport && (
        <div 
          className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedReport(null)}
        >
          <div 
            className="glass-panel w-full rounded-t-2xl p-4 border-t border-white/10 shadow-2xl animate-slide-up bg-background max-h-[85%] overflow-y-auto safe-scroll"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Incident Docket</h3>
                <code className="text-[9px] text-textSecondary font-mono">{selectedReport.id}</code>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                  selectedReport.status === 'critical' ? 'bg-emergency/20 text-emergency' :
                  selectedReport.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-accent/20 text-accent'
                }`}>
                  {selectedReport.status}
                </span>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-textSecondary hover:text-white text-sm pl-1.5"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* SOS Emergency Special Alert */}
            {selectedReport.status === 'critical' && (
              <div className="p-3 bg-emergency/15 border border-emergency/35 rounded-xl space-y-1.5 animate-pulse mt-3 text-left">
                <div className="flex items-center space-x-1.5 text-emergency font-bold text-[10px] uppercase">
                  <AlertOctagon className="h-3.5 w-3.5" />
                  <span>Active SOS Alarm Channel</span>
                </div>
                <p className="text-[9px] text-textSecondary leading-normal">
                  GPS coordinates tracking is active on the student's Flutter app. Immediate callback or dispatch recommended.
                </p>
              </div>
            )}

            {/* Incident Details */}
            <div className="space-y-3.5 text-left mt-3">
              <div>
                <span className="text-[9px] text-textSecondary uppercase font-bold tracking-wider block">Description of Event</span>
                <p className="text-[11px] text-white mt-1 leading-normal bg-white/5 p-2.5 rounded-lg border border-white/5">{selectedReport.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-[9px] text-textSecondary uppercase font-bold tracking-wider block">Reporting Party</span>
                  <span className="text-white font-semibold mt-0.5 block truncate">{selectedReport.reporterName}</span>
                </div>
                <div>
                  <span className="text-[9px] text-textSecondary uppercase font-bold tracking-wider block">Accused Party</span>
                  <span className="text-white font-semibold mt-0.5 block truncate">{selectedReport.reportedName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-[9px] text-textSecondary uppercase font-bold tracking-wider block">Commuter Route</span>
                  <span className="text-white font-semibold mt-0.5 block truncate">{selectedReport.route}</span>
                </div>
                <div>
                  <span className="text-[9px] text-textSecondary uppercase font-bold tracking-wider block">Ride Ref ID</span>
                  <span className="text-white font-mono font-bold mt-0.5 block truncate">{selectedReport.rideId}</span>
                </div>
              </div>
            </div>

            {/* Evidence attachment */}
            <div className="border border-dashed border-white/10 rounded-lg p-3 bg-white/[0.01] text-center space-y-1.5 mt-3 text-xs">
              <ImageIcon className="h-5 w-5 text-textSecondary mx-auto" />
              <p className="text-[10px] font-bold text-white">Incident Evidence Attachment</p>
              <button className="px-2.5 py-1 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded text-[8px] font-bold inline-flex items-center space-x-1">
                <span>View Attachment</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </button>
            </div>

            {/* Resolution buttons */}
            {selectedReport.status !== 'resolved' && (
              <div className="pt-3 border-t border-white/5 space-y-2 mt-4">
                {selectedReport.status === 'critical' && (
                  <button className="w-full py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary font-bold text-[10px] rounded-lg transition-all flex items-center justify-center space-x-1.5">
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>Initiate Emergency Callback</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    resolveReport(selectedReport.id);
                    setSelectedReport(null);
                  }}
                  className="w-full py-2 bg-accent hover:bg-accent/95 text-background font-bold text-[10px] rounded-lg shadow-lg shadow-accent/15 transition-all flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-background" />
                  <span>Mark Incident as Resolved</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
