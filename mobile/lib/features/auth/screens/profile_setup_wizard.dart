import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/custom_button.dart';
import '../../../core/theme/widgets/custom_text_field.dart';
import '../../../core/theme/widgets/glass_card.dart';
import '../providers/auth_provider.dart';

class ProfileSetupWizard extends ConsumerStatefulWidget {
  const ProfileSetupWizard({super.key});

  @override
  ConsumerState<ProfileSetupWizard> createState() => _ProfileSetupWizardState();
}

class _ProfileSetupWizardState extends ConsumerState<ProfileSetupWizard> {
  int _currentStep = 0;
  final int _totalSteps = 5;

  final _bioController = TextEditingController();
  final _emergencyNameController = TextEditingController();
  final _emergencyPhoneController = TextEditingController();

  String? _selectedUniversity;
  String? _selectedWilaya;
  String? _avatarUrl;

  final List<String> _universities = [
    'USTHB - Houari Boumediene, Algiers',
    'ESI - Higher School of Computer Science, Algiers',
    'University of Constantine 2 - Abdelhamid Mehri',
    'University of Oran 1 - Ahmed Ben Bella',
    'University of Blida 1 - Saad Dahlab',
    'University of Tlemcen - Abou Bekr Belkaid',
  ];

  final List<String> _wilayas = [
    '09 - Blida',
    '16 - Alger',
    '25 - Constantine',
    '31 - Oran',
    '15 - Tizi Ouzou',
    '19 - Sétif',
    '23 - Annaba',
    '13 - Tlemcen',
  ];

