import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'api_service.dart';

class StripeService {
  final ApiService _apiService;

  static const String _publishableKey = 'pk_test_51OpP123456789'; // Dev publishable key

  StripeService(this._apiService);

  Future<void> init() async {
    Stripe.publishableKey = const String.fromEnvironment('STRIPE_PUBLISHABLE_KEY', defaultValue: _publishableKey);
    await Stripe.instance.applySettings();
  }

  Future<bool> processPayment({
    required String bookingId,
    required double amount, // DZD
  }) async {
    try {
      // 1. Create Payment Intent on our Node.js Backend
      final response = await _apiService.post('/payments/create-intent', data: {
        'bookingId': bookingId,
        'amount': amount,
      });

      if (response.statusCode != 200 || response.data == null) {
        return false;
      }

      final data = response.data['data'];
      final clientSecret = data['clientSecret'] as String;

      // 2. Initialize Payment Sheet
      await Stripe.instance.initPaymentSheet(
        paymentSheetParameters: SetupPaymentSheetParameters(
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'Campus Covoiturage',
          style: ThemeMode.dark,
        ),
      );

      // 3. Present Payment Sheet
      await Stripe.instance.presentPaymentSheet();

      // If no exceptions thrown, payment succeeded
      return true;
    } catch (e) {
      print('Stripe Payment Process Error: $e');
      if (e is StripeException) {
        print('Stripe error details: ${e.error.localizedMessage}');
      }
      return false;
    }
  }
}
