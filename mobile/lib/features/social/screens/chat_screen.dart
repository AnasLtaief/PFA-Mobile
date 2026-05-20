import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/providers/providers.dart';

class ChatScreen extends ConsumerStatefulWidget {
  final String userId;
  const ChatScreen({super.key, required this.userId});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final _msgController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {'sender': 'them', 'text': 'Hey! Are we still on for tomorrow\'s ride?', 'time': '10:00 AM'},
    {'sender': 'me', 'text': 'Yes! I will pick you up at 07:45 AM from Kouba.', 'time': '10:02 AM'},
    {'sender': 'them', 'text': 'Perfect! Thank you so much, see you then.', 'time': '10:03 AM'},
  ];

  @override
  void initState() {
    super.initState();
    // Connect socket and listen for real-time messages
    final socket = ref.read(socketServiceProvider);
    socket.connect();
    socket.joinRoom(widget.userId);
    socket.onReceiveMessage((data) {
      if (mounted) {
        setState(() {
          _messages.add({
            'sender': 'them',
            'text': data['content'] ?? '',
            'time': 'Just now',
          });
        });
      }
    });
  }

  void _send() {
    final text = _msgController.text.trim();
    if (text.isEmpty) return;

    ref.read(socketServiceProvider).sendMessage(
      roomId: widget.userId,
      content: text,
      receiverId: widget.userId,
    );

    setState(() {
      _messages.add({
        'sender': 'me',
        'text': text,
        'time': 'Just now',
      });
      _msgController.clear();
    });
  }

  @override
  void dispose() {
    ref.read(socketServiceProvider).leaveRoom(widget.userId);
    _msgController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      appBar: AppBar(
        backgroundColor: const Color(0xff13131a),
        elevation: 0,
        title: Row(
          children: [
            const CircleAvatar(
              backgroundImage: NetworkImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256'),
              radius: 18,
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Sara Benzaid', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                Text('USTHB University', style: TextStyle(color: Colors.grey[500], fontSize: 11)),
              ],
            ),
          ],
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isMe = msg['sender'] == 'me';
                return Align(
                  alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                    decoration: BoxDecoration(
                      color: isMe ? const Color(0xff6c63ff) : const Color(0xff13131a),
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(16),
                        topRight: const Radius.circular(16),
                        bottomLeft: Radius.circular(isMe ? 16 : 0),
                        bottomRight: Radius.circular(isMe ? 0 : 16),
                      ),
                      border: isMe ? null : Border.all(color: Colors.grey[900]!),
                    ),
                    child: Column(
                      crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                      children: [
                        Text(msg['text']!, style: const TextStyle(color: Colors.white, fontSize: 15)),
                        const SizedBox(height: 4),
                        Text(msg['time']!, style: TextStyle(color: isMe ? Colors.white.withOpacity(0.6) : Colors.grey[600], fontSize: 10)),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          // Input row
          Container(
            padding: const EdgeInsets.only(left: 20, right: 20, bottom: 30, top: 12),
            color: const Color(0xff13131a),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _msgController,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Type your message...',
                      hintStyle: TextStyle(color: Colors.grey[600]),
                      filled: true,
                      fillColor: const Color(0xff0a0a0f),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                FloatingActionButton(
                  mini: true,
                  onPressed: _send,
                  backgroundColor: const Color(0xff00d4aa),
                  child: const Icon(Icons.send, color: Colors.black, size: 18),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
