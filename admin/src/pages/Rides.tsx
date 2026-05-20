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
    <div className="space-y-6 animate-fade-in text-[#F0F0F5]">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Active Commuter Rides</h2>
          <p className="text-xs text-textSecondary mt-1">Monitor active commuter routes, coordinate passenger seats, and manage ride issues</p>
        </div>
        <div className="flex items-center space-x-2 bg-white/5 border border-white/5 rounded-xl px-4 py-2">
          <Car className="h-4 w-4 text-accent" />
          <span className="text-xs font-semibold text-white">{filteredRides.length} Active Routes Listed</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-textSecondary" />
          <input
            type="text"
            placeholder="Search by driver, origin, university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-xs text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Dropdown status */}
        <div className="flex items-center space-x-2 bg-white/5 border border-white/5 px-3 py-2 rounded-xl text-xs w-full md:w-auto justify-between">
          <span className="text-textSecondary">Ride Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-surface">All Rides</option>
            <option value="active" className="bg-surface text-accent">Active</option>
            <option value="completed" className="bg-surface text-blue-400">Completed</option>
            <option value="canceled" className="bg-surface text-emergency">Canceled</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rides List (Left side, takes 2/3 space) */}
        <div className="lg:col-span-2 space-y-4">
          {filteredRides.map((ride) => (
            <div
              key={ride.id}
              onClick={() => setSelectedRide(ride)}
              className={`glass-card p-5 rounded-2xl cursor-pointer transition-all border ${
                selectedRide?.id === ride.id ? 'border-primary bg-primary/5' : 'border-white/5'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Route detail */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-2 text-[10px] font-mono">
                    <span className="bg-white/5 text-textSecondary px-2 py-0.5 rounded border border-white/5">
                      {ride.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      ride.status === 'active' ? 'bg-accent/10 border border-accent/20 text-accent' :
                      ride.status === 'completed' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' :
                      'bg-emergency/10 border border-emergency/20 text-emergency'
                    }`}>
                      {ride.status}
                    </span>
                  </div>

                  {/* Route Visual Path */}
                  <div className="relative pl-6 space-y-2.5">
                    {/* Visual Line */}
                    <div className="absolute left-2.5 top-1.5 bottom-1.5 w-0.5 bg-dashed border-l border-white/10"></div>

                    {/* Origin */}
                    <div className="flex items-start text-xs">
                      <MapPin className="absolute left-1 h-3.5 w-3.5 text-accent mt-0.5" />
                      <div>
                        <p className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">Origin</p>
                        <p className="text-white font-semibold mt-0.5">{ride.origin}</p>
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="flex items-start text-xs">
                      <MapPin className="absolute left-1 h-3.5 w-3.5 text-primary mt-0.5" />
                      <div>
                        <p className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">Destination (University)</p>
                        <p className="text-white font-semibold mt-0.5">{ride.destination}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Driver / Specs */}
                <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-white/5 pt-4 md:pt-0 gap-3 md:min-w-[180px]">
                  {/* Driver avatar and name */}
                  <div className="flex items-center space-x-2 text-right md:justify-end w-full">
                    <div>
                      <h4 className="text-sm font-bold text-white">{ride.driverName}</h4>
                      <p className="text-[11px] text-textSecondary">{ride.vehicle}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white">
                      {ride.driverAvatar}
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="text-right">
                      <span className="text-[10px] text-textSecondary block uppercase font-bold">Price</span>
                      <span className="text-sm font-bold text-accent">{ride.price} DA</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-textSecondary block uppercase font-bold">Seats</span>
                      <span className="text-sm font-bold text-white flex items-center space-x-1 justify-end">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        <span>{ride.totalSeats - ride.availableSeats}/{ride.totalSeats}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Ride Detail view (Right side, takes 1/3 space) */}
        <div>
          {selectedRide ? (
            <div className="glass-card p-6 rounded-2xl space-y-6 sticky top-24 border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
              {/* Heading */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Ride Operational File</h3>
                  <code className="text-[10px] text-textSecondary font-mono">{selectedRide.id}</code>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  selectedRide.status === 'active' ? 'bg-accent/15 border border-accent/20 text-accent' :
                  selectedRide.status === 'completed' ? 'bg-blue-500/15 border border-blue-500/20 text-blue-400' :
                  'bg-emergency/15 border border-emergency/20 text-emergency'
                }`}>
                  {selectedRide.status}
                </span>
              </div>

              {/* Ride timing */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-xs">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-textSecondary">Departure Time:</span>
                </div>
                <span className="font-bold text-white">{formatDate(selectedRide.departureTime)}</span>
              </div>

              {/* Vehicle */}
              <div className="space-y-2">
                <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider">Host Vehicle Info</span>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center space-x-3 text-xs">
                  <Car className="h-4 w-4 text-accent" />
                  <div>
                    <span className="text-white font-semibold block">{selectedRide.vehicle}</span>
                    <span className="text-[10px] text-textSecondary">Verified Ride Share</span>
                  </div>
                </div>
              </div>

              {/* Roster list */}
              <div className="space-y-3">
                <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider block">Booked Passengers ({selectedRide.riders.length})</span>
                {selectedRide.riders.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRide.riders.map((rider, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-white/[0.02] hover:bg-white/5 border border-white/5 rounded-xl transition-all text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center font-bold text-primary text-[10px]">
                            {rider.charAt(0)}
                          </div>
                          <span className="text-white font-medium">{rider}</span>
                        </div>
                        <span className="text-[10px] bg-accent/20 border border-accent/20 text-accent px-1.5 py-0.5 rounded font-bold">PAID (STRIPE)</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-textSecondary italic">No student bookings registered on this route yet.</p>
                )}
              </div>

              {/* Action buttons */}
              {selectedRide.status === 'active' && (
                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={() => cancelRide(selectedRide.id)}
                    className="w-full py-3 bg-emergency/15 hover:bg-emergency/20 border border-emergency/20 text-emergency font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Cancel Commute (Administrative Override)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-8 rounded-2xl border-dashed border-white/10 text-center flex flex-col items-center justify-center h-80">
              <Map className="h-10 w-10 text-textSecondary mb-3 animate-pulse" />
              <p className="text-xs text-textSecondary">Select any ride route from the dashboard feed to review bookings, timing details, and operational options.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rides;
