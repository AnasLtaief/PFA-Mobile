import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/glass_card.dart';

class SocialScreen extends ConsumerStatefulWidget {
  const SocialScreen({super.key});

  @override
  ConsumerState<SocialScreen> createState() => _SocialScreenState();
}

class _SocialScreenState extends ConsumerState<SocialScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> _mockGroups = [
    {
      'id': 'group16',
      'name': 'Alger Campus Communes',
      'wilaya': '16 - Alger',
      'members': 1420,
      'desc': 'Community group for all students in Algiers universities. Share rides, events, and exams updates.',
    },
    {
      'id': 'group25',
      'name': 'Constantine Students Carpool',
      'wilaya': '25 - Constantine',
      'members': 890,
      'desc': 'Commutes around Constantine (Mentouri, UC2, UC3). Connect with local drivers and passengers!',
    },
  ];

  final List<Map<String, dynamic>> _mockDMs = [
    {
      'id': 'user_sara',
      'name': 'Sara Benzaid',
      'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256',
      'lastMsg': 'Hey! Are we still on for tomorrow\'s ride?',
      'time': '10 mins ago',
      'unread': 2,
    },
    {
      'id': 'user_yacine',
      'name': 'Yacine Djebbar',
      'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256',
      'lastMsg': 'Perfect, thank you so much!',
      'time': '1 hour ago',
      'unread': 0,
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
                    'Campus Hub',
                    style: TextStyle(
                      fontFamily: 'Syne',
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.photo_camera_outlined, color: Color(0xff00d4aa), size: 28),
                    onPressed: () => context.push('/social/moment/create'),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Connect with university community groups or chat directly with peers',
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
                    color: const Color(0xff00d4aa),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  labelColor: Colors.black,
                  unselectedLabelColor: Colors.grey[500],
                  labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontFamily: 'PlusJakartaSans'),
                  indicatorSize: TabBarIndicatorSize.tab,
                  dividerColor: Colors.transparent,
                  tabs: const [
                    Tab(text: 'Wilaya Groups'),
                    Tab(text: 'Direct Messages'),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _buildGroupsTab(),
                    _buildDMsTab(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGroupsTab() {
    return ListView.builder(
      itemCount: _mockGroups.length,
      itemBuilder: (context, index) {
        final grp = _mockGroups[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          child: GlassCard(
            child: InkWell(
              onTap: () => context.push('/social/groups/${grp['id']}'),
              borderRadius: BorderRadius.circular(20),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(color: const Color(0xff00d4aa).withOpacity(0.12), shape: BoxShape.circle),
                          child: const Icon(Icons.people, color: Color(0xff00d4aa)),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(grp['name'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                              Text('${grp['members']} members • ${grp['wilaya']}', style: TextStyle(color: Colors.grey[500], fontSize: 12)),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(grp['desc'], style: TextStyle(color: Colors.grey[400], fontSize: 14, height: 1.4)),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildDMsTab() {
    return ListView.builder(
      itemCount: _mockDMs.length,
      itemBuilder: (context, index) {
        final dm = _mockDMs[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          child: GlassCard(
            child: ListTile(
              onTap: () => context.push('/social/chat/${dm['id']}'),
              leading: Stack(
                children: [
                  CircleAvatar(
                    backgroundImage: NetworkImage(dm['avatar']),
                    radius: 24,
                  ),
                  Positioned(
                    right: 0,
                    bottom: 0,
                    child: Container(
                      width: 12,
                      height: 12,
                      decoration: const BoxDecoration(color: Color(0xff00d4aa), shape: BoxShape.circle),
                    ),
                  ),
                ],
              ),
              title: Text(dm['name'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              subtitle: Text(dm['lastMsg'], maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: Colors.grey[400])),
              trailing: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(dm['time'], style: TextStyle(color: Colors.grey[600], fontSize: 11)),
                  const SizedBox(height: 6),
                  if (dm['unread'] > 0)
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: const BoxDecoration(color: Color(0xff6c63ff), shape: BoxShape.circle),
                      child: Text(
                        '${dm['unread']}',
                        style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
