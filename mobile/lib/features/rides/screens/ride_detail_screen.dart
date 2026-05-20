import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../../../core/theme/widgets/custom_button.dart';
import '../../../core/theme/widgets/glass_card.dart';

class RideDetailScreen extends ConsumerStatefulWidget {
  final String rideId;
  const RideDetailScreen({super.key, required this.rideId});

  @override
  ConsumerState<RideDetailScreen> createState() => _RideDetailScreenState();
}

class _RideDetailScreenState extends ConsumerState<RideDetailScreen> {
  GoogleMapController? _mapController;
  final Set<Marker> _markers = {};
  final Set<Polyline> _polylines = {};

  final LatLng _origin = const LatLng(36.3262, 6.6218); // Zouaghi Slimane, Constantine
  final LatLng _destination = const LatLng(36.2483, 6.5701); // University Constantine 2

  static const String _darkMapStyle = '''
[
  {
    "elementType": "geometry",
    "stylers": [{"color": "#13131a"}]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#8ec3b9"}]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{"color": "#1a1b26"}]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{"color": "#24283b"}]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{"color": "#3b4261"}]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{"color": "#0a0a0f"}]
  }
]
  ''';

  @override
  void initState() {
    super.initState();
    _initMapData();
  }

  void _initMapData() {
    _markers.add(
      Marker(
        markerId: const MarkerId('origin'),
        position: _origin,
        infoWindow: const InfoWindow(title: 'Origin', snippet: 'Zouaghi Slimane, Constantine'),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueCyan),
      ),
    );

    _markers.add(
      Marker(
        markerId: const MarkerId('destination'),
        position: _destination,
        infoWindow: const InfoWindow(title: 'Destination', snippet: 'University Constantine 2'),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange),
      ),
    );

    _polylines.add(
      Polyline(
        polylineId: const PolylineId('route'),
        points: [_origin, _destination],
        color: const Color(0xff6c63ff),
        width: 5,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final ride = <String, String>{
      'host': 'Anas Rahmani',
      'avatar': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256',
      'university': 'University of Constantine 2',
      'origin': 'Zouaghi Slimane, Constantine',
      'destination': 'University Constantine 2 - Abdelhamid Mehri',
      'price': '150 DA',
      'seats': '3',
      'time': '08:30 AM',
      'car': 'Dacia Sandero Stepway (2022) • Gray',
      'plate': '05132-122-25',
    };

    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Ride Details', style: TextStyle(fontFamily: 'Syne', fontWeight: FontWeight.bold, color: Colors.white)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Interactive Map Component
            Container(
              height: 220,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.grey[800]!),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(23),
                child: Stack(
                  children: [
                    GoogleMap(
                      initialCameraPosition: CameraPosition(
                        target: LatLng((_origin.latitude + _destination.latitude) / 2, (_origin.longitude + _destination.longitude) / 2),
                        zoom: 11.5,
                      ),
                      markers: _markers,
                      polylines: _polylines,
                      zoomControlsEnabled: false,
                      myLocationButtonEnabled: false,
                      onMapCreated: (controller) {
                        _mapController = controller;
                        _mapController?.setMapStyle(_darkMapStyle);
                      },
                    ),
                    Positioned(
                      bottom: 12,
                      left: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(color: Colors.black.withOpacity(0.7), borderRadius: BorderRadius.circular(12)),
                        child: const Row(
                          children: [
                            Icon(Icons.gps_fixed, color: Color(0xff00d4aa), size: 14),
                            SizedBox(width: 6),
                            Text('Live Interactive Route', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            // Driver Profile
            GlassCard(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Row(
                  children: [
                    CircleAvatar(
                      backgroundImage: NetworkImage(ride['avatar']!),
                      radius: 28,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(ride['host']!, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
                          const SizedBox(height: 4),
                          Text(ride['university']!, style: TextStyle(color: Colors.grey[500], fontSize: 13)),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.chat_bubble_outline, color: Color(0xff00d4aa)),
                      onPressed: () => context.push('/social/chat/user_anas'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Ride Specs
            GlassCard(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text('Commute Details', style: TextStyle(fontFamily: 'Syne', fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        const Icon(Icons.radio_button_checked, color: Color(0xff00d4aa), size: 20),
                        const SizedBox(width: 12),
                        Expanded(child: Text(ride['origin']!, style: const TextStyle(color: Colors.white))),
                      ],
                    ),
                    const Padding(
                      padding: EdgeInsets.only(left: 9.0),
                      child: SizedBox(height: 16, child: VerticalDivider(color: Colors.grey, width: 2)),
                    ),
                    Row(
                      children: [
                        const Icon(Icons.location_on, color: Color(0xffff6b35), size: 20),
                        const SizedBox(width: 12),
                        Expanded(child: Text(ride['destination']!, style: const TextStyle(color: Colors.white))),
                      ],
                    ),
                    const SizedBox(height: 20),
                    const Divider(color: Color(0xff22222a)),
                    const SizedBox(height: 12),
                    ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.directions_car_filled, color: Colors.grey),
                      title: const Text('Car Details', style: TextStyle(color: Colors.white, fontSize: 14)),
                      subtitle: Text(ride['car']!, style: TextStyle(color: Colors.grey[500], fontSize: 13)),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(color: Colors.grey[900], borderRadius: BorderRadius.circular(6)),
                        child: Text(ride['plate']!, style: const TextStyle(color: Colors.white, fontSize: 12, fontFamily: 'monospace')),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),
            Row(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Total Price', style: TextStyle(color: Colors.grey[600], fontSize: 13)),
                    const SizedBox(height: 4),
                    Text(ride['price']!, style: const TextStyle(color: Color(0xff6c63ff), fontSize: 24, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(width: 32),
                Expanded(
                  child: CustomButton(
                    text: 'Book a Seat',
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Commute Seat Booked! Awaiting Host Confirmation.'),
                          backgroundColor: Color(0xff6c63ff),
                        ),
                      );
                      context.pop();
                    },
                    backgroundColor: const Color(0xff6c63ff),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
