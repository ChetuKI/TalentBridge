import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Leaflet = () => {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState('');
  const [marker, setMarker] = useState(null); // To manage the marker instance

  useEffect(() => {
    const mapInstance = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  const handleSearch = async () => {
    if (!location) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];

        // Center the map to the location
        map.setView([lat, lon], 13);

        // Remove the existing marker, if any
        if (marker) {
          marker.remove();
        }

        // Add a new marker at the location
        const newMarker = L.marker([lat, lon]).addTo(map);
        newMarker.bindPopup(`<b>${display_name}</b>`).openPopup();
        setMarker(newMarker); // Update the marker instance
      } else {
        alert('Location not found. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '10px', textAlign: 'center' }}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter a location"
          style={{
            padding: '10px 15px',
            width: '60%',
            border: '2px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#007BFF')}
        >
          Search
        </button>
      </div>
      <div id="map" style={{ height: '80vh', width: '100%' }} />
    </div>
  );
};

export default Leaflet;
