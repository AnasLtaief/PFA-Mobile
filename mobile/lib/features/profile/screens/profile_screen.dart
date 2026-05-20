import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/custom_button.dart';
import '../../../core/theme/widgets/glass_card.dart';
import '../../auth/providers/auth_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user;

    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'My Profile',
                style: TextStyle(
                  fontFamily: 'Syne',
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 24),
              // Profile Header Card
              GlassCard(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    children: [
                      Center(
                        child: CircleAvatar(
                          backgroundImage: user?.avatarUrl != null ? NetworkImage(user!.avatarUrl!) : null,
                          radius: 48,
                          backgroundColor: Colors.grey[900],
                          child: user?.avatarUrl == null ? const Icon(Icons.person, size: 48, color: Colors.grey) : null,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        user?.fullName ?? 'Student Name',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontFamily: 'Syne',
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        user?.email ?? 'student@univ.dz',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontFamily: 'PlusJakartaSans',
                          color: Colors.grey[500],
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          if (user?.isVerified == true)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(color: const Color(0xff00d4aa).withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
                              child: const Row(
                                children: [
                                  Icon(Icons.verified, color: Color(0xff00d4aa), size: 14),
                                  SizedBox(width: 4),
                                  Text('Verified', style: TextStyle(color: Color(0xff00d4aa), fontWeight: FontWeight.bold, fontSize: 11)),
                                ],
                              ),
                            ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(color: const Color(0xff6c63ff).withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
                            child: Text(user?.role ?? 'STUDENT', style: const TextStyle(color: Color(0xff6c63ff), fontWeight: FontWeight.bold, fontSize: 11)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              const Text('Academic & Personal Details', style: TextStyle(color: Colors.white, fontFamily: 'Syne', fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              GlassCard(
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(Icons.school, color: Color(0xff6c63ff)),
                      title: const Text('University', style: TextStyle(color: Colors.white)),
                      subtitle: Text(user?.university ?? 'USTHB', style: TextStyle(color: Colors.grey[500])),
                    ),
                    const Divider(color: Color(0xff22222a), height: 1),
                    ListTile(
                      leading: const Icon(Icons.location_on, color: Color(0xff00d4aa)),
                      title: const Text('Wilaya Region', style: TextStyle(color: Colors.white)),
                      subtitle: Text(user?.wilaya ?? '16 - Alger', style: TextStyle(color: Colors.grey[500])),
                    ),
                    const Divider(color: Color(0xff22222a), height: 1),
                    ListTile(
                      leading: const Icon(Icons.info, color: Colors.amber),
                      title: const Text('Bio', style: TextStyle(color: Colors.white)),
                      subtitle: Text(user?.bio ?? 'No bio added yet. Tell peers about yourself!', style: TextStyle(color: Colors.grey[500])),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              const Text('Account Safety & Security', style: TextStyle(color: Colors.white, fontFamily: 'Syne', fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              GlassCard(
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(Icons.security, color: Color(0xffff6b35)),
                      title: const Text('Two-Factor Authentication', style: TextStyle(color: Colors.white)),
                      trailing: Switch(
                        value: user?.twoFAEnabled ?? false,
                        activeTrackColor: const Color(0xff00d4aa),
                        onChanged: (val) {
                          if (val) {
                            context.push('/2fa-setup');
                          } else {
                            context.push('/2fa-verify');
                          }
                        },
                      ),
                    ),
                    const Divider(color: Color(0xff22222a), height: 1),
                    ListTile(
                      leading: const Icon(Icons.contact_phone, color: Colors.grey),
                      title: const Text('Emergency Contact', style: TextStyle(color: Colors.white)),
                      onTap: () {},
                    ),
                    const Divider(color: Color(0xff22222a), height: 1),
                    ListTile(
                      leading: const Icon(Icons.settings, color: Colors.grey),
                      title: const Text('App Settings', style: TextStyle(color: Colors.white)),
                      onTap: () => context.push('/settings'),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              CustomButton(
                text: 'Logout',
                isSecondary: true,
                backgroundColor: const Color(0xffff6b35).withValues(alpha: 0.12),
                textColor: const Color(0xffff6b35),
                onPressed: () async {
                  await ref.read(authProvider.notifier).logout();
                  if (context.mounted) {
                    context.go('/login');
                  }
                },
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
