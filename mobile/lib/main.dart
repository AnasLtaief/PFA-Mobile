import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'app.dart';
import 'core/services/storage_service.dart';
import 'core/providers/providers.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Local Hive Database
  final storageService = StorageService();
  await storageService.init();

  // Initialize Stripe Payments (Test Mode Key)
  try {
    Stripe.publishableKey = const String.fromEnvironment(
      'STRIPE_PUBLISHABLE_KEY',
      defaultValue: 'pk_test_51O mock_stripe_publishable_key_12345',
    );
    await Stripe.instance.applySettings();
  } catch (e) {
    print('Failed to initialize Stripe: $e');
  }

  runApp(
    ProviderScope(
      overrides: [
        // Inject the initialized storage service
        storageServiceProvider.overrideWithValue(storageService),
      ],
      child: const CampusCovoiturageApp(),
    ),
  );
}
