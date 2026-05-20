import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../../../core/theme/widgets/custom_button.dart';
import '../../../core/theme/widgets/glass_card.dart';

class ActiveRideScreen extends ConsumerStatefulWidget {
  const ActiveRideScreen({super.key});

  @override
  ConsumerState<ActiveRideScreen> createState() => _ActiveRideScreenState();
}

class _ActiveRideScreenState extends ConsumerState<ActiveRideScreen> {
  bool _isCompleted = false;
  double _rating = 5.0;

  GoogleMapController? _mapController;
  final Set<Marker> _markers = {};
  final Set<Polyline> _polylines = {};
  Timer? _movementTimer;

  final LatLng _origin = const LatLng(36.7262, 3.0847); // Kouba, Algiers
  final LatLng _destination = const LatLng(36.7118, 3.1729); // USTHB University, Bab Ezzouar
  late LatLng _driverPosition;
  int _currentStep = 0;
  final int _totalSteps = 15;

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
    _driverPosition = _origin;
    _initMapData();
    _startMovementSimulation();
  }

  void _initMapData() {
    _markers.add(
      Marker(
        markerId: const MarkerId('origin'),
        position: _origin,
        infoWindow: const InfoWindow(title: 'Origin Hub', snippet: 'Kouba, Algiers'),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueCyan),
      ),
    );

    _markers.add(
      Marker(
        markerId: const MarkerId('destination'),
        position: _destination,
        infoWindow: const InfoWindow(title: 'Destination Campus', snippet: 'USTHB University, Bab Ezzouar'),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange),
      ),
    );

    _polylines.add(
      Polyline(
        polylineId: const PolylineId('active_route'),
        points: [_origin, _destination],
        color: const Color(0xff6c63ff),
        width: 5,
      ),
    );

    _updateDriverMarker();
  }

  void _updateDriverMarker() {
    _markers.removeWhere((m) => m.markerId.value == 'driver');
    _markers.add(
      Marker(
        markerId: const MarkerId('driver'),
        position: _driverPosition,
        infoWindow: const InfoWindow(title: 'Omar (Driver)', snippet: 'Dacia Sandero Stepway'),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
      ),
    );
  }

  void _startMovementSimulation() {
    _movementTimer = Timer.periodic(const Duration(seconds: 4), (timer) {
      if (!mounted) return;
      if (_currentStep < _totalSteps) {
        setState(() {
          _currentStep++;
          double fraction = _currentStep / _totalSteps;
          double lat = _origin.latitude + (_destination.latitude - _origin.latitude) * fraction;
          double lng = _origin.longitude + (_destination.longitude - _origin.longitude) * fraction;
          _driverPosition = LatLng(lat, lng);
          _updateDriverMarker();
        });
        _mapController?.animateCamera(CameraUpdate.newLatLng(_driverPosition));
      } else {
        _movementTimer?.cancel();
      }
    });
  }

  @override
  void dispose() {
    _movementTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isCompleted) {
      return _buildRatingScreen();
    }

    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      body: Stack(
        children: [
          // Background GPS Map Component
          Positioned.fill(
            child: GoogleMap(
              initialCameraPosition: CameraPosition(
                target: _origin,
                zoom: 13,
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
          ),

          // Top Header Status
          Positioned(
            top: 60,
            left: 20,
            right: 20,
            child: GlassCard(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                child: Row(
                  children: [
                    Container(
                      width: 12,
                      height: 12,
                      decoration: const BoxDecoration(color: Color(0xff00d4aa), shape: BoxShape.circle),
                    ),
                    const SizedBox(width: 12),
                    const Text('ON THE ROAD', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, letterSpacing: 0.8)),
                    const Spacer(),
                    Text(
                      _currentStep >= _totalSteps ? 'Arrived!' : 'ETA: ${((_totalSteps - _currentStep) * 1.5).round()} mins',
                      style: const TextStyle(color: Color(0xff00d4aa), fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Bottom Control Center Card
          Positioned(
            bottom: 30,
            left: 20,
            right: 20,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Floating SOS Button
                Align(
                  alignment: Alignment.centerRight,
                  child: FloatingActionButton.extended(
                    onPressed: () => context.push('/emergency'),
                    backgroundColor: const Color(0xffff6b35),
                    icon: const Icon(Icons.warning, color: Colors.white),
                    label: const Text('EMERGENCY SOS', style: TextStyle(fontFamily: 'Syne', fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(height: 16),
                GlassCard(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const Row(
                          children: [
                            CircleAvatar(
                              backgroundImage: NetworkImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256'),
                              radius: 20,
                            ),
                            SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Sara Benzaid', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                Text('Gray Dacia Sandero Stepway', style: TextStyle(color: Colors.grey, fontSize: 12)),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: CustomButton(
                                text: 'Chat Driver',
                                backgroundColor: Colors.grey[900]!,
                                textColor: Colors.white,
                                onPressed: () => context.push('/social/chat/user_sara'),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: CustomButton(
                                text: 'Complete Ride',
                                backgroundColor: const Color(0xff00d4aa),
                                textColor: Colors.black,
                                onPressed: () {
                                  setState(() {
                                    _isCompleted = true;
                                  });
                                },
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRatingScreen() {
    return Scaffold(
      backgroundColor: const Color(0xff0a0a0f),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(Icons.check_circle_outline, size: 80, color: Color(0xff00d4aa)),
              const SizedBox(height: 24),
              const Text(
                'Ride Completed!',
                textAlign: TextAlign.center,
                style: TextStyle(fontFamily: 'Syne', fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
              ),
              const SizedBox(height: 8),
              Text(
                'Rate your commute experience with Sara to build trust in our student network.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[500], fontSize: 15),
              ),
              const SizedBox(height: 32),
              // Stars selectors
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(5, (index) {
                  final starVal = index + 1;
                  return IconButton(
                    icon: Icon(
                      starVal <= _rating ? Icons.star : Icons.star_border,
                      size: 40,
                      color: Colors.amber,
                    ),
                    onPressed: () {
                      setState(() {
                        _rating = starVal.toDouble();
                      });
                    },
                  );
                }),
              ),
              const SizedBox(height: 48),
              CustomButton(
                text: 'Submit & Return Home',
                backgroundColor: const Color(0xff6c63ff),
                onPressed: () {
                  context.go('/');
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
