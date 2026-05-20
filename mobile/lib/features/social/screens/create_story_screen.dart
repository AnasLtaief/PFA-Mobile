import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/widgets/custom_button.dart';
import '../../../core/theme/widgets/custom_text_field.dart';
import '../../../core/theme/widgets/glass_card.dart';

class CreateStoryScreen extends ConsumerStatefulWidget {
  const CreateStoryScreen({super.key});

  @override
  ConsumerState<CreateStoryScreen> createState() => _CreateStoryScreenState();
}

class _CreateStoryScreenState extends ConsumerState<CreateStoryScreen> {
  final _captionController = TextEditingController();
  bool _isUploading = false;

  @override
  void dispose() {
    _captionController.dispose();
    super.dispose();
  }

  void _postStory() async {
    setState(() {
      _isUploading = true;
    });

    await Future.delayed(const Duration(milliseconds: 1500));

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Story Published Successfully!'), backgroundColor: Color(0xff00d4aa)),
      );
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Add Story', style: TextStyle(fontFamily: 'Syne', fontWeight: FontWeight.bold, color: Colors.white)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: GlassCard(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.add_a_photo_outlined, size: 64, color: Colors.grey[750]),
                      const SizedBox(height: 16),
                      const Text(
                        'Upload Story Image / Video',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Will be visible to all university friends for 24 hours.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey[500], fontSize: 13),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
            CustomTextField(
              controller: _captionController,
              label: 'Story Caption',
              hint: 'Write something fun...',
            ),
            const SizedBox(height: 24),
            CustomButton(
              text: _isUploading ? 'Publishing...' : 'Publish Story',
              onPressed: _isUploading ? () {} : _postStory,
              backgroundColor: const Color(0xff00d4aa),
            ),
          ],
        ),
      ),
    );
  }
}
