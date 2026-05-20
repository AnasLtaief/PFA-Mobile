import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import Car from '../src/models/Car.js';
import Ride from '../src/models/Ride.js';
import Booking from '../src/models/Booking.js';
import Message from '../src/models/Message.js';
import Group from '../src/models/Group.js';
import GroupMessage from '../src/models/GroupMessage.js';
import Story from '../src/models/Story.js';
import Moment from '../src/models/Moment.js';
import Report from '../src/models/Report.js';
import FriendRequest from '../src/models/FriendRequest.js';
import Notification from '../src/models/Notification.js';

const wilayas = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Bejaia', 'Biskra', 'Bechar', 'Blida', 'Bouira',
  'Tamanrasset', 'Tebessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Setif', 'Saida',
  'Skikda', 'Sidi Bel Abbes', 'Annaba', 'Guelma', 'Constantine', 'Medea', 'Mostaganem', 'M\'Sila', 'Mascara',
  'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arreridj', 'Boumerdes', 'El Tarf', 'Tindouf', 'Tissemsilt',
  'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Ain Defla', 'Naama', 'Ain Temouchent', 'Ghardaia',
  'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Beni Abbes', 'In Salah', 'In Guezzam',
  'Touggourt', 'Djanet', 'El M\'Ghair', 'El Meniaa'
];

