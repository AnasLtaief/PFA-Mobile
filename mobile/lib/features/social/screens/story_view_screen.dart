import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/glass_card.dart';

class StoryViewScreen extends StatefulWidget {
  final String userName;
  final String userAvatar;

  const StoryViewScreen({
    super.key,
    required this.userName,
    required this.userAvatar,
  });

  @override
  State<StoryViewScreen> createState() => _StoryViewScreenState();
}

class _StoryViewScreenState extends State<StoryViewScreen> {
  int _currentSlideIndex = 0;
  double _slideProgress = 0.0;
  Timer? _slideTimer;
  Timer? _progressTimer;

  // Algerian-themed student stories slides
  late final List<Map<String, String>> _slides = [
    {
      'image': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      'caption': 'USTHB Campus Bab Ezzouar looking bright today! ☀️ ready for the exams!',
      'location': 'Alger (16) • USTHB',
    },
    {
      'image': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      'caption': 'Cozy ride sharing to Constantine! Free coffee for my passengers today ☕️🚗',
      'location': 'Constantine (25) • University Constantine 2',
    },
    {
      'image': 'https://images.unsplash.com/photo-1542362567-b07eac790acd?auto=format&fit=crop&w=800&q=80',
      'caption': 'Beautiful sunset drive around Oran Plaza. 🌅 2 seats left for tomorrow morning commute!',
      'location': 'Oran (31) • Université d\'Oran',
    },
  ];

  @override
  void initState() {
    super.initState();
    _startStoryPlayback();
  }

  void _startStoryPlayback() {
    _slideProgress = 0.0;
    _startProgressTimer();

    _slideTimer?.cancel();
    _slideTimer = Timer.periodic(const Duration(milliseconds: 4000), (timer) {
      _nextSlide();
    });
  }

  void _startProgressTimer() {
    _progressTimer?.cancel();
    const tick = Duration(milliseconds: 50);
    _progressTimer = Timer.periodic(tick, (timer) {
      if (!mounted) return;
      setState(() {
        _slideProgress += 50 / 4000;
        if (_slideProgress > 1.0) _slideProgress = 1.0;
      });
    });
  }

  void _nextSlide() {
    if (!mounted) return;
    if (_currentSlideIndex < _slides.length - 1) {
      setState(() {
        _currentSlideIndex++;
      });
      _startStoryPlayback();
    } else {
      context.pop(); // Close stories viewer when completed
    }
  }

  void _prevSlide() {
    if (!mounted) return;
    if (_currentSlideIndex > 0) {
      setState(() {
        _currentSlideIndex--;
      });
      _startStoryPlayback();
    } else {
      _startStoryPlayback(); // Restart current story if on first slide
    }
  }

  @override
  void dispose() {
    _slideTimer?.cancel();
    _progressTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final currentSlide = _slides[_currentSlideIndex];

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Background Image Slide
          Positioned.fill(
            child: GestureDetector(
              onTapUp: (details) {
                final screenWidth = MediaQuery.of(context).size.width;
                if (details.globalPosition.dx < screenWidth / 3) {
                  _prevSlide(); // Left third tap -> Previous
                } else {
                  _nextSlide(); // Right two-thirds tap -> Next
                }
              },
              child: Image.network(
                currentSlide['image']!,
                fit: BoxFit.cover,
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return const Center(child: CircularProgressIndicator(color: Color(0xff00d4aa)));
                },
                errorBuilder: (context, error, stackTrace) => Container(
                  color: const Color(0xff13131a),
                  child: const Center(child: Icon(Icons.broken_image, size: 64, color: Colors.grey)),
                ),
              ),
            ),
          ),

          // Dark Gradient overlays (top for progress indicators, bottom for caption)
          Positioned.fill(
            child: IgnorePointer(
              child: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.black87,
                      Colors.transparent,
                      Colors.transparent,
                      Colors.black87,
                    ],
                    stops: [0.0, 0.2, 0.8, 1.0],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
              ),
            ),
          ),

          // Safe Top Content: Progress Bars, Close & User Profile
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Indicators
                  Row(
                    children: List.generate(_slides.length, (index) {
                      double progress = 0.0;
                      if (index < _currentSlideIndex) {
                        progress = 1.0;
                      } else if (index == _currentSlideIndex) {
                        progress = _slideProgress;
                      }
                      return Expanded(
                        child: Container(
                          height: 3,
                          margin: const EdgeInsets.symmetric(horizontal: 2.0),
                          decoration: BoxDecoration(
                            color: Colors.white24,
                            borderRadius: BorderRadius.circular(2),
                          ),
                          child: FractionallySizedBox(
                            alignment: Alignment.centerLeft,
                            widthFactor: progress,
                            child: Container(
                              decoration: BoxDecoration(
                                color: const Color(0xff00d4aa),
                                borderRadius: BorderRadius.circular(2),
                              ),
                            ),
                          ),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: 16),
                  // User details
                  Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: const Color(0xff00d4aa), width: 1.5),
                          image: DecorationImage(image: NetworkImage(widget.userAvatar), fit: BoxFit.cover),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.userName,
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          Text(
                            currentSlide['location']!,
                            style: const TextStyle(color: Colors.white70, fontSize: 11),
                          ),
                        ],
                      ),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white),
                        onPressed: () => context.pop(),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Bottom Content: Caption & Direct Reply Form
          Positioned(
            left: 20,
            right: 20,
            bottom: 30,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Slide Caption Box
                GlassCard(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Text(
                      currentSlide['caption']!,
                      style: const TextStyle(color: Colors.white, fontSize: 14, height: 1.4),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                // Send Reply Input
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
                        ),
                        child: const TextField(
                          style: TextStyle(color: Colors.white, fontSize: 13),
                          decoration: InputDecoration(
                            hintText: 'Send reply to student...',
                            hintStyle: TextStyle(color: Colors.white54, fontSize: 13),
                            contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      decoration: const BoxDecoration(
                        color: Color(0xff6c63ff),
                        shape: BoxShape.circle,
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.send, color: Colors.white, size: 18),
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Message sent to ${widget.userName}!'),
                              backgroundColor: const Color(0xff6c63ff),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
