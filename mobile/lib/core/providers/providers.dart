import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/storage_service.dart';
import '../services/api_service.dart';
import '../services/socket_service.dart';
import '../services/stripe_service.dart';

// Storage Service Provider
final storageServiceProvider = Provider<StorageService>((ref) {
  // StorageService must be initialized in main.dart before the app starts
  return StorageService();
});

// API Service Provider
final apiServiceProvider = Provider<ApiService>((ref) {
  final storage = ref.watch(storageServiceProvider);
  return ApiService(storage);
});

// Socket Service Provider
final socketServiceProvider = Provider<SocketService>((ref) {
  final storage = ref.watch(storageServiceProvider);
  return SocketService(storage);
});

// Stripe Service Provider
final stripeServiceProvider = Provider<StripeService>((ref) {
  final api = ref.watch(apiServiceProvider);
  return StripeService(api);
});
