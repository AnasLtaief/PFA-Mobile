import { Schema, model, Document, Types } from 'mongoose';

const ALGERIAN_WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Bejaia', 'Biskra',
  'Bechar', 'Blida', 'Bouira', 'Tamanrasset', 'Tebessa', 'Tlemcen', 'Tiaret',
  'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Setif', 'Saida', 'Skikda',
  'Sidi Bel Abbes', 'Annaba', 'Guelma', 'Constantine', 'Medea', 'Mostaganem',
  "M'Sila", 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi',
  'Bordj Bou Arreridj', 'Boumerdes', 'El Tarf', 'Tindouf', 'Tissemsilt',
  'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Ain Defla', 'Naama',
  'Ain Temouchent', 'Ghardaia', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar',
  'Ouled Djellal', 'Beni Abbes', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet',
  "El M'Ghair", 'El Meniaa',
] as const;

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  avatarUrl: string;
  bio: string;
  university: string;
  wilaya?: string;
  studentIdUrl?: string;
  isVerified: boolean;
  isHost: boolean;
  isBanned: boolean;
  twoFASecret?: string;
  twoFAEnabled: boolean;
  backupCodes: string[];
  role: 'USER' | 'ADMIN';
  emergencyContact?: {
    name?: string;
    phone?: string;
    relation?: string;
  };
  stripeAccountId?: string;
  stripeCustomerId?: string;
  friends: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500,
    },
    university: {
      type: String,
      default: '',
    },
    wilaya: {
      type: String,
      enum: ALGERIAN_WILAYAS,
    },
    studentIdUrl: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isHost: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    twoFASecret: {
      type: String,
    },
    twoFAEnabled: {
      type: Boolean,
      default: false,
    },
    backupCodes: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relation: { type: String },
    },
    stripeAccountId: {
      type: String,
    },
    stripeCustomerId: {
      type: String,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });
userSchema.index({ wilaya: 1 });
userSchema.index({ university: 1 });

export const User = model<IUser>('User', userSchema);
export default User;
