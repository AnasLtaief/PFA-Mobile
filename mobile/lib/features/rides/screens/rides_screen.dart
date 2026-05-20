import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/custom_button.dart';
import '../../../core/theme/widgets/glass_card.dart';
import '../../auth/providers/auth_provider.dart';

class RidesScreen extends ConsumerStatefulWidget {
  const RidesScreen({super.key});

  @override
  ConsumerState<RidesScreen> createState() => _RidesScreenState();
}

class _RidesScreenState extends ConsumerState<RidesScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> _mockBookings = [
    {
      'id': 'booking1',
      'host': 'Sara Benzaid',
      'origin': 'Kouba, Algiers',
      'destination': 'USTHB University, Bab Ezzouar',
      'date': 'May 22, 2026',
      'time': '07:45 AM',
      'status': 'ACCEPTED',
      'price': '200 DA',
    },
  ];

  final List<Map<String, dynamic>> _mockMyRides = [
    {
      'id': 'ride1',
      'origin': 'Zouaghi Slimane, Constantine',
      'destination': 'University Constantine 2',
      'date': 'May 23, 2026',
      'time': '08:30 AM',
      'passengers': 2,
      'status': 'ACTIVE',
      'price': '150 DA',
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  const Text(
                    'Commutes',
                    style: TextStyle(
                      fontFamily: 'Syne',
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const Spacer(),
                  if (authState.user?.isHost == true)
                    IconButton(
                      icon: const Icon(Icons.add_circle, color: Color(0xff6c63ff), size: 32),
                      onPressed: () => context.push('/rides/create'),
                    ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Track your upcoming bookings or manage rides you are hosting',
                style: TextStyle(
                  fontFamily: 'PlusJakartaSans',
                  color: Colors.grey[500],
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 24),
              Container(
                decoration: BoxDecoration(
                  color: const Color(0xff13131a),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: TabBar(
                  controller: _tabController,
                  indicator: BoxDecoration(
                    color: const Color(0xff6c63ff),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  labelColor: Colors.white,
                  unselectedLabelColor: Colors.grey[500],
                  labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontFamily: 'PlusJakartaSans'),
                  indicatorSize: TabBarIndicatorSize.tab,
                  dividerColor: Colors.transparent,
                  tabs: const [
                    Tab(text: 'Bookings'),
                    Tab(text: 'My Rides'),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _buildBookingsTab(),
                    _buildMyRidesTab(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBookingsTab() {
    if (_mockBookings.isEmpty) {
      return _buildEmptyState('No Bookings Yet', 'Search for available rides on the home feed to secure a seat.');
    }

    return ListView.builder(
      itemCount: _mockBookings.length,
      itemBuilder: (context, index) {
        final booking = _mockBookings[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          child: GlassCard(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    children: [
                      Text(booking['host'] as String, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                      const Spacer(),
                      _buildStatusBadge(booking['status'] as String),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Icon(Icons.circle, color: Color(0xff00d4aa), size: 12),
                      const SizedBox(width: 8),
                      Expanded(child: Text(booking['origin'] as String, style: TextStyle(color: Colors.grey[300]))),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.circle, color: Color(0xffff6b35), size: 12),
                      const SizedBox(width: 8),
                      Expanded(child: Text(booking['destination'] as String, style: TextStyle(color: Colors.grey[300]))),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Divider(color: Color(0xff22222a)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Text('${booking['date']} • ${booking['time']}', style: TextStyle(color: Colors.grey[400])),
                      const Spacer(),
                      Text(booking['price'] as String, style: const TextStyle(color: Color(0xff6c63ff), fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  if (booking['status'] == 'ACCEPTED')
                    CustomButton(
                      text: 'View Active Navigation',
                      onPressed: () => context.push('/rides/active'),
                      backgroundColor: const Color(0xff6c63ff),
                    ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildMyRidesTab() {
    if (_mockMyRides.isEmpty) {
      return _buildEmptyState('No Rides Created', 'Register your car in profile details and host commutes to start earning.');
    }

    return ListView.builder(
      itemCount: _mockMyRides.length,
      itemBuilder: (context, index) {
        final ride = _mockMyRides[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          child: GlassCard(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.directions_car, color: Color(0xff00d4aa)),
                      const SizedBox(width: 8),
                      const Text('Hosted by Me', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                      const Spacer(),
                      _buildStatusBadge(ride['status'] as String),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Icon(Icons.circle, color: Color(0xff00d4aa), size: 12),
                      const SizedBox(width: 8),
                      Expanded(child: Text(ride['origin'] as String, style: TextStyle(color: Colors.grey[300]))),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.circle, color: Color(0xffff6b35), size: 12),
                      const SizedBox(width: 8),
                      Expanded(child: Text(ride['destination'] as String, style: TextStyle(color: Colors.grey[300]))),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Divider(color: Color(0xff22222a)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Text('${ride['date']} • ${ride['time']}', style: TextStyle(color: Colors.grey[400])),
                      const Spacer(),
                      Text('${ride['passengers']} Passengers joined', style: const TextStyle(color: Color(0xff00d4aa), fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  CustomButton(
                    text: 'Manage Passenger List',
                    onPressed: () => context.push('/rides/active'),
                    backgroundColor: const Color(0xff00d4aa),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    switch (status) {
      case 'ACCEPTED':
      case 'ACTIVE':
        color = const Color(0xff00d4aa);
        break;
      case 'PENDING':
        color = Colors.amber;
        break;
      default:
        color = Colors.grey;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
      child: Text(status, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 12)),
    );
  }

  Widget _buildEmptyState(String title, String desc) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.directions_car_outlined, size: 64, color: Colors.grey[700]),
            const SizedBox(height: 16),
            Text(title, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(desc, textAlign: TextAlign.center, style: TextStyle(color: Colors.grey[600])),
          ],
        ),
      ),
    );
  }
}
