import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/custom_button.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  final List<OnboardingSlide> _slides = [
    OnboardingSlide(
      title: 'Student Only\nCarpooling',
      description: 'Travel safely with verified students from your own university. Save money, meet peers, and protect the environment.',
      icon: Icons.school_rounded,
      color: const Color(0xff6c63ff),
    ),
    OnboardingSlide(
      title: 'Moments &\nReal-time DMs',
      description: 'Share your rides as stories and moments. Chat in real-time, join wilaya community groups, and build lifelong friendships.',
      icon: Icons.chat_bubble_rounded,
      color: const Color(0xff00d4aa),
    ),
    OnboardingSlide(
      title: 'Emergency SOS\n& Safety First',
      description: 'Activate safety features like shake detection to trigger automated SOS, send instant emergency SMS, and track rides in real-time.',
      icon: Icons.security_rounded,
      color: const Color(0xffff6b35),
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      body: Stack(
        children: [
          // Background Gradient decoration
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _slides[_currentIndex].color.withValues(alpha: 0.15),
              ),
            ),
          ),
          PageView.builder(
            controller: _pageController,
            itemCount: _slides.length,
            onPageChanged: (index) {
              setState(() {
                _currentIndex = index;
              });
            },
            itemBuilder: (context, index) {
              final slide = _slides[index];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 60),
                    Container(
                      height: 160,
                      width: 160,
                      decoration: BoxDecoration(
                        color: slide.color.withValues(alpha: 0.08),
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: slide.color.withValues(alpha: 0.3),
                          width: 2,
                        ),
                      ),
                      child: Icon(
                        slide.icon,
                        size: 80,
                        color: slide.color,
                      ),
                    ),
                    const SizedBox(height: 60),
                    Text(
                      slide.title,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontFamily: 'Syne',
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        height: 1.25,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      slide.description,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontFamily: 'PlusJakartaSans',
                        fontSize: 16,
                        color: Colors.grey[400],
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
          Positioned(
            bottom: 60,
            left: 32,
            right: 32,
            child: Column(
              children: [
                // Indicators
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(
                    _slides.length,
                    (index) => AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      height: 6,
                      width: _currentIndex == index ? 24 : 6,
                      decoration: BoxDecoration(
                        color: _currentIndex == index ? _slides[_currentIndex].color : Colors.grey[700],
                        borderRadius: BorderRadius.circular(3),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 48),
                // Navigation buttons
                Row(
                  children: [
                    if (_currentIndex < _slides.length - 1) ...[
                      TextButton(
                        onPressed: () {
                          _pageController.animateToPage(
                            _slides.length - 1,
                            duration: const Duration(milliseconds: 500),
                            curve: Curves.easeInOut,
                          );
                        },
                        child: Text(
                          'Skip',
                          style: TextStyle(
                            fontFamily: 'PlusJakartaSans',
                            color: Colors.grey[500],
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      const Spacer(),
                      CustomButton(
                        text: 'Next',
                        width: 120,
                        backgroundColor: _slides[_currentIndex].color,
                        onPressed: () {
                          _pageController.nextPage(
                            duration: const Duration(milliseconds: 350),
                            curve: Curves.easeInOut,
                          );
                        },
                      ),
                    ] else ...[
                      Expanded(
                        child: CustomButton(
                          text: 'Get Started',
                          backgroundColor: const Color(0xff6c63ff),
                          onPressed: () {
                            context.go('/register');
                          },
                        ),
                      ),
                    ],
                  ],
                ),
                if (_currentIndex == _slides.length - 1) ...[
                  const SizedBox(height: 16),
                  TextButton(
                    onPressed: () {
                      context.go('/login');
                    },
                    child: RichText(
                      text: TextSpan(
                        text: 'Already have an account? ',
                        style: TextStyle(
                          fontFamily: 'PlusJakartaSans',
                          color: Colors.grey[400],
                          fontSize: 14,
                        ),
                        children: const [
                          TextSpan(
                            text: 'Login',
                            style: TextStyle(
                              color: Color(0xff6c63ff),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class OnboardingSlide {
  final String title;
  final String description;
  final IconData icon;
  final Color color;

  OnboardingSlide({
    required this.title,
    required this.description,
    required this.icon,
    required this.color,
  });
}
