import React, { useState } from 'react';
import {
  Car,
  MapPin,
  Clock,
  DollarSign,
  User,
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Map
} from 'lucide-react';

interface Ride {
  id: string;
  driverName: string;
  driverAvatar: string;
  origin: string;
  destination: string;
  departureTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  status: 'active' | 'completed' | 'canceled';
  riders: string[];
  vehicle: string;
}

const mockRides: Ride[] = [
  {
    id: 'RIDE-829',
    driverName: 'Mehdi Larbi',
    driverAvatar: 'M',
    origin: 'Dar El Beïda, Alger',
    destination: 'USTHB, Bab Ezzouar',
    departureTime: '2026-05-20T08:30:00Z',
    price: 150,
    availableSeats: 2,
    totalSeats: 4,
    status: 'active',
    riders: ['Amine K.', 'Sarah B.'],
    vehicle: 'Volkswagen Golf 8 (White)'
  },
  {
    id: 'RIDE-402',
    driverName: 'Anas Rahmani',
    driverAvatar: 'A',
    origin: 'El Khroub, Constantine',
    destination: 'Université Constantine 2, Nouvelle Ville',
    departureTime: '2026-05-20T07:15:00Z',
    price: 100,
    availableSeats: 0,
    totalSeats: 4,
    status: 'active',
    riders: ['Yanis T.', 'Lamine M.', 'Feriel R.', 'Hana S.'],
    vehicle: 'Seat Leon FR (Black)'
  },
  {
    id: 'RIDE-118',
    driverName: 'Selma Ouchene',
    driverAvatar: 'S',
    origin: 'El Eulma, Sétif',
    destination: 'Université Ferhat Abbas Campus 1',
    departureTime: '2026-05-20T09:00:00Z',
    price: 200,
    availableSeats: 3,
    totalSeats: 4,
    status: 'active',
    riders: ['Bilel M.'],
    vehicle: 'Peugeot 208 Tech Edition'
  },
  {
    id: 'RIDE-771',
    driverName: 'Mehdi Larbi',
    driverAvatar: 'M',
    origin: 'Kouba, Alger',
    destination: 'USTHB, Bab Ezzouar',
    departureTime: '2026-05-19T08:30:00Z',
    price: 150,
    availableSeats: 1,
    totalSeats: 4,
    status: 'completed',
    riders: ['Amine K.', 'Sarah B.', 'Ismail H.'],
    vehicle: 'Volkswagen Golf 8 (White)'
  },
  {
    id: 'RIDE-905',
    driverName: 'Sofiane Hamadi',
    driverAvatar: 'S',
    origin: 'Bir El Djir, Oran',
    destination: 'USTO, Oran',
    departureTime: '2026-05-18T07:45:00Z',
    price: 120,
    availableSeats: 4,
    totalSeats: 4,
    status: 'canceled',
    riders: [],
    vehicle: 'Renault Clio 4 (Grey)'
  }
];

