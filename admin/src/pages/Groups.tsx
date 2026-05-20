import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Search,
  CheckCircle,
  Car,
  Trash2,
  Pin,
  Compass
} from 'lucide-react';

interface WilayaGroup {
  id: string;
  name: string;
  code: number;
  memberCount: number;
  activeRidesCount: number;
  pinnedRides: string[];
  description: string;
}

const mockGroups: WilayaGroup[] = [
  {
    id: 'GRP-016',
    name: 'Alger Commuters',
    code: 16,
    memberCount: 240,
    activeRidesCount: 14,
    pinnedRides: ['RIDE-829', 'RIDE-771'],
    description: 'Central ride-sharing group for universities in Algiers (USTHB, ENS, Faculté de Médecine, Ben Aknoun).'
  },
  {
    id: 'GRP-025',
    name: 'Constantine Students Route',
    code: 25,
    memberCount: 185,
    activeRidesCount: 8,
    pinnedRides: ['RIDE-402'],
    description: 'Ride sharing & student commutes connecting El Khroub, Hamma Bouziane, and Constantine Center to Ali Mendjeli.'
  },
  {
    id: 'GRP-031',
    name: 'Oran USTO & Oran 1 sharing',
    code: 31,
    memberCount: 92,
    activeRidesCount: 4,
    pinnedRides: [],
    description: 'Official commute pool for Oran students heading to USTO and Oran 1 Senia campus.'
  },
  {
    id: 'GRP-019',
    name: 'Sétif Ferhat Abbas group',
    code: 19,
    memberCount: 110,
    activeRidesCount: 3,
    pinnedRides: ['RIDE-118'],
    description: 'Sétif student community pooling for daily rides to Campus 1 (El Bez) and Campus 2.'
  },
  {
    id: 'GRP-013',
    name: 'Tlemcen Abou Bekr pool',
    code: 13,
    memberCount: 65,
    activeRidesCount: 1,
    pinnedRides: [],
    description: 'Tlemcen regional sharing hub for students traveling from Maghnia, Remchi, and Hennaya to the university center.'
  }
];

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<WilayaGroup[]>(mockGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCode, setNewGroupCode] = useState<number>(16);
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const filteredGroups = groups.filter(grp =>
    grp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grp.code.toString().includes(searchTerm) ||
    grp.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName) return;

    const newGroup: WilayaGroup = {
      id: `GRP-0${newGroupCode}`,
      name: newGroupName,
      code: newGroupCode,
      memberCount: 0,
      activeRidesCount: 0,
      pinnedRides: [],
      description: newGroupDesc || `Ride-sharing discussion group for Wilaya of ${newGroupName}`
    };

    setGroups(prev => [newGroup, ...prev]);
    setIsCreateModalOpen(false);

    // Reset Form
    setNewGroupName('');
    setNewGroupCode(16);
    setNewGroupDesc('');
  };

  const deleteGroup = (id: string) => {
    if (window.confirm('Are you sure you want to delete this Wilaya Group? All pinned rides will be unlinked.')) {
      setGroups(prev => prev.filter(grp => grp.id !== id));
    }
  };

  return (
    <div className="space-y-4 animate-fade-in text-[#F0F0F5] pb-6">
      {/* Header Info */}
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-white">Wilaya Student Pools</h2>
          <p className="text-[11px] text-textSecondary mt-0.5 leading-relaxed">Manage state-level sharing pools and pin active commutes.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create New State Pool</span>
        </button>
      </div>

      {/* Search Filter bar */}
      <div className="glass-card p-4 rounded-xl flex flex-col gap-3">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-textSecondary" />
          <input
            type="text"
            placeholder="Search by state name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex items-center space-x-2 bg-white/5 border border-white/5 px-3 py-2 rounded-xl text-[10px]">
          <Compass className="h-3.5 w-3.5 text-accent" />
          <span className="text-textSecondary font-semibold">Active Algerian Wilayas: {groups.length}</span>
        </div>
      </div>

      {/* Groups Grid Layout */}
      <div className="grid grid-cols-1 gap-4">
        {filteredGroups.map((grp) => (
          <div key={grp.id} className="glass-card p-4 rounded-xl flex flex-col justify-between space-y-4 border border-white/5 hover:border-primary/30">
            {/* Header: Wilaya Code & Pinned indicator */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="bg-primary/10 border border-primary/20 text-primary w-9 h-9 rounded-lg flex items-center justify-center font-black text-base">
                  {grp.code}
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs leading-tight">{grp.name}</h4>
                  <span className="text-[9px] text-textSecondary font-mono uppercase font-bold tracking-wider">{grp.id}</span>
                </div>
              </div>
              <button
                onClick={() => deleteGroup(grp.id)}
                className="p-1.5 rounded-lg bg-emergency/10 border border-emergency/20 text-emergency hover:bg-emergency/20 transition-all"
                title="Remove state group"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-[11px] text-[#8A8A9E] leading-relaxed line-clamp-3">{grp.description}</p>

            {/* Stats: members & rides */}
            <div className="grid grid-cols-2 gap-3 border-y border-white/5 py-2.5 text-xs">
              <div>
                <span className="text-[9px] text-textSecondary uppercase font-bold tracking-wider block">Students</span>
                <span className="text-xs font-bold text-white mt-0.5 block flex items-center space-x-1">
                  <Users2 className="h-3.5 w-3.5 text-accent" />
                  <span>{grp.memberCount} joined</span>
                </span>
              </div>
              <div>
                <span className="text-[9px] text-textSecondary uppercase font-bold tracking-wider block">Rides Today</span>
                <span className="text-xs font-bold text-white mt-0.5 block flex items-center space-x-1">
                  <Car className="h-3.5 w-3.5 text-primary" />
                  <span>{grp.activeRidesCount} active</span>
                </span>
              </div>
            </div>

            {/* Pinned rides log */}
            <div className="space-y-1.5">
              <span className="text-[9px] text-textSecondary uppercase font-bold tracking-wider flex items-center space-x-1">
                <Pin className="h-3 w-3 text-primary rotate-45" />
                <span>Pinned active Commutes ({grp.pinnedRides.length})</span>
              </span>
              {grp.pinnedRides.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {grp.pinnedRides.map((ride, idx) => (
                    <span key={idx} className="bg-white/5 border border-white/5 text-[9px] px-1.5 py-0.5 rounded font-mono text-white font-semibold">
                      {ride}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[9px] text-textSecondary italic block">No active rides pinned.</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create State Pool Modal */}
      {isCreateModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0F]/90 backdrop-blur-md animate-fade-in overflow-y-auto safe-scroll">
          <div className="glass-panel w-full max-w-sm rounded-2xl p-5 relative border border-white/10 shadow-2xl my-auto">
            {/* Title */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-sm font-bold text-white">Create New State Pool</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-textSecondary hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateGroup} className="py-3 space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">Wilaya Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Béjaïa"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">Wilaya Code (1-58)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={58}
                  value={newGroupCode}
                  onChange={(e) => setNewGroupCode(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-primary/50 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">Description</label>
                <textarea
                  placeholder="State university hubs description..."
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-primary/50 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full mt-1 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center space-x-1.5"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Initialize Pool Channel</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
