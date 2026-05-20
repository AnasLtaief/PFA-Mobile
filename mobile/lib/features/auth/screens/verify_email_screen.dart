import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/custom_button.dart';
import '../../../core/theme/widgets/glass_card.dart';
import '../providers/auth_provider.dart';

class VerifyEmailScreen extends ConsumerStatefulWidget {
  final String token;
  const VerifyEmailScreen({super.key, required this.token});

  @override
  ConsumerState<VerifyEmailScreen> createState() => _VerifyEmailScreenState();
}

class _VerifyEmailScreenState extends ConsumerState<VerifyEmailScreen> {
  bool _initialized = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_initialized) {
      _initialized = true;
      _verify();
    }
  }

  void _verify() async {
    if (widget.token.isEmpty) return;
    await ref.read(authProvider.notifier).verifyEmail(widget.token);
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(authProvider);

    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Email Verification',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: 'Syne',
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 24),
              GlassCard(
                child: Padding(
                  padding: const EdgeInsets.all(32.0),
                  child: Column(
                    children: [
                      if (widget.token.isEmpty) ...[
                        const Icon(Icons.warning_amber_rounded, size: 64, color: Color(0xffff6b35)),
                        const SizedBox(height: 24),
                        const Text(
                          'Missing Token',
                          style: TextStyle(fontFamily: 'Syne', fontSize: 20, color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'The verification link seems invalid or incomplete.',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.grey[500], fontSize: 14),
                        ),
                      ] else if (state.isLoading) ...[
                        const SizedBox(
                          width: 48,
                          height: 48,
                          child: CircularProgressIndicator(color: Color(0xff6c63ff)),
                        ),
                        const SizedBox(height: 24),
                        const Text(
                          'Verifying...',
                          style: TextStyle(fontFamily: 'Syne', fontSize: 18, color: Colors.white),
                        ),
                      ] else if (state.emailVerified) ...[
                        const Icon(Icons.verified_rounded, size: 64, color: Color(0xff00d4aa)),
                        const SizedBox(height: 24),
                        const Text(
                          'Success!',
                          style: TextStyle(fontFamily: 'Syne', fontSize: 20, color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Your student email has been verified successfully. You can now access all services.',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.grey[500], fontSize: 14),
                        ),
                        const SizedBox(height: 24),
                        CustomButton(
                          text: 'Continue',
                          onPressed: () {
                            context.go('/');
                          },
                          backgroundColor: const Color(0xff6c63ff),
                        ),
                      ] else ...[
                        const Icon(Icons.error_outline_rounded, size: 64, color: Color(0xffff6b35)),
                        const SizedBox(height: 24),
                        const Text(
                          'Verification Failed',
                          style: TextStyle(fontFamily: 'Syne', fontSize: 20, color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          state.errorMessage ?? 'The verification token might have expired or is invalid.',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.grey[500], fontSize: 14),
                        ),
                        const SizedBox(height: 24),
                        CustomButton(
                          text: 'Go Back',
                          onPressed: () {
                            context.go('/login');
                          },
                          backgroundColor: Colors.grey[850]!,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
