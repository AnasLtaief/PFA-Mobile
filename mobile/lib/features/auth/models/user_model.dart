class UserModel {
  final String id;
  final String fullName;
  final String email;
  final String? phone;
  final String? avatarUrl;
  final String? bio;
  final String? university;
  final String? wilaya;
  final bool isVerified;
  final bool isHost;
  final String role;
  final bool twoFAEnabled;
  final String? stripeAccountId;
  final Map<String, dynamic>? emergencyContact;

  UserModel({
    required this.id,
    required this.fullName,
    required this.email,
    this.phone,
    this.avatarUrl,
    this.bio,
    this.university,
    this.wilaya,
    required this.isVerified,
    required this.isHost,
    required this.role,
    required this.twoFAEnabled,
    this.stripeAccountId,
    this.emergencyContact,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? json['_id'] ?? '',
      fullName: json['fullName'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      avatarUrl: json['avatarUrl'],
      bio: json['bio'],
      university: json['university'],
      wilaya: json['wilaya'],
      isVerified: json['isVerified'] ?? false,
      isHost: json['isHost'] ?? false,
      role: json['role'] ?? 'USER',
      twoFAEnabled: json['twoFAEnabled'] ?? false,
      stripeAccountId: json['stripeAccountId'],
      emergencyContact: json['emergencyContact'] != null
          ? Map<String, dynamic>.from(json['emergencyContact'] as Map)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'email': email,
      'phone': phone,
      'avatarUrl': avatarUrl,
      'bio': bio,
      'university': university,
      'wilaya': wilaya,
      'isVerified': isVerified,
      'isHost': isHost,
      'role': role,
      'twoFAEnabled': twoFAEnabled,
      'stripeAccountId': stripeAccountId,
      'emergencyContact': emergencyContact,
    };
  }

  UserModel copyWith({
    String? fullName,
    String? email,
    String? phone,
    String? avatarUrl,
    String? bio,
    String? university,
    String? wilaya,
    bool? isVerified,
    bool? isHost,
    String? role,
    bool? twoFAEnabled,
    String? stripeAccountId,
    Map<String, dynamic>? emergencyContact,
  }) {
    return UserModel(
      id: id,
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      bio: bio ?? this.bio,
      university: university ?? this.university,
      wilaya: wilaya ?? this.wilaya,
      isVerified: isVerified ?? this.isVerified,
      isHost: isHost ?? this.isHost,
      role: role ?? this.role,
      twoFAEnabled: twoFAEnabled ?? this.twoFAEnabled,
      stripeAccountId: stripeAccountId ?? this.stripeAccountId,
      emergencyContact: emergencyContact ?? this.emergencyContact,
    );
  }
}
