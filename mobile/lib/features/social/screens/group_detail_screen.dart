import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/providers/providers.dart';

class GroupDetailScreen extends ConsumerStatefulWidget {
  final String groupId;
  const GroupDetailScreen({super.key, required this.groupId});

  @override
  ConsumerState<GroupDetailScreen> createState() => _GroupDetailScreenState();
}

class _GroupDetailScreenState extends ConsumerState<GroupDetailScreen> {
  final _msgController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {'sender': 'Amine K.', 'text': 'Hey everyone! Is anyone driving from Kouba to Bab Ezzouar tomorrow morning?', 'time': '09:30 AM', 'color': Color(0xff00d4aa)},
    {'sender': 'Sara B.', 'text': 'Yes, I am! I have 2 seats left. Leaving around 07:45 AM. Feel free to book on the feed!', 'time': '09:35 AM', 'color': Color(0xff6c63ff)},
    {'sender': 'Lydia M.', 'text': 'I will book one, thank you Sara!', 'time': '09:40 AM', 'color': Colors.amber},
  ];

  @override
  void initState() {
    super.initState();
    final socket = ref.read(socketServiceProvider);
    socket.connect();
    socket.joinRoom(widget.groupId);
    socket.onReceiveMessage((data) {
      if (mounted) {
        setState(() {
          _messages.add({
            'sender': data['senderName'] ?? 'Student',
            'text': data['content'] ?? '',
            'time': 'Just now',
            'color': Colors.grey,
          });
        });
      }
    });
  }

  void _send() {
    final text = _msgController.text.trim();
    if (text.isEmpty) return;

    ref.read(socketServiceProvider).sendMessage(
      roomId: widget.groupId,
      content: text,
      isGroup: true,
    );

    setState(() {
      _messages.add({
        'sender': 'Me',
        'text': text,
        'time': 'Just now',
        'color': const Color(0xff6c63ff),
      });
      _msgController.clear();
    });
  }

  @override
  void dispose() {
    ref.read(socketServiceProvider).leaveRoom(widget.groupId);
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
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Alger Campus Communes', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            Text('1,420 Algerian Students', style: TextStyle(color: Colors.grey[500], fontSize: 11)),
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
                final isMe = msg['sender'] == 'Me';
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
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (!isMe)
                          Text(
                            msg['sender']!,
                            style: TextStyle(color: msg['color'], fontWeight: FontWeight.bold, fontSize: 12),
                          ),
                        if (!isMe) const SizedBox(height: 4),
                        Text(msg['text']!, style: const TextStyle(color: Colors.white, fontSize: 15)),
                        const SizedBox(height: 4),
                        Align(
                          alignment: Alignment.bottomRight,
                          child: Text(msg['time']!, style: TextStyle(color: isMe ? Colors.white.withOpacity(0.6) : Colors.grey[600], fontSize: 9)),
                        ),
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
                      hintText: 'Message group...',
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
