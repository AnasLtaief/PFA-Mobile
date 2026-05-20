import React, { useState } from 'react';
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  FileText,
  CheckCircle,
  XCircle,
  MoreVertical,
  ChevronDown,
  Shield,
  MapPin,
  School,
  Lock,
  Mail,
  Phone,
  UserPlus
} from 'lucide-react';

interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  wilaya: string;
  status: 'active' | 'banned' | 'pending_verification';
  isDriver: boolean;
  driverLicense?: string;
  licensePlate?: string;
  vehicleModel?: string;
  joinedDate: string;
}

const mockStudents: Student[] = [
  {
    id: 'STU-001',
    fullName: 'Anas Rahmani',
    email: 'a.rahmani@univ-constantine2.dz',
    phone: '+213 555 12 34 56',
    university: 'Université Abdelhamid Mehri Constantine 2',
    wilaya: 'Constantine (25)',
    status: 'pending_verification',
    isDriver: true,
    driverLicense: 'DL-2591048-A',
    licensePlate: '01234 112 25',
    vehicleModel: 'Seat Leon FR (Black, 2021)',
    joinedDate: '2026-01-15',
  },
  {
    id: 'STU-002',
    fullName: 'Meriem Belkacem',
    email: 'm.belkacem@usthb.dz',
    phone: '+213 661 98 76 54',
    university: 'USTHB (Alger)',
    wilaya: 'Alger (16)',
    status: 'active',
    isDriver: false,
    joinedDate: '2026-02-10',
  },
  {
    id: 'STU-003',
    fullName: 'Mehdi Larbi',
    email: 'm.larbi@univ-oran1.dz',
    phone: '+213 770 45 67 89',
    university: 'Université d\'Oran 1',
    wilaya: 'Oran (31)',
    status: 'active',
    isDriver: true,
    driverLicense: 'DL-3104928-B',
    licensePlate: '56789 119 31',
    vehicleModel: 'Volkswagen Golf 8 (White, 2022)',
    joinedDate: '2026-03-01',
  },
  {
    id: 'STU-004',
    fullName: 'Amine Bensaoud',
    email: 'a.bensaoud@univ-tlemcen.dz',
    phone: '+213 552 33 44 55',
    university: 'Université Abou Bekr Belkaïd Tlemcen',
    wilaya: 'Tlemcen (13)',
    status: 'banned',
    isDriver: false,
    joinedDate: '2026-01-20',
  },
  {
    id: 'STU-005',
    fullName: 'Selma Ouchene',
    email: 's.ouchene@univ-setif.dz',
    phone: '+213 663 88 77 66',
    university: 'Université Ferhat Abbas Sétif 1',
    wilaya: 'Sétif (19)',
    status: 'active',
    isDriver: true,
    driverLicense: 'DL-1994012-C',
    licensePlate: '44556 120 19',
    vehicleModel: 'Peugeot 208 Tech Edition (Grey, 2020)',
    joinedDate: '2026-03-12',
  }
];

