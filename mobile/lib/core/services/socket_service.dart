import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'storage_service.dart';

class SocketService {
  final StorageService _storageService;
  IO.Socket? _socket;

  static const String _defaultSocketUrl = 'http://10.0.2.2:5000';

  SocketService(this._storageService);

  IO.Socket? get socket => _socket;

  void connect() {
    if (_socket != null && _socket!.connected) return;

    final token = _storageService.getAccessToken();
    if (token == null) return;

    final socketUrl = const String.fromEnvironment('SOCKET_URL', defaultValue: _defaultSocketUrl);

    _socket = IO.io(
      socketUrl,
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .setAuth({'token': token})
          .build(),
    );

    _socket!.connect();

    _socket!.onConnect((_) {
      print('Socket connected: ${_socket!.id}');
    });

    _socket!.onDisconnect((_) {
      print('Socket disconnected');
    });

    _socket!.onConnectError((err) {
      print('Socket connection error: $err');
    });
  }

  void disconnect() {
    if (_socket != null) {
      _socket!.disconnect();
      _socket!.close();
      _socket = null;
    }
  }

  // Join Room
  void joinRoom(String roomId) {
    _socket?.emit('join_room', roomId);
  }

  // Leave Room
  void leaveRoom(String roomId) {
    _socket?.emit('leave_room', roomId);
  }

  // Send message
  void sendMessage({
    required String roomId,
    required String content,
    String? mediaUrl,
    String? receiverId,
    bool isGroup = false,
  }) {
    _socket?.emit('send_message', {
      'roomId': roomId,
      'content': content,
      'mediaUrl': mediaUrl,
      'receiverId': receiverId,
      'isGroup': isGroup,
    });
  }

  // Notify Typing
  void setTyping(String roomId, bool isTyping) {
    if (isTyping) {
      _socket?.emit('typing', {'roomId': roomId});
    } else {
      _socket?.emit('stop_typing', {'roomId': roomId});
    }
  }

  // Register listeners
  void onReceiveMessage(Function(dynamic data) callback) {
    _socket?.on('receive_message', callback);
  }

  void onTypingStatus(Function(dynamic data) callback) {
    _socket?.on('typing', callback);
    _socket?.on('stop_typing', callback);
  }

  void onNewNotification(Function(dynamic data) callback) {
    _socket?.on('new_notification', callback);
  }

  void onRideStatusUpdate(Function(dynamic data) callback) {
    _socket?.on('ride_status_update', callback);
  }
}
