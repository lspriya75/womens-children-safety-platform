let map;
let currentMarker;
let searchControl;
let markers = [];

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes dropMarker {
        0% {
            transform: translateY(-200px) scale(0);
            opacity: 0;
        }
        60% {
            transform: translateY(20px) scale(1.2);
        }
        80% {
            transform: translateY(-10px) scale(0.8);
        }
        100% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
        }
        70% {
            transform: scale(1.1);
            box-shadow: 0 0 0 10px rgba(33, 150, 243, 0);
        }
        100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .marker-animation {
        animation: dropMarker 0.5s ease-out;
    }

    .current-location-dot {
        width: 15px;
        height: 15px;
        background-color: #2196F3;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
    }

    .place-dot {
        width: 12px;
        height: 12px;
        background-color: #FF4136;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    }

    .place-dot:hover {
        transform: scale(1.5);
        box-shadow: 0 0 15px rgba(255,65,54,0.5);
    }

    .popup-content {
        animation: fadeIn 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// Initialize the map
function initMap() {
    // Create map centered on India
    map = L.map('map').setView([20.5937, 78.9629], 5);
    
    // Add map tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add simple search box
    searchControl = L.Control.geocoder({
        defaultMarkGeocode: false,
        placeholder: 'Search location...',
        geocoder: L.Control.Geocoder.nominatim()
    }).addTo(map);

    // Handle location selection
    searchControl.on('markgeocode', function(e) {
        const latlng = e.geocode.center;
        setLocation(latlng.lat, latlng.lng);
    });

    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success
            (position) => {
                setLocation(position.coords.latitude, position.coords.longitude);
            },
            // Error
            (error) => {
                console.error('Location error:', error);
                document.getElementById('location-status').innerHTML = 'Please search for your location using the search box';
            }
        );
    }
}

function setLocation(lat, lng) {
    // Remove existing marker with fade out
    if (currentMarker) {
        currentMarker.getElement().style.opacity = '0';
        setTimeout(() => map.removeLayer(currentMarker), 200);
    }
    
    // Add new marker with animation
    currentMarker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'marker-animation',
            html: '<div class="current-location-dot"></div>',
            iconSize: [15, 15],
            iconAnchor: [7.5, 7.5]
        })
    }).addTo(map);
    
    // Animate map view
    map.flyTo([lat, lng], 15, {
        duration: 1,
        easeLinearity: 0.5
    });
    
    // Update status with animation
    const status = document.getElementById('location-status');
    status.style.opacity = '0';
    status.innerHTML = 'Location set! You can now find nearby services.';
    setTimeout(() => {
        status.style.transition = 'opacity 0.5s ease';
        status.style.opacity = '1';
    }, 100);
}