const Users: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned' | 'pending'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'passenger' | 'driver'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    email: '',
    phone: '',
    university: 'USTHB (Alger)',
    wilaya: 'Alger (16)',
    isDriver: false,
    driverLicense: '',
    licensePlate: '',
    vehicleModel: '',
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.fullName || !newStudent.email || !newStudent.phone) {
      alert('Please fill in all required fields.');
      return;
    }

    const studentToAdd: Student = {
      id: `STU-00${students.length + 1}`,
      fullName: newStudent.fullName,
      email: newStudent.email,
      phone: newStudent.phone,
      university: newStudent.university,
      wilaya: newStudent.wilaya,
      status: 'active',
      isDriver: newStudent.isDriver,
      driverLicense: newStudent.isDriver ? newStudent.driverLicense || 'DL-2591048-A' : undefined,
      licensePlate: newStudent.isDriver ? newStudent.licensePlate || '01234 112 25' : undefined,
      vehicleModel: newStudent.isDriver ? newStudent.vehicleModel || 'Seat Leon FR (Black, 2021)' : undefined,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setStudents([studentToAdd, ...students]);
    setIsAddModalOpen(false);
    setNewStudent({
      fullName: '',
      email: '',
      phone: '',
      university: 'USTHB (Alger)',
      wilaya: 'Alger (16)',
      isDriver: false,
      driverLicense: '',
      licensePlate: '',
      vehicleModel: '',
    });
  };

  // Filter students based on search term and dropdown filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.wilaya.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && student.status === 'active') ||
      (statusFilter === 'banned' && student.status === 'banned') ||
      (statusFilter === 'pending' && student.status === 'pending_verification');

    const matchesRole = roleFilter === 'all' ||
      (roleFilter === 'driver' && student.isDriver) ||
      (roleFilter === 'passenger' && !student.isDriver);

    return matchesSearch && matchesStatus && matchesRole;
  });

  const toggleBanStatus = (id: string) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        const newStatus = student.status === 'banned' ? 'active' : 'banned';
        return { ...student, status: newStatus };
      }
      return student;
    }));
  };

  const handleVerifyDriver = (id: string, approve: boolean) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        return {
          ...student,
          status: approve ? 'active' : 'banned',
        };
      }
      return student;
    }));
    setIsVerifyModalOpen(false);
    setSelectedStudent(null);
  };

  const openVerifyModal = (student: Student) => {
    setSelectedStudent(student);
    setIsVerifyModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#F0F0F5]">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Registered Students</h2>
          <p className="text-xs text-textSecondary mt-1">Review student details, manage ban requests, and verify driver credentials</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-lg shadow-primary/20 transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
          <div className="flex items-center space-x-2 bg-white/5 border border-white/5 rounded-xl px-4 py-2">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-white">{filteredStudents.length} Students Matching</span>
          </div>
        </div>
      </div>

      {/* Filters Control Panel */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-textSecondary" />
          <input
            type="text"
            placeholder="Search by name, university, wilaya..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-xs text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Action Dropdowns */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Status filter */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/5 px-3 py-2 rounded-xl text-xs">
            <span className="text-textSecondary">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-surface">All Statuses</option>
              <option value="active" className="bg-surface text-accent">Active</option>
              <option value="banned" className="bg-surface text-emergency">Banned</option>
              <option value="pending" className="bg-surface text-yellow-400">Pending Verification</option>
            </select>
          </div>

          {/* Role filter */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/5 px-3 py-2 rounded-xl text-xs">
            <span className="text-textSecondary">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-surface">All Roles</option>
              <option value="passenger" className="bg-surface">Passengers Only</option>
              <option value="driver" className="bg-surface text-primary">Drivers Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid/Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-xs text-textSecondary uppercase font-semibold">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Wilaya & Academic Inst.</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Role / Vehicle</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-white/[0.01] transition-colors">
                  {/* Name / Email */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white">
                        {student.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{student.fullName}</h4>
                        <div className="flex items-center space-x-1.5 text-textSecondary mt-0.5">
                          <Mail className="h-3 w-3" />
                          <span>{student.email}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-textSecondary mt-0.5">
                          <Phone className="h-3 w-3" />
                          <span>{student.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* University / Wilaya */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 text-white font-medium">
                      <School className="h-3.5 w-3.5 text-primary" />
                      <span>{student.university}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-textSecondary mt-1">
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                      <span>{student.wilaya}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    {student.status === 'active' && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-accent/10 border border-accent/20 text-accent">
                        Active
                      </span>
                    )}
                    {student.status === 'banned' && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emergency/10 border border-emergency/20 text-emergency">
                        Banned
                      </span>
                    )}
                    {student.status === 'pending_verification' && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                        Pending Driver Verify
                      </span>
                    )}
                  </td>

                  {/* Role / License */}
                  <td className="px-6 py-4">
                    {student.isDriver ? (
                      <div className="space-y-1">
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-primary/20 text-primary border border-primary/20">
                          Driver
                        </span>
                        {student.vehicleModel && (
                          <p className="text-[11px] text-textSecondary font-semibold">{student.vehicleModel}</p>
                        )}
                        {student.licensePlate && (
                          <code className="text-[10px] bg-white/5 border border-white/5 px-1.5 py-0.5 rounded text-white font-mono">{student.licensePlate}</code>
                        )}
                      </div>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-white/5 text-textSecondary border border-white/5">
                        Passenger
                      </span>
                    )}
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {student.status === 'pending_verification' && (
                        <button
                          onClick={() => openVerifyModal(student)}
                          className="px-2.5 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary hover:text-white rounded-lg transition-all font-semibold flex items-center space-x-1"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>Review Driver Credentials</span>
                        </button>
                      )}

                      <button
                        onClick={() => toggleBanStatus(student.id)}
                        className={`p-2 rounded-lg border transition-all ${
                          student.status === 'banned'
                            ? 'bg-accent/10 border-accent/20 text-accent hover:bg-accent/20'
                            : 'bg-emergency/10 border-emergency/20 text-emergency hover:bg-emergency/20'
                        }`}
                        title={student.status === 'banned' ? 'Unban Student' : 'Ban Student'}
                      >
                        {student.status === 'banned' ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Credentials Verification Modal */}
      {isVerifyModalOpen && selectedStudent && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0F]/90 backdrop-blur-md animate-fade-in overflow-y-auto safe-scroll">
          <div className="glass-panel w-full max-w-sm rounded-xl p-5 relative overflow-hidden border border-white/10 shadow-2xl my-auto">
            {/* Title */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="text-sm font-bold text-white">Verify Driver Account</h3>
                <p className="text-[11px] text-textSecondary mt-0.5">{selectedStudent.fullName}</p>
              </div>
              <button
                onClick={() => {
                  setIsVerifyModalOpen(false);
                  setSelectedStudent(null);
                }}
                className="text-textSecondary hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Document details */}
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-[9px] text-textSecondary uppercase font-bold tracking-wider block">University</span>
                  <span className="text-[10px] text-white font-semibold mt-0.5 block truncate">{selectedStudent.university}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-[9px] text-textSecondary uppercase font-bold tracking-wider block">Wilaya</span>
                  <span className="text-[10px] text-white font-semibold mt-0.5 block truncate">{selectedStudent.wilaya}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-textSecondary uppercase font-bold tracking-wider block">License Card</span>
                    <span className="text-[10px] font-mono text-white font-bold mt-0.5 block">{selectedStudent.driverLicense}</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-accent/25 border border-accent/20 text-accent rounded text-[8px] font-bold">DL CARD</span>
                </div>

                <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-textSecondary uppercase font-bold tracking-wider block">License Plate</span>
                    <span className="text-[10px] font-mono text-white font-bold mt-0.5 block">{selectedStudent.licensePlate}</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-primary/25 border border-primary/20 text-primary rounded text-[8px] font-bold">VEHICLE</span>
                </div>

                <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">
                  <span className="text-[9px] text-textSecondary uppercase font-bold tracking-wider block">Vehicle Model</span>
                  <span className="text-[10px] text-white font-semibold mt-0.5 block">{selectedStudent.vehicleModel}</span>
                </div>
              </div>

              {/* ID / Card mock photo display */}
              <div className="border border-dashed border-white/10 rounded-lg p-3 bg-white/[0.02] text-center">
                <p className="text-[10px] text-textSecondary">Verification Photo</p>
                <div className="mt-2 inline-flex items-center space-x-1.5 bg-accent/10 border border-accent/20 text-accent px-3 py-1 rounded-lg text-[9px] font-bold">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Face Match Confirmed 98.4%</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/5">
              <button
                onClick={() => handleVerifyDriver(selectedStudent.id, false)}
                className="px-3 py-1.5 bg-emergency/15 hover:bg-emergency/20 border border-emergency/20 text-emergency rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Reject</span>
              </button>
              <button
                onClick={() => handleVerifyDriver(selectedStudent.id, true)}
                className="px-3.5 py-2 bg-primary hover:bg-primary/95 text-white rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1 shadow-lg shadow-primary/20"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Approve & Verify</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student User Modal */}
      {isAddModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in overflow-y-auto safe-scroll">
          <div className="glass-panel w-full max-w-sm rounded-xl p-5 relative overflow-hidden border border-white/10 shadow-2xl my-auto">
            {/* Title */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="text-sm font-bold text-white">Add New Student</h3>
                <p className="text-[10px] text-textSecondary mt-0.5">Quickly provision a student or driver account for testing.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-textSecondary hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddStudent} className="py-4 space-y-3.5 text-left">
              <div className="space-y-1">
                <label className="text-[9px] text-textSecondary uppercase font-bold tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmed Benali"
                  value={newStudent.fullName}
                  onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[9px] text-textSecondary uppercase font-bold tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. a.benali@usthb.dz"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-textSecondary uppercase font-bold tracking-wider">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +213 550 11 22 33"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[9px] text-textSecondary uppercase font-bold tracking-wider">University</label>
                  <select
                    value={newStudent.university}
                    onChange={(e) => setNewStudent({ ...newStudent, university: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="USTHB (Alger)">USTHB (Alger)</option>
                    <option value="Université d'Oran 1">Université d'Oran 1</option>
                    <option value="Université Abdelhamid Mehri Constantine 2">Université Constantine 2</option>
                    <option value="Université Abou Bekr Belkaïd Tlemcen">Université Tlemcen</option>
                    <option value="Université Ferhat Abbas Sétif 1">Université Sétif 1</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-textSecondary uppercase font-bold tracking-wider">Wilaya</label>
                  <select
                    value={newStudent.wilaya}
                    onChange={(e) => setNewStudent({ ...newStudent, wilaya: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="Alger (16)">Alger (16)</option>
                    <option value="Oran (31)">Oran (31)</option>
                    <option value="Constantine (25)">Constantine (25)</option>
                    <option value="Tlemcen (13)">Tlemcen (13)</option>
                    <option value="Sétif (19)">Sétif (19)</option>
                  </select>
                </div>
              </div>

              {/* Role Toggle Option */}
              <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-white font-bold block">Register as Driver (Host)</span>
                  <span className="text-[9px] text-textSecondary block">Check this if the student has a verified vehicle.</span>
                </div>
                <input
                  type="checkbox"
                  checked={newStudent.isDriver}
                  onChange={(e) => setNewStudent({ ...newStudent, isDriver: e.target.checked })}
                  className="w-4 h-4 rounded border-white/5 bg-white/5 text-primary focus:ring-primary focus:ring-offset-background cursor-pointer"
                />
              </div>

              {/* Driver-specific details */}
              {newStudent.isDriver && (
                <div className="space-y-2.5 p-2.5 bg-white/5 border border-white/5 rounded-xl animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-[9px] text-textSecondary uppercase font-bold tracking-wider">Driver License Code</label>
                    <input
                      type="text"
                      placeholder="e.g. DL-2591048-A"
                      value={newStudent.driverLicense}
                      onChange={(e) => setNewStudent({ ...newStudent, driverLicense: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-textSecondary uppercase font-bold tracking-wider">Vehicle Model</label>
                      <input
                        type="text"
                        placeholder="e.g. Dacia Sandero"
                        value={newStudent.vehicleModel}
                        onChange={(e) => setNewStudent({ ...newStudent, vehicleModel: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white/5 border border-white/5 rounded-xl text-xs text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-textSecondary uppercase font-bold tracking-wider">License Plate</label>
                      <input
                        type="text"
                        placeholder="e.g. 01234 121 16"
                        value={newStudent.licensePlate}
                        onChange={(e) => setNewStudent({ ...newStudent, licensePlate: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white/5 border border-white/5 rounded-xl text-xs text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-[10px] font-bold transition-all shadow-lg shadow-primary/20"
                >
                  Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
