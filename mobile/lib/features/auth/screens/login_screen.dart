import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/custom_button.dart';
import '../../../core/theme/widgets/custom_text_field.dart';
import '../../../core/theme/widgets/glass_card.dart';
import '../providers/auth_provider.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _twoFAController = TextEditingController();


  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _twoFAController.dispose();
    super.dispose();
  }

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final notifier = ref.read(authProvider.notifier);
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    final authState = ref.read(authProvider);
    final twoFA = authState.require2FA ? _twoFAController.text.trim() : null;

    final success = await notifier.login(
      email: email,
      password: password,
      twoFAToken: twoFA,
    );

    if (success && mounted) {
      context.go('/');
    } else {
      final error = ref.read(authProvider).errorMessage;
      if (error != null && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(error),
            backgroundColor: const Color(0xffff6b35),
          ),
        );
        notifier.clearError();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(authProvider);

    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Welcome Back',
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
                state.require2FA ? 'Enter your 6-digit 2FA verification code' : 'Sign in to commute securely with student peers',
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
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        if (!state.require2FA) ...[
                          CustomTextField(
                            controller: _emailController,
                            label: 'Email Address',
                            hint: 'name@student.univ.dz',
                            keyboardType: TextInputType.emailAddress,
                            validator: (val) {
                              if (val == null || val.isEmpty) return 'Email is required';
                              if (!val.contains('@')) return 'Enter a valid student email';
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),
                          CustomTextField(
                            controller: _passwordController,
                            label: 'Password',
                            hint: '••••••••',
                            isPassword: true,
                            validator: (val) {
                              if (val == null || val.isEmpty) return 'Password is required';
                              return null;
                            },
                          ),
                          const SizedBox(height: 8),
                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton(
                              onPressed: () {
                                context.push('/forgot-password');
                              },
                              child: const Text(
                                'Forgot Password?',
                                style: TextStyle(
                                  color: Color(0xff6c63ff),
                                  fontFamily: 'PlusJakartaSans',
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                        ] else ...[
                          CustomTextField(
                            controller: _twoFAController,
                            label: '2FA Token / Backup Code',
                            hint: '123456',
                            keyboardType: TextInputType.text,
                            validator: (val) {
                              if (val == null || val.isEmpty) return 'Enter the verification code';
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),
                          TextButton(
                            onPressed: () {
                              ref.read(authProvider.notifier).logout();
                            },
                            child: const Text(
                              'Cancel & Go Back',
                              style: TextStyle(
                                color: Colors.grey,
                                fontFamily: 'PlusJakartaSans',
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                        const SizedBox(height: 16),
                        CustomButton(
                          text: state.isLoading
                              ? 'Loading...'
                              : (state.require2FA ? 'Verify & Login' : 'Login'),
                          onPressed: state.isLoading ? () {} : _submit,
                          backgroundColor: const Color(0xff6c63ff),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              if (!state.require2FA)
                TextButton(
                  onPressed: () {
                    context.go('/register');
                  },
                  child: RichText(
                    text: TextSpan(
                      text: "Don't have an account? ",
                      style: TextStyle(
                        fontFamily: 'PlusJakartaSans',
                        color: Colors.grey[400],
                        fontSize: 14,
                      ),
                      children: const [
                        TextSpan(
                          text: 'Register',
                          style: TextStyle(
                            color: Color(0xff6c63ff),
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
    );
  }
}