  final List<String> _avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256',
  ];

  @override
  void dispose() {
    _bioController.dispose();
    _emergencyNameController.dispose();
    _emergencyPhoneController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep < _totalSteps - 1) {
      setState(() {
        _currentStep++;
      });
    } else {
      _saveProfile();
    }
  }

  void _prevStep() {
    if (_currentStep > 0) {
      setState(() {
        _currentStep--;
      });
    }
  }

  void _saveProfile() async {
    final notifier = ref.read(authProvider.notifier);
    final success = await notifier.setupProfile(
      bio: _bioController.text.trim(),
      university: _selectedUniversity ?? 'USTHB',
      wilaya: _selectedWilaya ?? '16 - Alger',
      emergencyName: _emergencyNameController.text.trim().isEmpty ? 'Parent' : _emergencyNameController.text.trim(),
      emergencyPhone: _emergencyPhoneController.text.trim().isEmpty ? '+213555123456' : _emergencyPhoneController.text.trim(),
      avatarUrl: _avatarUrl,
    );

    if (success && mounted) {
      context.go('/');
    } else {
      final error = ref.read(authProvider).errorMessage;
      if (error != null && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error), backgroundColor: const Color(0xffff6b35)),
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
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Progress Bar
              Row(
                children: [
                  Expanded(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: (_currentStep + 1) / _totalSteps,
                        backgroundColor: Colors.grey[800],
                        valueColor: const AlwaysStoppedAnimation<Color>(Color(0xff6c63ff)),
                        minHeight: 6,
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Text(
                    '${_currentStep + 1}/$_totalSteps',
                    style: TextStyle(color: Colors.grey[400], fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 36),
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildStepTitle(),
                      const SizedBox(height: 8),
                      _buildStepSubtitle(),
                      const SizedBox(height: 32),
                      GlassCard(
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: _buildStepContent(),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              // Navigation Buttons
              Row(
                children: [
                  if (_currentStep > 0)
                    Expanded(
                      child: CustomButton(
                        text: 'Back',
                        backgroundColor: Colors.grey[900]!,
                        textColor: Colors.white,
                        onPressed: _prevStep,
                      ),
                    ),
                  if (_currentStep > 0) const SizedBox(width: 16),
                  Expanded(
                    child: CustomButton(
                      text: _currentStep == _totalSteps - 1 ? (state.isLoading ? 'Saving...' : 'Finish') : 'Next',
                      backgroundColor: const Color(0xff6c63ff),
                      onPressed: state.isLoading ? () {} : _nextStep,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStepTitle() {
    switch (_currentStep) {
      case 0:
        return const Text('Choose Avatar', style: TextStyle(fontFamily: 'Syne', fontSize: 26, fontWeight: FontWeight.bold, color: Colors.white));
      case 1:
        return const Text('Select University', style: TextStyle(fontFamily: 'Syne', fontSize: 26, fontWeight: FontWeight.bold, color: Colors.white));
      case 2:
        return const Text('Select Wilaya', style: TextStyle(fontFamily: 'Syne', fontSize: 26, fontWeight: FontWeight.bold, color: Colors.white));
      case 3:
        return const Text('Write Your Bio', style: TextStyle(fontFamily: 'Syne', fontSize: 26, fontWeight: FontWeight.bold, color: Colors.white));
      case 4:
        return const Text('Emergency Safety', style: TextStyle(fontFamily: 'Syne', fontSize: 26, fontWeight: FontWeight.bold, color: Colors.white));
      default:
        return const SizedBox();
    }
  }

  Widget _buildStepSubtitle() {
    switch (_currentStep) {
      case 0:
        return Text('Pick a preset or custom profile photo.', style: TextStyle(color: Colors.grey[500], fontSize: 14));
      case 1:
        return Text('Where do you study? This filters your carpools.', style: TextStyle(color: Colors.grey[500], fontSize: 14));
      case 2:
        return Text('Your home region for weekend and holiday commutes.', style: TextStyle(color: Colors.grey[500], fontSize: 14));
      case 3:
        return Text('Tell other students a little bit about yourself.', style: TextStyle(color: Colors.grey[500], fontSize: 14));
      case 4:
        return Text('Used for SOS alerts and automated Twilio messages.', style: TextStyle(color: Colors.grey[500], fontSize: 14));
      default:
        return const SizedBox();
    }
  }

  Widget _buildStepContent() {
    switch (_currentStep) {
      case 0:
        return Column(
          children: [
            Center(
              child: Container(
                width: 110,
                height: 110,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xff6c63ff), width: 3),
                  image: _avatarUrl != null
                      ? DecorationImage(image: NetworkImage(_avatarUrl!), fit: BoxFit.cover)
                      : null,
                ),
                child: _avatarUrl == null
                    ? const Icon(Icons.person, size: 60, color: Colors.grey)
                    : null,
              ),
            ),
            const SizedBox(height: 24),
            const Text('Choose Preset:', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: _avatarPresets.map((preset) {
                final isSelected = _avatarUrl == preset;
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _avatarUrl = preset;
                    });
                  },
                  child: Container(
                    width: 54,
                    height: 54,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: isSelected ? const Color(0xff00d4aa) : Colors.transparent,
                        width: 2.5,
                      ),
                      image: DecorationImage(image: NetworkImage(preset), fit: BoxFit.cover),
                    ),
                  ),
                );
              }).toList(),
            ),
          ],
        );
      case 1:
        return Column(
          children: _universities.map((uni) {
            final isSelected = _selectedUniversity == uni;
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xff6c63ff).withOpacity(0.12) : Colors.transparent,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected ? const Color(0xff6c63ff) : Colors.grey[800]!,
                  width: 1.5,
                ),
              ),
              child: ListTile(
                title: Text(uni, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                trailing: isSelected ? const Icon(Icons.check_circle, color: Color(0xff6c63ff)) : null,
                onTap: () {
                  setState(() {
                    _selectedUniversity = uni;
                  });
                },
              ),
            );
          }).toList(),
        );
      case 2:
        return Column(
          children: _wilayas.map((wil) {
            final isSelected = _selectedWilaya == wil;
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xff00d4aa).withOpacity(0.12) : Colors.transparent,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected ? const Color(0xff00d4aa) : Colors.grey[800]!,
                  width: 1.5,
                ),
              ),
              child: ListTile(
                title: Text(wil, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                trailing: isSelected ? const Icon(Icons.check_circle, color: Color(0xff00d4aa)) : null,
                onTap: () {
                  setState(() {
                    _selectedWilaya = wil;
                  });
                },
              ),
            );
          }).toList(),
        );
      case 3:
        return CustomTextField(
          controller: _bioController,
          label: 'About You',
          hint: 'Example: 3rd year CS student at USTHB. Friendly, loves coffee and rock music!',
          maxLines: 5,
        );
      case 4:
        return Column(
          children: [
            CustomTextField(
              controller: _emergencyNameController,
              label: 'Emergency Contact Name',
              hint: 'Father / Friend Name',
            ),
            const SizedBox(height: 16),
            CustomTextField(
              controller: _emergencyPhoneController,
              label: 'Emergency Contact Phone',
              hint: '+213 555 12 34 56',
              keyboardType: TextInputType.phone,
            ),
          ],
        );
      default:
        return const SizedBox();
    }
  }
}
