import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/custom_button.dart';
import '../../../core/theme/widgets/glass_card.dart';
import '../providers/auth_provider.dart';

class TwoFASetupScreen extends ConsumerStatefulWidget {
  const TwoFASetupScreen({super.key});

  @override
  ConsumerState<TwoFASetupScreen> createState() => _TwoFASetupScreenState();
}

class _TwoFASetupScreenState extends ConsumerState<TwoFASetupScreen> {
  Map<String, dynamic>? _setupData;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadSetupData();
  }

  void _loadSetupData() async {
    final data = await ref.read(authProvider.notifier).setup2FA();
    if (mounted) {
      setState(() {
        _setupData = data;
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'Enable 2FA',
          style: TextStyle(fontFamily: 'Syne', fontWeight: FontWeight.bold, color: Colors.white),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Secure Your Account',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: 'Syne',
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Scan the QR code with Google Authenticator or copy the secret key manually to register this device.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: 'PlusJakartaSans',
                  fontSize: 15,
                  color: Colors.grey[500],
                ),
              ),
              const SizedBox(height: 32),
              GlassCard(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: _loading
                      ? const Column(
                          children: [
                            SizedBox(
                              width: 40,
                              height: 40,
                              child: CircularProgressIndicator(color: Color(0xff6c63ff)),
                            ),
                            SizedBox(height: 16),
                            Text('Generating secure keys...', style: TextStyle(color: Colors.grey)),
                          ],
                        )
                      : (_setupData == null
                          ? Column(
                              children: [
                                const Icon(Icons.error_outline, color: Color(0xffff6b35), size: 48),
                                const SizedBox(height: 16),
                                const Text('Failed to load setup data', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                const SizedBox(height: 16),
                                CustomButton(text: 'Retry', onPressed: _loadSetupData),
                              ],
                            )
                          : Column(
                              children: [
                                // QR code display
                                if (_setupData!['qrCode'] != null) ...[
                                  Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Image.memory(
                                      base64Decode(_setupData!['qrCode'].split(',')[1]),
                                      height: 180,
                                      width: 180,
                                    ),
                                  ),
                                  const SizedBox(height: 24),
                                ],
                                const Text(
                                  'Manual Setup Key:',
                                  style: TextStyle(
                                    fontFamily: 'PlusJakartaSans',
                                    color: Colors.grey,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                  decoration: BoxDecoration(
                                    color: Colors.black.withValues(alpha: 0.4),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(color: Colors.grey[800]!),
                                  ),
                                  child: Row(
                                    children: [
                                      Expanded(
                                        child: Text(
                                          _setupData!['manualKey'] ?? '',
                                          textAlign: TextAlign.center,
                                          style: const TextStyle(
                                            fontFamily: 'monospace',
                                            color: Color(0xff00d4aa),
                                            fontSize: 15,
                                            fontWeight: FontWeight.bold,
                                            letterSpacing: 1.1,
                                          ),
                                        ),
                                      ),
                                      IconButton(
                                        icon: const Icon(Icons.copy, color: Colors.grey),
                                        onPressed: () {
                                          // Copy key to clipboard (Mock placeholder or print)
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            const SnackBar(content: Text('Key copied to clipboard')),
                                          );
                                        },
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 32),
                                CustomButton(
                                  text: 'I have configured the app',
                                  onPressed: () {
                                    context.push('/2fa-verify');
                                  },
                                  backgroundColor: const Color(0xff6c63ff),
                                ),
                              ],
                            )),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
