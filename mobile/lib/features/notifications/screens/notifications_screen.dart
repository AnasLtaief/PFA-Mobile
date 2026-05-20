import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/glass_card.dart';

enum NotificationType { ride, chat, payment, sos, info }

class NotificationItem {
  final String id;
  final String title;
  final String body;
  final DateTime timestamp;
  final NotificationType type;
  bool isRead;

  NotificationItem({
    required this.id,
    required this.title,
    required this.body,
    required this.timestamp,
    required this.type,
    this.isRead = false,
  });
}

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  bool _isLoading = true;
  List<NotificationItem> _notifications = [];

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    await Future.delayed(const Duration(milliseconds: 1200));
    if (mounted) {
      setState(() {
        _notifications = [
          NotificationItem(
            id: '1',
            title: 'Ride Confirmed!',
            body: 'Amine accepted your booking request for tomorrow at 08:00 to USTHB.',
            timestamp: DateTime.now().subtract(const Duration(minutes: 15)),
            type: NotificationType.ride,
          ),
          NotificationItem(
            id: '2',
            title: 'New Message from Sarah',
            body: '"Hey, are we still on for the 14:00 ride back to Blida?"',
            timestamp: DateTime.now().subtract(const Duration(hours: 2)),
            type: NotificationType.chat,
            isRead: true,
          ),
          NotificationItem(
            id: '3',
            title: 'Payment Succeeded',
            body: 'Successfully paid 150 DZD using Card for Ride #4928.',
            timestamp: DateTime.now().subtract(const Duration(hours: 4)),
            type: NotificationType.payment,
            isRead: true,
          ),
          NotificationItem(
            id: '4',
            title: 'Safety Warning',
            body: 'Adverse weather reported near Alger Centre. Ride carefully and stay updated.',
            timestamp: DateTime.now().subtract(const Duration(days: 1)),
            type: NotificationType.sos,
            isRead: true,
          ),
          NotificationItem(
            id: '5',
            title: 'Welcome to Campus Covoiturage!',
            body: 'Complete your profile setup to matching with verified student hosts.',
            timestamp: DateTime.now().subtract(const Duration(days: 2)),
            type: NotificationType.info,
            isRead: true,
          ),
        ];
        _isLoading = false;
      });
    }
  }

  void _markAllAsRead() {
    setState(() {
      for (var item in _notifications) {
        item.isRead = true;
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('All notifications marked as read.'),
        backgroundColor: Color(0xff00d4aa),
      ),
    );
  }

  void _deleteNotification(String id) {
    setState(() {
      _notifications.removeWhere((item) => item.id == id);
    });
  }

  IconData _getIconForType(NotificationType type) {
    switch (type) {
      case NotificationType.ride:
        return Icons.directions_car;
      case NotificationType.chat:
        return Icons.chat_bubble_outline;
      case NotificationType.payment:
        return Icons.payment;
      case NotificationType.sos:
        return Icons.warning_amber;
      case NotificationType.info:
        return Icons.info_outline;
    }
  }

  Color _getColorForType(NotificationType type) {
    switch (type) {
      case NotificationType.ride:
        return const Color(0xff6c63ff);
      case NotificationType.chat:
        return const Color(0xff00d4aa);
      case NotificationType.payment:
        return Colors.green;
      case NotificationType.sos:
        return const Color(0xffff6b35);
      case NotificationType.info:
        return Colors.blue;
    }
  }

  String _formatTime(DateTime time) {
    final now = DateTime.now();
    final difference = now.difference(time);

    if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else {
      return '${difference.inDays}d ago';
    }
  }

  @override
  Widget build(BuildContext context) {
    final unreadCount = _notifications.where((n) => !n.isRead).length;

    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      appBar: AppBar(
        backgroundColor: const Color(0xff0a0a0f),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Notifications',
          style: TextStyle(
            fontFamily: 'Syne',
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        actions: [
          if (_notifications.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.done_all, color: Color(0xff00d4aa)),
              tooltip: 'Mark all as read',
              onPressed: _markAllAsRead,
            ),
        ],
      ),
      body: _isLoading
          ? _buildShimmerLoading()
          : _notifications.isEmpty
              ? _buildEmptyState()
              : Column(
                  children: [
                    if (unreadCount > 0)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xff6c63ff).withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '$unreadCount New',
                                style: const TextStyle(
                                  color: Color(0xff6c63ff),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    Expanded(
                      child: ListView.builder(
                        padding: const EdgeInsets.all(20),
                        itemCount: _notifications.length,
                        itemBuilder: (context, index) {
                          final item = _notifications[index];
                          return Dismissible(
                            key: Key(item.id),
                            direction: DismissDirection.endToStart,
                            background: Container(
                              alignment: Alignment.centerRight,
                              padding: const EdgeInsets.only(right: 20),
                              decoration: BoxDecoration(
                                color: const Color(0xffff6b35).withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: const Icon(Icons.delete_outline, color: Color(0xffff6b35)),
                            ),
                            onDismissed: (_) => _deleteNotification(item.id),
                            child: Padding(
                              padding: const EdgeInsets.only(bottom: 16.0),
                              child: InkWell(
                                onTap: () {
                                  setState(() {
                                    item.isRead = true;
                                  });
                                  if (item.type == NotificationType.ride) {
                                    context.push('/rides');
                                  } else if (item.type == NotificationType.chat) {
                                    context.push('/social');
                                  }
                                },
                                child: Stack(
                                  children: [
                                    GlassCard(
                                      child: Padding(
                                        padding: const EdgeInsets.all(16.0),
                                        child: Row(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            CircleAvatar(
                                              radius: 20,
                                              backgroundColor: _getColorForType(item.type).withValues(alpha: 0.12),
                                              child: Icon(
                                                _getIconForType(item.type),
                                                color: _getColorForType(item.type),
                                                size: 20,
                                              ),
                                            ),
                                            const SizedBox(width: 16),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Row(
                                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                    children: [
                                                      Expanded(
                                                        child: Text(
                                                          item.title,
                                                          style: const TextStyle(
                                                            color: Colors.white,
                                                            fontWeight: FontWeight.bold,
                                                            fontSize: 15,
                                                          ),
                                                        ),
                                                      ),
                                                      Text(
                                                        _formatTime(item.timestamp),
                                                        style: TextStyle(
                                                          color: Colors.grey[500],
                                                          fontSize: 11,
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  const SizedBox(height: 6),
                                                  Text(
                                                    item.body,
                                                    style: TextStyle(
                                                      color: Colors.grey[400],
                                                      fontSize: 13,
                                                      height: 1.4,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                    if (!item.isRead)
                                      Positioned(
                                        top: 12,
                                        right: 12,
                                        child: Container(
                                          width: 8,
                                          height: 8,
                                          decoration: const BoxDecoration(
                                            color: Color(0xff6c63ff),
                                            shape: BoxShape.circle,
                                          ),
                                        ),
                                      ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.notifications_none, size: 64, color: Colors.grey[700]),
          const SizedBox(height: 16),
          const Text(
            'All caught up!',
            style: TextStyle(
              fontFamily: 'Syne',
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'No notifications to show right now.',
            style: TextStyle(color: Colors.grey[500]),
          ),
        ],
      ),
    );
  }

  Widget _buildShimmerLoading() {
    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: 4,
      itemBuilder: (context, index) => Padding(
        padding: const EdgeInsets.only(bottom: 16.0),
        child: Container(
          height: 90,
          decoration: BoxDecoration(
            color: const Color(0xff13131a).withValues(alpha: 0.5),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xff22222a)),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: Colors.grey[900],
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(width: 120, height: 12, color: Colors.grey[900]),
                      const SizedBox(height: 8),
                      Container(width: double.infinity, height: 10, color: Colors.grey[900]),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
