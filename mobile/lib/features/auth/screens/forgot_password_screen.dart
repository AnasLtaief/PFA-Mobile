import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/custom_button.dart';
import '../../../core/theme/widgets/custom_text_field.dart';
import '../../../core/theme/widgets/glass_card.dart';
import '../providers/auth_provider.dart';

class ForgotPasswordScreen extends ConsumerStatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  ConsumerState<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  bool _sent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final email = _emailController.text.trim();
    final success = await ref.read(authProvider.notifier).forgotPassword(email);

    if (success && mounted) {
      setState(() {
        _sent = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(authProvider);

    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Reset Password',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontFamily: 'Syne',
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _sent
                  ? "We've sent a password recovery link to your registered email"
                  : 'Enter your student email and we\'ll send you a link to reset your password',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontFamily: 'PlusJakartaSans',
                fontSize: 16,
                color: Colors.grey[500],
              ),
            ),
            const SizedBox(height: 36),
            GlassCard(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: _sent
                    ? Column(
                        children: [
                          const Icon(Icons.mark_email_read_outlined, size: 64, color: Color(0xff00d4aa)),
                          const SizedBox(height: 24),
                          CustomButton(
                            text: 'Back to Login',
                            onPressed: () => context.go('/login'),
                            backgroundColor: const Color(0xff6c63ff),
                          ),
                        ],
                      )
                    : Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            CustomTextField(
                              controller: _emailController,
                              label: 'Student Email Address',
                              hint: 'name@student.univ.dz',
                              keyboardType: TextInputType.emailAddress,
                              validator: (val) {
                                if (val == null || val.isEmpty) return 'Email is required';
                                if (!val.contains('@')) return 'Enter a valid student email';
                                return null;
                              },
                            ),
                            const SizedBox(height: 24),
                            CustomButton(
                              text: state.isLoading ? 'Sending...' : 'Send Recovery Link',
                              onPressed: state.isLoading ? () {} : _submit,
                              backgroundColor: const Color(0xff6c63ff),
                            ),
                          ],
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
