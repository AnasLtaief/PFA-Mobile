import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/custom_button.dart';
import '../../../core/theme/widgets/custom_text_field.dart';
import '../../../core/theme/widgets/glass_card.dart';

class CreateRideScreen extends ConsumerStatefulWidget {
  const CreateRideScreen({super.key});

  @override
  ConsumerState<CreateRideScreen> createState() => _CreateRideScreenState();
}

class _CreateRideScreenState extends ConsumerState<CreateRideScreen> {
  final _formKey = GlobalKey<FormState>();
  final _originController = TextEditingController();
  final _destController = TextEditingController();
  final _priceController = TextEditingController();
  final _seatsController = TextEditingController();
  String _selectedWilaya = '16 - Alger';

  final List<String> _wilayas = ['09 - Blida', '16 - Alger', '25 - Constantine', '31 - Oran'];

  @override
  void dispose() {
    _originController.dispose();
    _destController.dispose();
    _priceController.dispose();
    _seatsController.dispose();
    super.dispose();
  }

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Commute Ride Created Successfully!'), backgroundColor: Color(0xff00d4aa)),
    );
    context.pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Create Ride', style: TextStyle(fontFamily: 'Syne', fontWeight: FontWeight.bold, color: Colors.white)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Host a Carpool',
              style: TextStyle(
                fontFamily: 'Syne',
                fontSize: 26,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Input commute details to list your ride on the public student board',
              style: TextStyle(
                fontFamily: 'PlusJakartaSans',
                fontSize: 14,
                color: Colors.grey[500],
              ),
            ),
            const SizedBox(height: 28),
            GlassCard(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      DropdownButtonFormField<String>(
                        initialValue: _selectedWilaya,
                        dropdownColor: const Color(0xff13131a),
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          labelText: 'Wilaya Hub',
                          labelStyle: const TextStyle(color: Colors.grey),
                          filled: true,
                          fillColor: const Color(0xff0a0a0f).withValues(alpha: 0.5),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey[800]!)),
                        ),
                        items: _wilayas.map((w) => DropdownMenuItem(value: w, child: Text(w))).toList(),
                        onChanged: (val) {
                          if (val != null) {
                            setState(() {
                              _selectedWilaya = val;
                            });
                          }
                        },
                      ),
                      const SizedBox(height: 16),
                      CustomTextField(
                        controller: _originController,
                        label: 'Departure Point',
                        hint: 'e.g. Kouba, Algiers',
                        validator: (val) {
                          if (val == null || val.isEmpty) return 'Departure is required';
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      CustomTextField(
                        controller: _destController,
                        label: 'Destination University',
                        hint: 'e.g. USTHB University, Bab Ezzouar',
                        validator: (val) {
                          if (val == null || val.isEmpty) return 'Destination is required';
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: CustomTextField(
                              controller: _priceController,
                              label: 'Price per Seat',
                              hint: '150 DA',
                              keyboardType: TextInputType.number,
                              validator: (val) {
                                if (val == null || val.isEmpty) return 'Required';
                                return null;
                              },
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: CustomTextField(
                              controller: _seatsController,
                              label: 'Available Seats',
                              hint: '3',
                              keyboardType: TextInputType.number,
                              validator: (val) {
                                if (val == null || val.isEmpty) return 'Required';
                                return null;
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 32),
                      CustomButton(
                        text: 'Publish Commute Ride',
                        onPressed: _submit,
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