const seed = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Database connected.');

    // Clear all collections
    console.log('Clearing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Car.deleteMany({}),
      Ride.deleteMany({}),
      Booking.deleteMany({}),
      Message.deleteMany({}),
      Group.deleteMany({}),
      GroupMessage.deleteMany({}),
      Story.deleteMany({}),
      Moment.deleteMany({}),
      Report.deleteMany({}),
      FriendRequest.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log('Database cleared.');

    // 1. Create Admin
    console.log('Creating Admin...');
    const adminPasswordHash = await bcrypt.hash('Admin123!', 12);
    const admin = await User.create({
      fullName: 'Admin User',
      email: 'admin@campuscovoiturage.dz',
      phone: '+213555000000',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      isVerified: true,
      wilaya: 'Alger',
      university: 'USTHB',
    });
    console.log(`Admin created: ${admin.email}`);

    // 2. Create 58 Wilaya Groups
    console.log('Creating 58 Wilaya Groups...');
    const wilayaGroups: Record<string, any> = {};
    for (const w of wilayas) {
      const group = await Group.create({
        name: `Covoiturage ${w}`,
        wilaya: w,
        coverPhoto: `https://images.unsplash.com/photo-1542362567-b07eac790acd?auto=format&fit=crop&w=800&q=80`,
        description: `Groupe de covoiturage officiel pour les étudiants de la wilaya de ${w}. Partagez des trajets et rencontrez d'autres étudiants.`,
        createdBy: admin._id,
        members: [admin._id],
        admins: [admin._id],
      });
      wilayaGroups[w] = group;
    }
    console.log('58 Groups created.');

    // 3. Create 5 Student Users
    console.log('Creating 5 Student Users...');
    const studentPasswordHash = await bcrypt.hash('Student123!', 12);

    const studentsData = [
      {
        fullName: 'Ahmed Benali',
        email: 'ahmed.benali@usthb.dz',
        phone: '+213550112233',
        passwordHash: studentPasswordHash,
        wilaya: 'Alger',
        university: 'Universite des Sciences et de la Technologie Houari Boumediene (USTHB)',
        isVerified: true,
        bio: 'Étudiant en Master Informatique. Grand fan de tech et de café.',
      },
      {
        fullName: 'Fatima Zohra',
        email: 'fatima.zohra@univ-oran.dz',
        phone: '+213660223344',
        passwordHash: studentPasswordHash,
        wilaya: 'Oran',
        university: 'Universite d\'Oran 1 Ahmed Ben Bella',
        isVerified: true,
        bio: 'Étudiante en Pharmacie. J\'adore voyager et écouter de la musique.',
      },
      {
        fullName: 'Yacine Kaci',
        email: 'yacine.kaci@univ-constantine.dz',
        phone: '+213770334455',
        passwordHash: studentPasswordHash,
        wilaya: 'Constantine',
        university: 'Universite Constantine 1 Freres Mentouri',
        isVerified: true,
        bio: 'Étudiant en Architecture. Passionné de photographie et de rando.',
      },
      {
        fullName: 'Amina Boudiaf',
        email: 'amina.boudiaf@usthb.dz',
        phone: '+213551445566',
        passwordHash: studentPasswordHash,
        wilaya: 'Alger',
        university: 'Universite des Sciences et de la Technologie Houari Boumediene (USTHB)',
        isVerified: true,
        bio: 'Mathématiques appliquées. Calme et lectrice assidue.',
      },
      {
        fullName: 'Karim Hadj',
        email: 'karim.hadj@univ-oran.dz',
        phone: '+213662556677',
        passwordHash: studentPasswordHash,
        wilaya: 'Oran',
        university: 'Universite d\'Oran 1 Ahmed Ben Bella',
        isVerified: true,
        bio: 'Génie civil. Fan de foot et toujours à l\'heure.',
      },
    ];

    const students = await User.create(studentsData);
    console.log('5 Students created.');

    // Add students to their respective Wilaya groups
    for (const student of students) {
      if (student.wilaya && wilayaGroups[student.wilaya]) {
        await Group.findByIdAndUpdate(wilayaGroups[student.wilaya]._id, {
          $addToSet: { members: student._id },
        });
      }
    }

    // 4. Create 2 Host Users
    console.log('Creating 2 Host Users...');
    const hostsData = [
      {
        fullName: 'Omar Mebarki',
        email: 'omar.mebarki@usthb.dz',
        phone: '+213552998877',
        passwordHash: studentPasswordHash,
        wilaya: 'Alger',
        university: 'Universite des Sciences et de la Technologie Houari Boumediene (USTHB)',
        isVerified: true,
        isHost: true,
        bio: 'Doctorant en physique. Je fais le trajet Alger-Blida chaque jour.',
      },
      {
        fullName: 'Nadia Brahimi',
        email: 'nadia.brahimi@univ-oran.dz',
        phone: '+213664887766',
        passwordHash: studentPasswordHash,
        wilaya: 'Oran',
        university: 'Universite d\'Oran 1 Ahmed Ben Bella',
        isVerified: true,
        isHost: true,
        bio: 'Étudiante en Master Management. Conduite prudente garantie !',
      },
    ];

    const hosts = await User.create(hostsData);
    console.log('2 Host Users created.');

    // Add hosts to their groups
    for (const host of hosts) {
      if (host.wilaya && wilayaGroups[host.wilaya]) {
        await Group.findByIdAndUpdate(wilayaGroups[host.wilaya]._id, {
          $addToSet: { members: host._id },
        });
      }
    }

    // 5. Create Cars for Host Users
    console.log('Creating Cars for Hosts...');
    const car1 = await Car.create({
      userId: hosts[0]._id,
      brand: 'Dacia',
      model: 'Sandero Stepway',
      year: 2021,
      color: 'Gris Comet',
      plateNumber: '01234-121-16',
      seats: 4,
      carPhotos: ['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80'],
      isVerified: true,
    });

    const car2 = await Car.create({
      userId: hosts[1]._id,
      brand: 'Volkswagen',
      model: 'Polo',
      year: 2019,
      color: 'Blanc pur',
      plateNumber: '56789-119-31',
      seats: 4,
      carPhotos: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'],
      isVerified: true,
    });
    console.log('Cars created.');

    // 6. Create 10 Rides (mix of PENDING, ACTIVE, COMPLETED, CANCELLED)
    console.log('Creating Rides...');
    const ridesData = [
      {
        hostId: hosts[0]._id,
        carId: car1._id,
        origin: { name: 'USTHB (Bab Ezzouar)', coordinates: { type: 'Point', coordinates: [3.1812, 36.7118] } },
        destination: { name: 'Blida Centre', coordinates: { type: 'Point', coordinates: [2.8290, 36.4700] } },
        wilaya: 'Alger',
        departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        pricePerSeat: 200,
        availableSeats: 4,
        status: 'PENDING',
        paymentType: 'CASH',
        route: [{ lat: 36.7118, lng: 3.1812 }, { lat: 36.4700, lng: 2.8290 }],
      },
      {
        hostId: hosts[0]._id,
        carId: car1._id,
        origin: { name: 'Alger (Grande Poste)', coordinates: { type: 'Point', coordinates: [3.0588, 36.7753] } },
        destination: { name: 'Boumerdes (Université)', coordinates: { type: 'Point', coordinates: [3.4735, 36.7588] } },
        wilaya: 'Alger',
        departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
        pricePerSeat: 150,
        availableSeats: 3,
        status: 'PENDING',
        paymentType: 'CARD',
        route: [{ lat: 36.7753, lng: 3.0588 }, { lat: 36.7588, lng: 3.4735 }],
      },
      {
        hostId: hosts[1]._id,
        carId: car2._id,
        origin: { name: 'Oran (USTO)', coordinates: { type: 'Point', coordinates: [-0.5956, 35.6989] } },
        destination: { name: 'Mostaganem Centre', coordinates: { type: 'Point', coordinates: [0.0890, 35.9312] } },
        wilaya: 'Oran',
        departureTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
        pricePerSeat: 250,
        availableSeats: 4,
        status: 'PENDING',
        paymentType: 'CASH',
        route: [{ lat: 35.6989, lng: -0.5956 }, { lat: 35.9312, lng: 0.0890 }],
      },
      {
        hostId: hosts[1]._id,
        carId: car2._id,
        origin: { name: 'Oran (Plaza)', coordinates: { type: 'Point', coordinates: [-0.6300, 35.7000] } },
        destination: { name: 'Tlemcen Centre', coordinates: { type: 'Point', coordinates: [-1.3167, 34.8783] } },
        wilaya: 'Oran',
        departureTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // Started 3h ago (Active)
        pricePerSeat: 400,
        availableSeats: 2,
        status: 'ACTIVE',
        paymentType: 'CARD',
        route: [{ lat: 35.7000, lng: -0.6300 }, { lat: 34.8783, lng: -1.3167 }],
      },
      {
        hostId: hosts[0]._id,
        carId: car1._id,
        origin: { name: 'Constantine Centre', coordinates: { type: 'Point', coordinates: [6.6147, 36.3650] } },
        destination: { name: 'Setif El Eulma', coordinates: { type: 'Point', coordinates: [5.6883, 36.1550] } },
        wilaya: 'Constantine',
        departureTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Completed yesterday
        pricePerSeat: 300,
        availableSeats: 0,
        status: 'COMPLETED',
        paymentType: 'CASH',
      },
      {
        hostId: hosts[1]._id,
        carId: car2._id,
        origin: { name: 'Oran (Sénia)', coordinates: { type: 'Point', coordinates: [-0.6212, 35.6511] } },
        destination: { name: 'Sidi Bel Abbès', coordinates: { type: 'Point', coordinates: [-0.6301, 35.1899] } },
        wilaya: 'Oran',
        departureTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
        pricePerSeat: 200,
        availableSeats: 4,
        status: 'PENDING',
        paymentType: 'CASH',
      },
      {
        hostId: hosts[0]._id,
        carId: car1._id,
        origin: { name: 'Alger (Kouba)', coordinates: { type: 'Point', coordinates: [3.0782, 36.7265] } },
        destination: { name: 'Tipaza (Ruines)', coordinates: { type: 'Point', coordinates: [2.4475, 36.5924] } },
        wilaya: 'Alger',
        departureTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        pricePerSeat: 180,
        availableSeats: 4,
        status: 'PENDING',
        paymentType: 'CASH',
      },
      {
        hostId: hosts[1]._id,
        carId: car2._id,
        origin: { name: 'Oran (Centre)', coordinates: { type: 'Point', coordinates: [-0.6331, 35.6971] } },
        destination: { name: 'Mascara', coordinates: { type: 'Point', coordinates: [0.1333, 35.4000] } },
        wilaya: 'Oran',
        departureTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        pricePerSeat: 200,
        availableSeats: 4,
        status: 'PENDING',
        paymentType: 'CARD',
      },
      {
        hostId: hosts[0]._id,
        carId: car1._id,
        origin: { name: 'Alger Centre', coordinates: { type: 'Point', coordinates: [3.0588, 36.7753] } },
        destination: { name: 'Tizi Ouzou (Univ)', coordinates: { type: 'Point', coordinates: [4.0500, 36.7000] } },
        wilaya: 'Alger',
        departureTime: new Date(),
        pricePerSeat: 250,
        availableSeats: 4,
        status: 'CANCELLED',
        paymentType: 'CASH',
      },
      {
        hostId: hosts[0]._id,
        carId: car1._id,
        origin: { name: 'Constantine Centre', coordinates: { type: 'Point', coordinates: [6.6147, 36.3650] } },
        destination: { name: 'Batna Centre', coordinates: { type: 'Point', coordinates: [6.1736, 35.5558] } },
        wilaya: 'Constantine',
        departureTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
        pricePerSeat: 220,
        availableSeats: 4,
        status: 'PENDING',
        paymentType: 'CASH',
      }
    ];

    const rides = await Ride.create(ridesData);
    console.log('10 Rides created.');

    // 7. Create bookings
    console.log('Creating Bookings...');
    const bookingsData = [
      {
        rideId: rides[0]._id, // Alger -> Blida (Pending)
        passengerId: students[0]._id, // Ahmed
        seats: 2,
        status: 'ACCEPTED',
        paymentStatus: 'CASH',
      },
      {
        rideId: rides[0]._id,
        passengerId: students[3]._id, // Amina
        seats: 1,
        status: 'PENDING',
        paymentStatus: 'CASH',
      },
      {
        rideId: rides[1]._id, // Alger -> Boumerdes (Pending, Card)
        passengerId: students[0]._id,
        seats: 1,
        status: 'ACCEPTED',
        paymentStatus: 'PAID',
        stripePaymentIntentId: 'pi_mock_12345',
      },
      {
        rideId: rides[3]._id, // Oran -> Tlemcen (Active)
        passengerId: students[1]._id, // Fatima
        seats: 2,
        status: 'ACCEPTED',
        paymentStatus: 'PAID',
        stripePaymentIntentId: 'pi_mock_67890',
      },
      {
        rideId: rides[2]._id, // Oran -> Mosta (Pending)
        passengerId: students[4]._id, // Karim
        seats: 1,
        status: 'REJECTED',
        paymentStatus: 'CASH',
      }
    ];

    const bookings = await Booking.create(bookingsData);
    console.log('5 Bookings created.');

    // 8. Create Stories (mix of expired and active)
    console.log('Creating Stories...');
    const storiesData = [
      {
        userId: students[0]._id,
        mediaUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80',
        mediaType: 'IMAGE',
        caption: 'En route pour l\'USTHB ☀️',
        expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000), // expires in 18h
      },
      {
        userId: students[1]._id,
        mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=80',
        mediaType: 'IMAGE',
        caption: 'Révision avant le contrôle... 📝',
        expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000),
      },
      {
        userId: hosts[0]._id,
        mediaUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80',
        mediaType: 'IMAGE',
        caption: 'Places disponibles Alger -> Blida, départ à 14h !',
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
      {
        userId: students[2]._id,
        mediaUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&q=80',
        mediaType: 'IMAGE',
        caption: 'Constantine la nuit ✨',
        expiresAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Expired 2h ago
      },
      {
        userId: students[4]._id,
        mediaUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=500&q=80',
        mediaType: 'IMAGE',
        caption: 'Ancienne story expirée',
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Expired 24h ago
      }
    ];

    await Story.create(storiesData);
    console.log('5 Stories created.');

    // 9. Create Moments tied to rides
    console.log('Creating Moments...');
    const momentsData = [
      {
        rideId: rides[3]._id, // Active ride Oran -> Tlemcen
        userId: students[1]._id, // Passenger Fatima
        mediaUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
        caption: 'Super ambiance sur l\'autoroute d\'Oran ! 🚗💨',
        likes: [hosts[1]._id, students[0]._id],
      },
      {
        rideId: rides[3]._id,
        userId: hosts[1]._id, // Host Nadia
        mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        caption: 'Café gratuit pour mes passagers ce matin ☕️',
        likes: [students[1]._id],
      },
      {
        rideId: rides[4]._id, // Completed ride
        userId: hosts[0]._id, // Omar
        mediaUrl: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80',
        caption: 'Arrivés à Sétif sous un beau soleil !',
        likes: [],
      }
    ];

    await Moment.create(momentsData);
    console.log('3 Moments created.');

    // 10. Create Reports
    console.log('Creating Reports...');
    await Report.create([
      {
        reporterId: students[0]._id, // Ahmed
        reportedUserId: hosts[0]._id, // Omar
        rideId: rides[0]._id,
        reason: 'UNSAFE_DRIVING',
        description: 'Le conducteur roulait à plus de 140 km/h sur la rocade sud et consultait son téléphone.',
        evidencePhotos: ['https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80'],
        status: 'PENDING',
      },
      {
        reporterId: students[1]._id, // Fatima
        reportedUserId: students[4]._id, // Karim
        reason: 'HARASSMENT',
        description: 'Messages harcelants répétitifs après un covoiturage annulé.',
        status: 'RESOLVED',
        adminNote: 'Avertissement envoyé à Karim Hadj. Dossier classé.',
        resolvedBy: admin._id,
      }
    ]);
    console.log('2 Reports created.');

    // 11. Create sample DMs
    console.log('Creating DMs...');
    const dmPayloads = [
      { senderId: students[0]._id, receiverId: hosts[0]._id, content: 'Bonjour Omar, le départ de l\'USTHB est toujours maintenu pour 14h ?', isRead: true },
      { senderId: hosts[0]._id, receiverId: students[0]._id, content: 'Salut Ahmed. Oui, pile devant la faculté d\'informatique.', isRead: true },
      { senderId: students[0]._id, receiverId: hosts[0]._id, content: 'Parfait, je serai là à 13h50. Merci !', isRead: false },

      { senderId: students[1]._id, receiverId: hosts[1]._id, content: 'Bonjour Nadia, puis-je emporter une valise moyenne ?', isRead: true },
      { senderId: hosts[1]._id, receiverId: students[1]._id, content: 'Bonjour Fatima, oui pas de soucis, le coffre de la Polo est assez grand.', isRead: true },
    ];

    await Message.create(dmPayloads);
    console.log('DMs created.');

    // 12. Create sample Group Messages
    console.log('Creating Group Messages...');
    const groupAlgiers = wilayaGroups['Alger'];
    const groupOran = wilayaGroups['Oran'];

    await GroupMessage.create([
      { groupId: groupAlgiers._id, senderId: students[0]._id, content: 'Quelqu\'un part de Bab Ezzouar vers Bouira ce week-end ?' },
      { groupId: groupAlgiers._id, senderId: students[3]._id, content: 'Moi je descends vendredi vers 15h s\'il y a des intéressés.' },
      { groupId: groupOran._id, senderId: students[1]._id, content: 'Covoiturage Oran-Tlemcen régulier dispo !' }
    ]);
    console.log('Group Messages created.');

    // 13. Friend Requests
    console.log('Creating Friend Requests...');
    await FriendRequest.create([
      { senderId: students[0]._id, receiverId: students[1]._id, status: 'PENDING' },
      { senderId: students[2]._id, receiverId: students[0]._id, status: 'ACCEPTED' }
    ]);
    console.log('Friend Requests created.');

    // Connect the friendship established above in users lists
    await User.findByIdAndUpdate(students[2]._id, { $addToSet: { friends: students[0]._id } });
    await User.findByIdAndUpdate(students[0]._id, { $addToSet: { friends: students[2]._id } });

    console.log('SEEDING COMPLETED SUCCESSFULLY 🎉');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
};

seed();