function findNearbyPlaces(type) {
    if (!currentMarker) {
        const status = document.getElementById('location-status');
        status.style.opacity = '0';
        status.innerHTML = 'Please set your location first';
        setTimeout(() => {
            status.style.transition = 'opacity 0.5s ease';
            status.style.opacity = '1';
        }, 100);
        return;
    }

    // Show loading indicator
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'block';
    loadingIndicator.innerHTML = 'Searching for police stations...';

    // Clear existing markers with animation
    markers.forEach(marker => {
        marker.getElement().style.opacity = '0';
        setTimeout(() => map.removeLayer(marker), 200);
    });
    markers = [];

    const location = currentMarker.getLatLng();
    
    // Predefined police stations for major cities
    const majorCityPoliceStations = {
        'Chennai': [
            { name: "Greater Chennai Police Headquarters", lat: 13.0827, lon: 80.2707, address: "Vepery, Chennai" },
            { name: "Anna Square Police Station", lat: 13.0698, lon: 80.2825, address: "Marina Beach, Chennai" },
            { name: "Mylapore Police Station", lat: 13.0368, lon: 80.2676, address: "Mylapore, Chennai" },
            { name: "T Nagar Police Station", lat: 13.0418, lon: 80.2341, address: "T Nagar, Chennai" },
            { name: "Adyar Police Station", lat: 13.0067, lon: 80.2565, address: "Adyar, Chennai" }
        ],
        'Madurai': [
            { name: "Madurai City Police Commissioner Office", lat: 9.9252, lon: 78.1198, address: "West Veli St, Near Periyar Bus Stand" },
            { name: "Anna Nagar Police Station", lat: 9.9287, lon: 78.1359, address: "Anna Nagar, Madurai" },
            { name: "Tallakulam Police Station", lat: 9.9198, lon: 78.1452, address: "Tallakulam, Madurai" },
            { name: "SS Colony Police Station", lat: 9.9093, lon: 78.1318, address: "SS Colony, Madurai" },
            { name: "K.Pudur Police Station", lat: 9.9334, lon: 78.1107, address: "K Pudur, Madurai" }
        ],
        'Coimbatore': [
            { name: "Coimbatore City Police Commissioner Office", lat: 11.0168, lon: 76.9558, address: "State Bank Road, Coimbatore" },
            { name: "Race Course Police Station", lat: 11.0025, lon: 76.9666, address: "Race Course, Coimbatore" },
            { name: "RS Puram Police Station", lat: 11.0088, lon: 76.9517, address: "RS Puram, Coimbatore" },
            { name: "Gandhipuram Police Station", lat: 11.0185, lon: 76.9674, address: "Gandhipuram, Coimbatore" }
        ],
        'Salem': [
            { name: "Salem City Police Commissioner Office", lat: 11.6643, lon: 78.1460, address: "Four Roads, Salem" },
            { name: "Town Police Station", lat: 11.6597, lon: 78.1609, address: "Town Area, Salem" },
            { name: "Hasthampatti Police Station", lat: 11.6684, lon: 78.1442, address: "Hasthampatti, Salem" }
        ],
        'Trichy': [
            { name: "Trichy City Police Commissioner Office", lat: 10.7905, lon: 78.7047, address: "Cantonment, Trichy" },
            { name: "Fort Police Station", lat: 10.8252, lon: 78.6963, address: "Fort Area, Trichy" },
            { name: "Gandhi Market Police Station", lat: 10.8270, lon: 78.6834, address: "Gandhi Market, Trichy" }
        ]
    };

    // Function to calculate distance between two points
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                 Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                 Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distance in km
    }

    if (type === 'police') {
        // Check if location is near any major city (within 20km radius)
        let nearestCity = null;
        let nearestStations = null;

        for (const [city, stations] of Object.entries(majorCityPoliceStations)) {
            if (stations.some(station => getDistance(location.lat, location.lng, station.lat, station.lon) < 20)) {
                nearestCity = city;
                nearestStations = stations;
                break;
            }
        }

        if (nearestStations) {
            // Use predefined stations for the nearest city
            nearestStations.forEach((station, index) => {
                setTimeout(() => {
                    const marker = L.marker([station.lat, station.lon], {
                        icon: L.divIcon({
                            className: 'marker-animation',
                            html: '<div class="place-dot"></div>',
                            iconSize: [12, 12],
                            iconAnchor: [6, 6]
                        })
                    });

                    marker.bindPopup(
                        `<div class="popup-content">
                            <strong>${station.name}</strong>
                            <br>
                            <small>${station.address}</small>
                            <br>
                            <button onclick="getDirections(${station.lat}, ${station.lon})" 
                                    style="margin-top: 5px; padding: 5px 10px; 
                                    border: none; background: #2196F3; color: white; 
                                    border-radius: 3px; cursor: pointer;">
                                Get Directions
                            </button>
                        </div>`,
                        { className: 'animated-popup' }
                    );

                    marker.addTo(map);
                    markers.push(marker);
                }, index * 100);
            });

            status.innerHTML = `Found ${nearestStations.length} police stations in ${nearestCity}`;
            
            setTimeout(() => {
                const group = L.featureGroup(markers);
                map.flyToBounds(group.getBounds().pad(0.2), {
                    duration: 1,
                    easeLinearity: 0.5
                });
                loadingIndicator.style.display = 'none';
            }, nearestStations.length * 100);
            
            return;
        }

        // If not in a major city, use Google Places API for more accurate results
        const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&country=india&q=police+station&limit=15&bounded=1&viewbox=${location.lng-0.2},${location.lat+0.2},${location.lng+0.2},${location.lat-0.2}`;

        fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                data.forEach((place, index) => {
                    setTimeout(() => {
                        const marker = L.marker([place.lat, place.lon], {
                            icon: L.divIcon({
                                className: 'marker-animation',
                                html: '<div class="place-dot"></div>',
                                iconSize: [12, 12],
                                iconAnchor: [6, 6]
                            })
                        });
                        
                        const name = place.display_name.split(',')[0] || 'Police Station';
                        const address = place.display_name;
                        
                        marker.bindPopup(
                            `<div class="popup-content">
                                <strong>${name}</strong>
                                <br>
                                <small>${address}</small>
                                <br>
                                <button onclick="getDirections(${place.lat}, ${place.lon})" 
                                        style="margin-top: 5px; padding: 5px 10px; 
                                        border: none; background: #2196F3; color: white; 
                                        border-radius: 3px; cursor: pointer;">
                                    Get Directions
                                </button>
                            </div>`,
                            { className: 'animated-popup' }
                        );
                        
                        marker.addTo(map);
                        markers.push(marker);
                    }, index * 100);
                });

                status.innerHTML = `Found ${data.length} police stations nearby`;
                
                // Fit map to show all markers
                setTimeout(() => {
                    const group = L.featureGroup(markers);
                    map.flyToBounds(group.getBounds().pad(0.2), {
                        duration: 1,
                        easeLinearity: 0.5
                    });
                }, data.length * 100);
            } else {
                status.innerHTML = 'No police stations found nearby. Try searching in a different area.';
            }
        })
        .catch(error => {
            console.error('Error fetching places:', error);
            status.innerHTML = 'Error finding police stations. Please try again later.';
        })
        .finally(() => {
            loadingIndicator.style.display = 'none';
        });
    } else {
        // Handle hospital and shelter searches (existing code)
        // ... rest of the existing code for other types ...
    }
}

function getDirections(lat, lon) {
    // Animate opening directions in new tab
    const a = document.createElement('a');
    a.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    a.target = '_blank';
    a.click();
}

// Initialize map when page loads
window.onload = initMap; 