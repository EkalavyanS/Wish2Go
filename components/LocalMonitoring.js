import { useEffect, useState } from 'react';
import * as Location from "expo-location";
import { get, ref } from 'firebase/database';
import { db } from '../firebaseConfig';
import { Alert } from 'react-native';

const LocationMonitoring = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      Location.watchPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 10 }, location => {
        setCurrentLocation(location.coords);
      });
    };

    getLocation();

    // Fetch places data from Firebase
    const fetchPlaces = async () => {
      try {
        const snapshot = await get(ref(db, '/'));
        const data = snapshot.val();
        if (data) {
          const placesArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setPlaces(placesArray);
        }
      } catch (error) {
        console.error('Error fetching places data:', error);
      }
    };

    fetchPlaces();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      places.forEach(place => {
        const distance = calculateDistance(currentLocation.latitude, currentLocation.longitude, place.latitude, place.longitude);
        if (distance < 2) {
          alert(`You are near ${place.placename}`);
        }
      });
    }
  }, [currentLocation]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };
  
  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };
  

  return null; // This component doesn't render anything visible
};

export default LocationMonitoring;
