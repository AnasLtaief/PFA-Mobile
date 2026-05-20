import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/custom_button.dart';
import '../../../core/theme/widgets/custom_text_field.dart';
import '../../../core/theme/widgets/glass_card.dart';
import '../providers/auth_provider.dart';

class TwoFAVerifyScreen extends ConsumerStatefulWidget {
  const TwoFAVerifyScreen({super.key});

  @override
  ConsumerState<TwoFAVerifyScreen> createState() => _TwoFAVerifyScreenState();
}

class _TwoFAVerifyScreenState extends ConsumerState<TwoFAVerifyScreen> {
  final _formKey = GlobalKey<FormState>();
  final _tokenController = TextEditingController();
  List<String>? _backupCodes;

  @override
  void dispose() {
    _tokenController.dispose();
    super.dispose();
  }

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final token = _tokenController.text.trim();
    final codes = await ref.read(authProvider.notifier).verify2FA(token);

    if (codes != null && mounted) {
      setState(() {
        _backupCodes = codes;
      });
    } else {
      final error = ref.read(authProvider).errorMessage;
      if (error != null && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error), backgroundColor: const Color(0xffff6b35)),
        );
        ref.read(authProvider.notifier).clearError();
      }
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
        title: const Text(
          'Verify 2FA Token',
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
              Text(
                _backupCodes == null ? 'Verification Required' : 'Save Backup Codes',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontFamily: 'Syne',
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _backupCodes == null
                    ? 'Enter the 6-digit verification code from your authenticator app to enable 2FA.'
                    : 'Store these recovery codes securely. They will only be displayed once and can be used to bypass 2FA if you lose your device.',
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
                  child: _backupCodes == null
                      ? Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              CustomTextField(
                                controller: _tokenController,
                                label: 'Verification Code',
                                hint: '123 456',
                                keyboardType: TextInputType.number,
                                validator: (val) {
                                  if (val == null || val.isEmpty) return 'Enter the 6-digit code';
                                  if (val.length < 6) return 'Code must be 6 digits';
                                  return null;
                                },
                              ),
                              const SizedBox(height: 24),
                              CustomButton(
                                text: state.isLoading ? 'Verifying...' : 'Verify & Enable',
                                onPressed: state.isLoading ? () {} : _submit,
                                backgroundColor: const Color(0xff00d4aa),
                              ),
                            ],
                          ),
                        )
                      : Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Colors.black.withOpacity(0.3),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: Colors.grey[800]!),
                              ),
                              child: GridView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount: 2,
                                  crossAxisSpacing: 12,
                                  mainAxisSpacing: 8,
                                  childAspectRatio: 3.2,
                                ),
                                itemCount: _backupCodes!.length,
                                itemBuilder: (context, index) {
                                  return Container(
                                    alignment: Alignment.center,
                                    decoration: BoxDecoration(
                                      color: Colors.grey[900]?.withOpacity(0.5),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      _backupCodes![index],
                                      style: const TextStyle(
                                        fontFamily: 'monospace',
                                        color: Color(0xff00d4aa),
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                            const SizedBox(height: 24),
                            CustomButton(
                              text: 'I have saved my backup codes',
                              onPressed: () {
                                context.go('/');
                              },
                              backgroundColor: const Color(0xff6c63ff),
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
  
