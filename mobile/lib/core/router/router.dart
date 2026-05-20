import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/auth/providers/auth_provider.dart';

// Screens
import '../../features/auth/screens/splash_screen.dart';
import '../../features/auth/screens/onboarding_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/register_screen.dart';
import '../../features/auth/screens/forgot_password_screen.dart';
import '../../features/auth/screens/verify_email_screen.dart';
import '../../features/auth/screens/two_fa_setup_screen.dart';
import '../../features/auth/screens/two_fa_verify_screen.dart';
import '../../features/auth/screens/profile_setup_wizard.dart';

// Shell & Feature Screens (Placeholders or imports)
import '../../features/home/screens/home_screen.dart';
import '../../features/rides/screens/rides_screen.dart';
import '../../features/social/screens/social_screen.dart';
import '../../features/profile/screens/profile_screen.dart';
import '../../features/rides/screens/create_ride_screen.dart';
import '../../features/rides/screens/ride_detail_screen.dart';
import '../../features/rides/screens/active_ride_screen.dart';
import '../../features/social/screens/chat_screen.dart';
import '../../features/social/screens/group_detail_screen.dart';
import '../../features/social/screens/create_story_screen.dart';
import '../../features/social/screens/create_moment_screen.dart';
import '../../features/social/screens/story_view_screen.dart';
import '../../features/emergency/screens/sos_screen.dart';
import '../../features/settings/screens/settings_screen.dart';
import '../../features/notifications/screens/notifications_screen.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'root');
final GlobalKey<NavigatorState> _shellNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'shell');

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/splash',
    redirect: (context, state) {
      final isLoggedIn = authState.user != null;
      final isSplashing = state.matchedLocation == '/splash';
      final isOnboarding = state.matchedLocation == '/onboarding';
      final isAuthRoute = state.matchedLocation == '/login' || state.matchedLocation == '/register' || state.matchedLocation == '/forgot-password';

      if (isSplashing) return null; // Let splash handle navigation after a delay

      if (!isLoggedIn) {
        if (isOnboarding || isAuthRoute) return null;
        return '/onboarding';
      }

      // Check if profile needs setup (missing wilaya/university)
      if (authState.user!.wilaya == null || authState.user!.university == null) {
        if (state.matchedLocation == '/profile-setup') return null;
        return '/profile-setup';
      }

      // If logged in and trying to go to auth routes, redirect to home
      if (isAuthRoute || isOnboarding) {
        return '/';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/forgot-password',
        builder: (context, state) => const ForgotPasswordScreen(),
      ),
      GoRoute(
        path: '/verify-email',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'] ?? '';
          return VerifyEmailScreen(token: token);
        },
      ),
      GoRoute(
        path: '/2fa-setup',
        builder: (context, state) => const TwoFASetupScreen(),
      ),
      GoRoute(
        path: '/2fa-verify',
        builder: (context, state) => const TwoFAVerifyScreen(),
      ),
      GoRoute(
        path: '/profile-setup',
        builder: (context, state) => const ProfileSetupWizard(),
      ),

      // App Shell with Bottom Navigation
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) {
          return AppShell(child: child);
        },
        routes: [
          GoRoute(
            path: '/',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/rides',
            builder: (context, state) => const RidesScreen(),
          ),
          GoRoute(
            path: '/social',
            builder: (context, state) => const SocialScreen(),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),

      // Non-shell nested routes
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/rides/create',
        builder: (context, state) => const CreateRideScreen(),
      ),
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/rides/active',
        builder: (context, state) => const ActiveRideScreen(),
      ),
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/rides/:id',
        builder: (context, state) {
          final rideId = state.pathParameters['id'] ?? '';
          return RideDetailScreen(rideId: rideId);
        },
      ),
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/social/chat/:userId',
        builder: (context, state) {
          final userId = state.pathParameters['userId'] ?? '';
          return ChatScreen(userId: userId);
        },
      ),
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/social/groups/:id',
        builder: (context, state) {
          final groupId = state.pathParameters['id'] ?? '';
          return GroupDetailScreen(groupId: groupId);
        },
      ),
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/social/story/create',
        builder: (context, state) => const CreateStoryScreen(),
      ),
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/social/story/view',
        builder: (context, state) {
          final extra = state.extra as Map<String, dynamic>? ?? {};
          final userName = extra['userName'] as String? ?? 'Student';
          final userAvatar = extra['userAvatar'] as String? ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
          return StoryViewScreen(userName: userName, userAvatar: userAvatar);
        },
      ),
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/social/moment/create',
        builder: (context, state) => const CreateMomentScreen(),
      ),
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/emergency',
        builder: (context, state) => const SOSScreen(),
      ),
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/notifications',
        builder: (context, state) => const NotificationsScreen(),
      ),
    ],
  );
});

class AppShell extends ConsumerWidget {
  final Widget child;
  const AppShell({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final GoRouter router = GoRouter.of(context);
    final String location = router.routeInformationProvider.value.uri.path;

    int calculateSelectedIndex() {
      if (location == '/') return 0;
      if (location == '/rides') return 1;
      if (location == '/social') return 2;
      if (location == '/profile') return 3;
      return 0;
    }

    void onItemTapped(int index) {
      switch (index) {
        case 0:
          context.go('/');
          break;
        case 1:
          context.go('/rides');
          break;
        case 2:
          context.go('/social');
          break;
        case 3:
          context.go('/profile');
          break;
      }
    }

    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: calculateSelectedIndex(),
        onTap: onItemTapped,
        type: BottomNavigationBarType.fixed,
        backgroundColor: const Color(0xff13131a),
        selectedItemColor: const Color(0xff6c63ff),
        unselectedItemColor: Colors.grey[500],
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.explore_outlined), activeIcon: Icon(Icons.explore), label: 'Feed'),
          BottomNavigationBarItem(icon: Icon(Icons.directions_car_outlined), activeIcon: Icon(Icons.directions_car), label: 'Rides'),
          BottomNavigationBarItem(icon: Icon(Icons.people_outline), activeIcon: Icon(Icons.people), label: 'Social'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}