const Rides: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>(mockRides);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'canceled'>('all');
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  const filteredRides = rides.filter((ride) => {
    const matchesSearch = ride.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ride.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const cancelRide = (id: string) => {
    if (window.confirm(`Are you sure you want to administratively cancel Ride ${id}? This will notify all riders and process a full refund.`)) {
      setRides(prev => prev.map(ride => {
        if (ride.id === id) {
          return { ...ride, status: 'canceled' };
        }
        return ride;
      }));
    }
  };

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4 animate-fade-in text-[#F0F0F5] relative h-full">
      {/* Header Info */}
      <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-2xl p-3.5">
        <div>
          <h2 className="text-sm font-bold text-white">Commuter Routing</h2>
          <p className="text-[10px] text-textSecondary mt-0.5">Manage live rideshare pools</p>
        </div>
        <div className="flex items-center space-x-1.5 bg-accent/10 border border-accent/20 rounded-lg px-2 py-1 text-accent">
          <Car className="h-3.5 w-3.5" />
          <span className="text-[10px] font-bold">{filteredRides.length} Active</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-3 rounded-xl flex flex-col gap-2.5">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-textSecondary" />
          <input
            type="text"
            placeholder="Search driver, origin, univ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Dropdown status */}
        <div className="flex items-center justify-between bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-lg text-xs w-full">
          <span className="text-textSecondary">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs"
          >
            <option value="all" className="bg-surface text-white">All Rides</option>
            <option value="active" className="bg-surface text-accent">Active</option>
            <option value="completed" className="bg-surface text-blue-400">Completed</option>
            <option value="canceled" className="bg-surface text-emergency">Canceled</option>
          </select>
        </div>
      </div>

      {/* Rides List */}
      <div className="space-y-3 pb-8">
        {filteredRides.length > 0 ? (
          filteredRides.map((ride) => (
            <div
              key={ride.id}
              onClick={() => setSelectedRide(ride)}
              className={`glass-card p-4 rounded-xl cursor-pointer transition-all border ${
                selectedRide?.id === ride.id ? 'border-primary bg-primary/5' : 'border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex flex-col gap-3">
                {/* Top header line of card */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1.5 text-[9px] font-mono">
                    <span className="bg-white/5 text-textSecondary px-1.5 py-0.5 rounded border border-white/5">
                      {ride.id}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      ride.status === 'active' ? 'bg-accent/10 border border-accent/20 text-accent' :
                      ride.status === 'completed' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' :
                      'bg-emergency/10 border border-emergency/20 text-emergency'
                    }`}>
                      {ride.status}
                    </span>
                  </div>
                  {/* Price */}
                  <span className="text-xs font-bold text-accent">{ride.price} DA</span>
                </div>

                {/* Route visual path - very compact */}
                <div className="relative pl-5 space-y-1.5">
                  <div className="absolute left-2 top-1 bottom-1 w-[1px] bg-dashed border-l border-white/10"></div>
                  <div className="flex items-start text-[11px] relative">
                    <span className="absolute left-[-16px] top-1 w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span className="text-white font-medium truncate">{ride.origin}</span>
                  </div>
                  <div className="flex items-start text-[11px] relative">
                    <span className="absolute left-[-16px] top-1 w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span className="text-white font-medium truncate">{ride.destination}</span>
                  </div>
                </div>

                {/* Driver detail */}
                <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.03]">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white text-[10px]">
                      {ride.driverAvatar}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-white">{ride.driverName}</h4>
                      <p className="text-[9px] text-textSecondary max-w-[140px] truncate">{ride.vehicle}</p>
                    </div>
                  </div>

                  {/* Seats info */}
                  <span className="text-[10px] font-semibold text-white flex items-center space-x-1">
                    <Users className="h-3 w-3 text-primary" />
                    <span>{ride.totalSeats - ride.availableSeats}/{ride.totalSeats} seats</span>
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-6 rounded-xl border-dashed border-white/10 text-center flex flex-col items-center justify-center">
            <Car className="h-8 w-8 text-textSecondary mb-2" />
            <p className="text-xs text-textSecondary">No rides match your filter criteria.</p>
          </div>
        )}
      </div>

      {/* Selected Ride Detail slide-up bottom sheet overlay */}
      {selectedRide && (
        <div 
          className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedRide(null)}
        >
          <div 
            className="glass-panel w-full rounded-t-2xl p-4 border-t border-white/10 shadow-2xl animate-slide-up bg-background max-h-[85%] overflow-y-auto safe-scroll"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Heading */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Ride Operational File</h3>
                <code className="text-[9px] text-textSecondary font-mono">{selectedRide.id}</code>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                  selectedRide.status === 'active' ? 'bg-accent/15 border border-accent/20 text-accent' :
                  selectedRide.status === 'completed' ? 'bg-blue-500/15 border border-blue-500/20 text-blue-400' :
                  'bg-emergency/15 border border-emergency/20 text-emergency'
                }`}>
                  {selectedRide.status}
                </span>
                <button
                  onClick={() => setSelectedRide(null)}
                  className="text-textSecondary hover:text-white text-sm pl-1.5"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Ride timing */}
            <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 text-[11px] mt-3">
              <div className="flex items-center space-x-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span className="text-textSecondary">Departure Time:</span>
              </div>
              <span className="font-bold text-white">{formatDate(selectedRide.departureTime)}</span>
            </div>

            {/* Vehicle */}
            <div className="space-y-1.5 mt-3">
              <span className="text-[9px] text-textSecondary uppercase font-bold tracking-wider block">Host Vehicle Info</span>
              <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 flex items-center space-x-2.5 text-[11px]">
                <Car className="h-3.5 w-3.5 text-accent" />
                <div>
                  <span className="text-white font-semibold block">{selectedRide.vehicle}</span>
                  <span className="text-[9px] text-textSecondary">Verified Campus Vehicle</span>
                </div>
              </div>
            </div>

            {/* Roster list */}
            <div className="space-y-2 mt-3">
              <span className="text-[9px] text-textSecondary uppercase font-bold tracking-wider block">Booked Passengers ({selectedRide.riders.length})</span>
              {selectedRide.riders.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedRide.riders.map((rider, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white/[0.02] border border-white/5 rounded-lg text-[11px]">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center font-bold text-primary text-[9px]">
                          {rider.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{rider}</span>
                      </div>
                      <span className="text-[8px] bg-accent/20 border border-accent/20 text-accent px-1.5 py-0.5 rounded font-bold">PAID (STRIPE)</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-textSecondary italic">No student bookings registered on this route yet.</p>
              )}
            </div>

            {/* Action buttons */}
            {selectedRide.status === 'active' && (
              <div className="pt-3 border-t border-white/5 mt-4">
                <button
                  onClick={() => {
                    cancelRide(selectedRide.id);
                    setSelectedRide(null);
                  }}
                  className="w-full py-2.5 bg-emergency/15 hover:bg-emergency/20 border border-emergency/20 text-emergency font-bold text-[11px] rounded-lg transition-all flex items-center justify-center space-x-1.5"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Cancel Commute (Override)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Rides;
