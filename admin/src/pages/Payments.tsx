import React, { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  Download,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  ArrowUpRight,
  ShieldAlert,
  Calendar
} from 'lucide-react';

interface Transaction {
  id: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  currency: 'DA';
  status: 'succeeded' | 'pending' | 'refunded' | 'failed';
  escrowRelease: 'held' | 'released' | 'returned';
  rideId: string;
  date: string;
  paymentMethod: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'TXN-80410',
    studentName: 'Amine Khelifa',
    studentEmail: 'a.khelifa@usthb.dz',
    amount: 150,
    currency: 'DA',
    status: 'succeeded',
    escrowRelease: 'held',
    rideId: 'RIDE-829',
    date: '2026-05-20 09:12:00',
    paymentMethod: 'Stripe Card (Visa •••• 4242)'
  },
  {
    id: 'TXN-59301',
    studentName: 'Sarah Bouaziz',
    studentEmail: 's.bouaziz@usto.dz',
    amount: 120,
    currency: 'DA',
    status: 'refunded',
    escrowRelease: 'returned',
    rideId: 'RIDE-905',
    date: '2026-05-19 14:02:00',
    paymentMethod: 'Stripe Card (Mastercard •••• 5555)'
  },
  {
    id: 'TXN-39201',
    studentName: 'Yanis Touati',
    studentEmail: 'y.touati@univ-constantine2.dz',
    amount: 100,
    currency: 'DA',
    status: 'succeeded',
    escrowRelease: 'released',
    rideId: 'RIDE-402',
    date: '2026-05-20 07:30:00',
    paymentMethod: 'Stripe Card (CIB Card •••• 1049)'
  },
  {
    id: 'TXN-20194',
    studentName: 'Feriel Remili',
    studentEmail: 'f.remili@univ-oran1.dz',
    amount: 250,
    currency: 'DA',
    status: 'failed',
    escrowRelease: 'returned',
    rideId: 'RIDE-104',
    date: '2026-05-18 10:45:00',
    paymentMethod: 'Stripe Card (Visa •••• 9900)'
  },
  {
    id: 'TXN-10492',
    studentName: 'Bilel Mimouni',
    studentEmail: 'b.mimouni@univ-setif.dz',
    amount: 200,
    currency: 'DA',
    status: 'succeeded',
    escrowRelease: 'held',
    rideId: 'RIDE-118',
    date: '2026-05-20 09:05:00',
    paymentMethod: 'Stripe Card (CIB Card •••• 7731)'
  }
];

