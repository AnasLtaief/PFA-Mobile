import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/custom_button.dart';
import '../../../core/theme/widgets/glass_card.dart';

class SOSScreen extends ConsumerStatefulWidget {
  const SOSScreen({super.key});

  @override
  ConsumerState<SOSScreen> createState() => _SOSScreenState();
}

class _SOSScreenState extends ConsumerState<SOSScreen> {
  bool _sosTriggered = false;

  void _triggerSOS() async {
    setState(() {
      _sosTriggered = true;
    });

    // Simulate sending SOS to backend, emergency contacts via Twilio, and push alerts
    await Future.delayed(const Duration(milliseconds: 2000));

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('EMERGENCY SOS SENT! HELP IS ON THE WAY.'),
          backgroundColor: Color(0xffff6b35),
          duration: Duration(seconds: 5),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                _sosTriggered ? 'SOS ALERT ACTIVE' : 'EMERGENCY CENTER',
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
                _sosTriggered
                    ? 'Transmitting live GPS, alerting student community admins, and broadcasting SMS messages via Twilio.'
                    : 'Pressing the button below instantly triggers an emergency alert to your contact and nearby student patrollers.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: 'PlusJakartaSans',
                  fontSize: 15,
                  color: Colors.grey[500],
                ),
              ),
              const SizedBox(height: 48),
              // Big round Red SOS button
              Center(
                child: GestureDetector(
                  onTap: _sosTriggered ? null : _triggerSOS,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 400),
                    width: 200,
                    height: 200,
                    decoration: BoxDecoration(
                      color: _sosTriggered ? const Color(0xffff6b35) : const Color(0xffff6b35).withOpacity(0.12),
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: const Color(0xffff6b35),
                        width: 4,
                      ),
                      boxShadow: _sosTriggered
                          ? [
                              BoxShadow(
                                color: const Color(0xffff6b35).withOpacity(0.4),
                                blurRadius: 40,
                                spreadRadius: 10,
                              ),
                            ]
                          : [],
                    ),
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            _sosTriggered ? Icons.warning_rounded : Icons.touch_app_rounded,
                            size: 60,
                            color: Colors.white,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _sosTriggered ? 'ACTIVE' : 'HOLD TO SOS',
                            style: const TextStyle(
                              fontFamily: 'Syne',
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 48),
              if (_sosTriggered) ...[
                GlassCard(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.check_circle, color: Color(0xff00d4aa)),
                            SizedBox(width: 12),
                            Expanded(child: Text('SMS broadcast to emergency contacts sent.', style: TextStyle(color: Colors.white))),
                          ],
                        ),
                        const SizedBox(height: 12),
                        const Row(
                          children: [
                            Icon(Icons.check_circle, color: Color(0xff00d4aa)),
                            SizedBox(width: 12),
                            Expanded(child: Text('Constantine Student Admins alerted.', style: TextStyle(color: Colors.white))),
                          ],
                        ),
                        const SizedBox(height: 24),
                        CustomButton(
                          text: 'Deactivate SOS Alert',
                          backgroundColor: Colors.grey[900]!,
                          textColor: Colors.white,
                          onPressed: () {
                            setState(() {
                              _sosTriggered = false;
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                ),
              ] else ...[
                // Safety instructions
                GlassCard(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.vibration, color: Color(0xff6c63ff)),
                            SizedBox(width: 12),
                            Text('Shake-to-SOS Active', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'In case of immediate danger, shake your device 3 times to automatically trigger SOS without opening the app.',
                          style: TextStyle(color: Colors.grey[500], fontSize: 13, height: 1.4),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
