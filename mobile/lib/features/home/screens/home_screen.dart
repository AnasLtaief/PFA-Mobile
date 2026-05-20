import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/glass_card.dart';
import '../../auth/providers/auth_provider.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final _searchController = TextEditingController();
  String _selectedWilaya = 'All';

  final List<String> _wilayas = ['All', 'Alger', 'Constantine', 'Oran', 'Blida'];

  // Mock rides matching seed data
  final List<Map<String, dynamic>> _mockRides = [
    {
      'id': 'ride1',
      'host': {'name': 'Anas Rahmani', 'avatar': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256', 'university': 'Constantine 2'},
      'origin': 'Zouaghi Slimane, Constantine',
      'destination': 'University Constantine 2',
      'price': '150 DA',
      'seats': 3,
      'time': '08:30 AM',
      'wilaya': 'Constantine',
    },
    {
      'id': 'ride2',
      'host': {'name': 'Sara Benzaid', 'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256', 'university': 'USTHB'},
      'origin': 'Kouba, Algiers',
      'destination': 'USTHB University, Bab Ezzouar',
      'price': '200 DA',
      'seats': 2,
      'time': '07:45 AM',
      'wilaya': 'Alger',
    },
    {
      'id': 'ride3',
      'host': {'name': 'Yacine Djebbar', 'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256', 'university': 'ESI Alger'},
      'origin': 'El Harrach, Algiers',
      'destination': 'ESI University, Oued Smar',
      'price': '100 DA',
      'seats': 4,
      'time': '08:00 AM',
      'wilaya': 'Alger',
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    final filteredRides = _mockRides.where((ride) {
      final matchesSearch = ride['origin'].toLowerCase().contains(_searchController.text.toLowerCase()) ||
          ride['destination'].toLowerCase().contains(_searchController.text.toLowerCase());
      final matchesWilaya = _selectedWilaya == 'All' || ride['wilaya'] == _selectedWilaya;
      return matchesSearch && matchesWilaya;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // App Bar
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Row(
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Salam, ${authState.user?.fullName.split(' ')[0] ?? 'Student'} 👋',
                          style: const TextStyle(
                            fontFamily: 'Syne',
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Commute safely and share costs today',
                          style: TextStyle(
                            fontFamily: 'PlusJakartaSans',
                            color: Colors.grey[500],
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                    const Spacer(),
                    // Emergency SOS quick shortcut
                    GestureDetector(
                      onTap: () => context.push('/emergency'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xffff6b35).withOpacity(0.15),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xffff6b35).withOpacity(0.5), width: 1.5),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.warning_amber_rounded, color: Color(0xffff6b35), size: 20),
                            SizedBox(width: 6),
                            Text(
                              'SOS',
                              style: TextStyle(
                                color: Color(0xffff6b35),
                                fontFamily: 'Syne',
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Stories list
            SliverToBoxAdapter(
              child: SizedBox(
                height: 100,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  itemCount: 6,
                  itemBuilder: (context, index) {
                    if (index == 0) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 16.0),
                        child: Column(
                          children: [
                            GestureDetector(
                              onTap: () => context.push('/social/story/create'),
                              child: Container(
                                width: 64,
                                height: 64,
                                decoration: BoxDecoration(
                                  color: Colors.grey[900],
                                  shape: BoxShape.circle,
                                  border: Border.all(color: Colors.grey[800]!, width: 2),
                                ),
                                child: const Icon(Icons.add, color: Colors.white, size: 28),
                              ),
                            ),
                            const SizedBox(height: 6),
                            const Text('Add Story', style: TextStyle(color: Colors.grey, fontSize: 12)),
                          ],
                        ),
                      );
                    }

                    final users = [
                      {'name': 'Sara', 'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256'},
                      {'name': 'Yacine', 'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256'},
                      {'name': 'Anas', 'avatar': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256'},
                      {'name': 'Amine', 'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256'},
                      {'name': 'Lydia', 'avatar': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256'},
                    ];
                    final user = users[index - 1];

                    return GestureDetector(
                      onTap: () {
                        context.push(
                          '/social/story/view',
                          extra: {
                            'userName': user['name'],
                            'userAvatar': user['avatar'],
                          },
                        );
                      },
                      child: Padding(
                        padding: const EdgeInsets.only(right: 16.0),
                        child: Column(
                          children: [
                            Container(
                              width: 64,
                              height: 64,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(color: const Color(0xff00d4aa), width: 2.5),
                                image: DecorationImage(image: NetworkImage(user['avatar']!), fit: BoxFit.cover),
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(user['name']!, style: const TextStyle(color: Colors.white, fontSize: 12)),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),

            // Search Bar & Filter
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    TextField(
                      controller: _searchController,
                      style: const TextStyle(color: Colors.white),
                      onChanged: (val) => setState(() {}),
                      decoration: InputDecoration(
                        hintText: 'Search departure or destination...',
                        hintStyle: TextStyle(color: Colors.grey[600]),
                        prefixIcon: Icon(Icons.search, color: Colors.grey[600]),
                        filled: true,
                        fillColor: const Color(0xff13131a),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                        contentPadding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                    ),
                    const SizedBox(height: 12),
                    // Wilaya filters
                    SizedBox(
                      height: 38,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _wilayas.length,
                        itemBuilder: (context, index) {
                          final w = _wilayas[index];
                          final isSelected = _selectedWilaya == w;
                          return Padding(
                            padding: const EdgeInsets.only(right: 8.0),
                            child: FilterChip(
                              label: Text(w),
                              selected: isSelected,
                              labelStyle: TextStyle(color: isSelected ? Colors.black : Colors.white, fontWeight: FontWeight.bold),
                              checkmarkColor: Colors.black,
                              selectedColor: const Color(0xff00d4aa),
                              backgroundColor: const Color(0xff13131a),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: BorderSide(color: Colors.grey[900]!)),
                              onSelected: (val) {
                                setState(() {
                                  _selectedWilaya = w;
                                });
                              },
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Ride cards list
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final ride = filteredRides[index];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      child: GlassCard(
                        child: InkWell(
                          onTap: () => context.push('/rides/${ride['id']}'),
                          borderRadius: BorderRadius.circular(20),
                          child: Padding(
                            padding: const EdgeInsets.all(18.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                Row(
                                  children: [
                                    CircleAvatar(
                                      backgroundImage: NetworkImage(ride['host']['avatar']),
                                      radius: 20,
                                    ),
                                    const SizedBox(width: 12),
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(ride['host']['name'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                        Text(ride['host']['university'], style: TextStyle(color: Colors.grey[500], fontSize: 12)),
                                      ],
                                    ),
                                    const Spacer(),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(color: const Color(0xff6c63ff).withOpacity(0.12), borderRadius: BorderRadius.circular(12)),
                                      child: Text(ride['price'], style: const TextStyle(color: Color(0xff6c63ff), fontWeight: FontWeight.bold)),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                Row(
                                  children: [
                                    const Icon(Icons.radio_button_checked, color: Color(0xff00d4aa), size: 20),
                                    const SizedBox(width: 8),
                                    Expanded(child: Text(ride['origin'], style: const TextStyle(color: Colors.white), overflow: TextOverflow.ellipsis)),
                                  ],
                                ),
                                const Padding(
                                  padding: EdgeInsets.only(left: 9.0),
                                  child: SizedBox(height: 12, child: VerticalDivider(color: Colors.grey, width: 2)),
                                ),
                                Row(
                                  children: [
                                    const Icon(Icons.location_on, color: Color(0xffff6b35), size: 20),
                                    const SizedBox(width: 8),
                                    Expanded(child: Text(ride['destination'], style: const TextStyle(color: Colors.white), overflow: TextOverflow.ellipsis)),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                const Divider(color: Color(0xff22222a)),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    Icon(Icons.access_time_filled, color: Colors.grey[500], size: 16),
                                    const SizedBox(width: 6),
                                    Text(ride['time'], style: TextStyle(color: Colors.grey[400])),
                                    const Spacer(),
                                    Icon(Icons.airline_seat_recline_normal, color: Colors.grey[500], size: 18),
                                    const SizedBox(width: 4),
                                    Text('${ride['seats']} seats left', style: TextStyle(color: Colors.grey[400])),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                  childCount: filteredRides.length,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