const Payments: React.FC = () => {
  const [txns, setTxns] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'succeeded' | 'pending' | 'refunded' | 'failed'>('all');
  const [escrowFilter, setEscrowFilter] = useState<'all' | 'held' | 'released' | 'returned'>('all');

  const filteredTxns = txns.filter(txn => {
    const matchesSearch = txn.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.rideId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    const matchesEscrow = escrowFilter === 'all' || txn.escrowRelease === escrowFilter;

    return matchesSearch && matchesStatus && matchesEscrow;
  });

  const triggerRefund = (id: string) => {
    if (window.confirm(`Are you sure you want to administratively trigger a full refund for transaction ${id}? This action is irreversible on Stripe gateways.`)) {
      setTxns(prev => prev.map(txn => {
        if (txn.id === id) {
          return {
            ...txn,
            status: 'refunded',
            escrowRelease: 'returned'
          };
        }
        return txn;
      }));
    }
  };

  const exportCSV = () => {
    // Generate CSV mockup
    const headers = ['Transaction ID,Student Name,Email,Amount,Currency,Status,Escrow,Ride ID,Date,Payment Method\n'];
    const rows = filteredTxns.map(txn =>
      `${txn.id},${txn.studentName},${txn.studentEmail},${txn.amount},${txn.currency},${txn.status},${txn.escrowRelease},${txn.rideId},${txn.date},"${txn.paymentMethod}"`
    );
    const blob = new Blob([...headers, ...rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `campus_payments_export_${new Date().toISOString().slice(0,10)}.csv`);
    a.click();
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'succeeded':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/15 border border-accent/20 text-accent">SUCCESS</span>;
      case 'refunded':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 border border-blue-500/20 text-blue-400">REFUNDED</span>;
      case 'failed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emergency/15 border border-emergency/20 text-emergency">FAILED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/15 border border-yellow-500/20 text-yellow-400">PENDING</span>;
    }
  };

  const getEscrowBadge = (escrow: Transaction['escrowRelease']) => {
    switch (escrow) {
      case 'held':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/15 border border-yellow-500/20 text-yellow-400">ESCROW LOCK</span>;
      case 'released':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/15 border border-accent/20 text-accent">RELEASED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 border border-white/5 text-textSecondary">RETURNED</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#F0F0F5]">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Stripe Escrow Ledger</h2>
          <p className="text-xs text-textSecondary mt-1">Audit CIB or international card payments, configure escrow timers, and trigger admin refunds</p>
        </div>
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center space-x-2 w-max self-start md:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3.5 bg-accent/10 border border-accent/20 rounded-xl text-accent">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-textSecondary font-bold uppercase tracking-wider block">Total Processing Volume</span>
            <span className="text-lg font-bold text-white mt-0.5 block">45,200 DA</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-textSecondary font-bold uppercase tracking-wider block">Locked in Escrow</span>
            <span className="text-lg font-bold text-white mt-0.5 block">3,500 DA</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-textSecondary font-bold uppercase tracking-wider block">Stripe Success Rate</span>
            <span className="text-lg font-bold text-white mt-0.5 block">94.8%</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-textSecondary" />
          <input
            type="text"
            placeholder="Search by student, ID, ride ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-xs text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Status filter */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/5 px-3 py-2 rounded-xl text-xs">
            <span className="text-textSecondary">Gate Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-surface">All Transactions</option>
              <option value="succeeded" className="bg-surface text-accent">Succeeded</option>
              <option value="refunded" className="bg-surface text-blue-400">Refunded</option>
              <option value="failed" className="bg-surface text-emergency">Failed</option>
            </select>
          </div>

          {/* Escrow filter */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/5 px-3 py-2 rounded-xl text-xs">
            <span className="text-textSecondary">Escrow Release:</span>
            <select
              value={escrowFilter}
              onChange={(e) => setEscrowFilter(e.target.value as any)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-surface">All Escrows</option>
              <option value="held" className="bg-surface text-yellow-400">Held (Locked)</option>
              <option value="released" className="bg-surface text-accent">Released to Host</option>
              <option value="returned" className="bg-surface">Returned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-xs text-textSecondary uppercase font-semibold">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Student Info</th>
                <th className="px-6 py-4">Fare (DA)</th>
                <th className="px-6 py-4">Status & Escrow</th>
                <th className="px-6 py-4">Payment Method / Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredTxns.map((txn) => (
                <tr key={txn.id} className="hover:bg-white/[0.01] transition-colors">
                  {/* Txn ID */}
                  <td className="px-6 py-4 font-mono text-white font-semibold">
                    <div className="flex items-center space-x-1">
                      <span className="text-textSecondary font-normal">#</span>
                      <span>{txn.id}</span>
                    </div>
                  </td>

                  {/* Student */}
                  <td className="px-6 py-4">
                    <h4 className="font-bold text-white">{txn.studentName}</h4>
                    <p className="text-textSecondary mt-0.5">{txn.studentEmail}</p>
                    <code className="text-[10px] text-textSecondary font-mono mt-1 block">Ride: {txn.rideId}</code>
                  </td>

                  {/* Fare */}
                  <td className="px-6 py-4 font-bold text-white text-sm">
                    {txn.amount} DA
                  </td>

                  {/* Status / Escrow */}
                  <td className="px-6 py-4 space-y-1">
                    <div>{getStatusBadge(txn.status)}</div>
                    <div>{getEscrowBadge(txn.escrowRelease)}</div>
                  </td>

                  {/* Pymt Method / Date */}
                  <td className="px-6 py-4 text-textSecondary">
                    <span className="text-white font-medium block">{txn.paymentMethod}</span>
                    <span className="text-[10px] mt-1 block flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{txn.date}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    {txn.status === 'succeeded' && (
                      <button
                        onClick={() => triggerRefund(txn.id)}
                        className="px-2.5 py-1.5 bg-emergency/15 hover:bg-emergency/25 border border-emergency/25 text-emergency rounded-lg font-bold text-[11px] transition-all inline-flex items-center space-x-1"
                      >
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>Force Refund</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
