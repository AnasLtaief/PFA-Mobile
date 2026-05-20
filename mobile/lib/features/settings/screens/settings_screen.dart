import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/custom_button.dart';
import '../../../core/theme/widgets/glass_card.dart';
import '../../auth/providers/auth_provider.dart';
import '../../../core/providers/providers.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _shakeSOS = true;
  bool _pushNotifications = true;
  bool _emailNotifications = true;
  bool _isLoading = false;

  void _showChangePasswordBottomSheet() {
    final oldPasswordController = TextEditingController();
    final newPasswordController = TextEditingController();
    final confirmPasswordController = TextEditingController();
    final formKey = GlobalKey<FormState>();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xff13131a),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom + 24,
          left: 24,
          right: 24,
          top: 24,
        ),
        child: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Change Password',
                    style: TextStyle(
                      fontFamily: 'Syne',
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.grey),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: oldPasswordController,
                style: const TextStyle(color: Colors.white),
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Current Password',
                  labelStyle: TextStyle(color: Colors.grey[500]),
                  filled: true,
                  fillColor: const Color(0xff0a0a0f),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
                validator: (val) => val == null || val.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: newPasswordController,
                style: const TextStyle(color: Colors.white),
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'New Password',
                  labelStyle: TextStyle(color: Colors.grey[500]),
                  filled: true,
                  fillColor: const Color(0xff0a0a0f),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
                validator: (val) {
                  if (val == null || val.isEmpty) return 'Required';
                  if (val.length < 6) return 'Password must be at least 6 characters';
                  return null;
                },
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: confirmPasswordController,
                style: const TextStyle(color: Colors.white),
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Confirm New Password',
                  labelStyle: TextStyle(color: Colors.grey[500]),
                  filled: true,
                  fillColor: const Color(0xff0a0a0f),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
                validator: (val) {
                  if (val != newPasswordController.text) return 'Passwords do not match';
                  return null;
                },
              ),
              const SizedBox(height: 24),
              CustomButton(
                text: 'Update Password',
                onPressed: () async {
                  if (!formKey.currentState!.validate()) return;
                  Navigator.pop(context);
                  setState(() => _isLoading = true);

                  try {
                    final api = ref.read(apiServiceProvider);
                    await api.patch('/users/me', data: {
                      'password': newPasswordController.text,
                    });

                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Password updated successfully!'),
                          backgroundColor: Color(0xff00d4aa),
                        ),
                      );
                    }
                  } catch (e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Error: ${e.toString()}'),
                          backgroundColor: const Color(0xffff6b35),
                        ),
                      );
                    }
                  } finally {
                    if (mounted) {
                      setState(() => _isLoading = false);
                    }
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _confirmDeleteAccount() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xff13131a),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text(
          'Delete Account?',
          style: TextStyle(
            fontFamily: 'Syne',
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        content: const Text(
          'Are you sure you want to permanently delete your Campus Covoiturage account? This action is immediate and cannot be undone.',
          style: TextStyle(color: Colors.grey),
        ),
        actions: [
          TextButton(
            child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
            onPressed: () => Navigator.pop(context),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xffff6b35),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Delete', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            onPressed: () async {
              Navigator.pop(context);
              setState(() => _isLoading = true);
              try {
                final api = ref.read(apiServiceProvider);
                await api.delete('/users/me');

                await ref.read(authProvider.notifier).logout();
                if (mounted) {
                  context.go('/login');
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Account permanently deleted.'),
                      backgroundColor: Color(0xffff6b35),
                    ),
                  );
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Failed to delete account: ${e.toString()}'),
                      backgroundColor: const Color(0xffff6b35),
                    ),
                  );
                }
              } finally {
                if (mounted) {
                  setState(() => _isLoading = false);
                }
              }
            },
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final user = authState.user;

    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      appBar: AppBar(
        backgroundColor: const Color(0xff0a0a0f),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Settings',
          style: TextStyle(
            fontFamily: 'Syne',
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xff6c63ff)))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    'Security & Access',
                    style: TextStyle(
                      fontFamily: 'Syne',
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                  GlassCard(
                    child: Column(
                      children: [
                        ListTile(
                          leading: const Icon(Icons.lock_outline, color: Color(0xff6c63ff)),
                          title: const Text('Change Password', style: TextStyle(color: Colors.white)),
                          subtitle: const Text('Update your login password', style: TextStyle(color: Colors.grey, fontSize: 12)),
                          trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                          onTap: _showChangePasswordBottomSheet,
                        ),
                        const Divider(color: Color(0xff22222a), height: 1),
                        ListTile(
                          leading: const Icon(Icons.security, color: Color(0xff00d4aa)),
                          title: const Text('Two-Factor Authentication', style: TextStyle(color: Colors.white)),
                          subtitle: Text(
                            user?.twoFAEnabled == true ? 'Enabled' : 'Disabled',
                            style: const TextStyle(color: Colors.grey, fontSize: 12),
                          ),
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
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Emergency & Safety',
                    style: TextStyle(
                      fontFamily: 'Syne',
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                  GlassCard(
                    child: Column(
                      children: [
                        ListTile(
                          leading: const Icon(Icons.vibration, color: Color(0xffff6b35)),
                          title: const Text('Shake-to-SOS Detection', style: TextStyle(color: Colors.white)),
                          subtitle: const Text('Trigger immediate emergency SOS by shaking phone', style: TextStyle(color: Colors.grey, fontSize: 12)),
                          trailing: Switch(
                            value: _shakeSOS,
                            activeTrackColor: const Color(0xffff6b35),
                            onChanged: (val) {
                              setState(() => _shakeSOS = val);
                            },
                          ),
                        ),
                        const Divider(color: Color(0xff22222a), height: 1),
                        ListTile(
                          leading: const Icon(Icons.contact_phone_outlined, color: Colors.grey),
                          title: const Text('Edit Emergency Contact', style: TextStyle(color: Colors.white)),
                          subtitle: Text(
                            user?.emergencyContact != null
                                ? '${user!.emergencyContact!['name'] ?? ''} (${user.emergencyContact!['phone'] ?? ''})'
                                : 'Configure now',
                            style: const TextStyle(color: Colors.grey, fontSize: 12),
                          ),
                          trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                          onTap: () {
                            context.push('/profile-setup');
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Preferences',
                    style: TextStyle(
                      fontFamily: 'Syne',
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                  GlassCard(
                    child: Column(
                      children: [
                        ListTile(
                          leading: const Icon(Icons.notifications_active_outlined, color: Color(0xff6c63ff)),
                          title: const Text('Push Notifications', style: TextStyle(color: Colors.white)),
                          trailing: Switch(
                            value: _pushNotifications,
                            activeTrackColor: const Color(0xff6c63ff),
                            onChanged: (val) {
                              setState(() => _pushNotifications = val);
                            },
                          ),
                        ),
                        const Divider(color: Color(0xff22222a), height: 1),
                        ListTile(
                          leading: const Icon(Icons.email_outlined, color: Color(0xff00d4aa)),
                          title: const Text('Email Notifications', style: TextStyle(color: Colors.white)),
                          trailing: Switch(
                            value: _emailNotifications,
                            activeTrackColor: const Color(0xff00d4aa),
                            onChanged: (val) {
                              setState(() => _emailNotifications = val);
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Danger Zone',
                    style: TextStyle(
                      fontFamily: 'Syne',
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                  GlassCard(
                    child: ListTile(
                      leading: const Icon(Icons.delete_forever, color: Color(0xffff6b35)),
                      title: const Text(
                        'Delete My Account',
                        style: TextStyle(color: Color(0xffff6b35), fontWeight: FontWeight.bold),
                      ),
                      subtitle: const Text('Permanently delete all personal data', style: TextStyle(color: Colors.grey, fontSize: 12)),
                      onTap: _confirmDeleteAccount,
                    ),
                  ),
                  const SizedBox(height: 32),
                  Center(
                    child: Text(
                      'Campus Covoiturage v1.0.0 (Premium Algerian Edition)',
                      style: TextStyle(color: Colors.grey[600], fontSize: 11),
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
    );
  }
}
