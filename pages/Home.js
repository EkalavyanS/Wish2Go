import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ref, get, onValue } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

const HomePage = () => {
  const [places, setPlaces] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch places from Firebase
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(db, '/'));
        const data = snapshot.val();
        if (data) {
          const placesArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setPlaces(placesArray);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const dbRef = ref(db, '/');
    const unsubscribe = onValue(dbRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const placesArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setPlaces(placesArray);
      }
    });
  
    // Unsubscribe when component unmounts
    // Get current location
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    getCurrentLocation();
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance.toFixed(2); // Round to 2 decimal places
  };

  const deg2rad = deg => {
    return deg * (Math.PI / 180);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {places.map(place => (
          <TouchableOpacity
            key={place.id}
            style={styles.placeContainer}
          >
            <Text style={styles.placeName}>{place.placename}</Text>
            {place.imagelink ? (
              <Image source={{ uri: place.imagelink }} style={styles.image} />
            ) : null}
            <Text style={styles.important}>{place.important}</Text>
            <Text style={styles.coordinates}>Latitude: {place.latitude}</Text>
            <Text style={styles.coordinates}>Longitude: {place.longitude}</Text>
            {currentLocation && (
              <Text style={styles.distance}>
                Distance: {calculateDistance(currentLocation.latitude, currentLocation.longitude, place.latitude, place.longitude)} km
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('Map')}
      >
        <Text style={styles.addButtonText}>Add a New Wish</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  placeContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  placeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginVertical: 12,
    borderRadius: 8,
  },
  important: {
    fontSize: 16,
    color: '#666666',
    marginVertical: 8,
  },
  coordinates: {
    fontSize: 14,
    color: '#999999',
  },
  distance: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
  },
  addButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 16,
    alignItems: 'center',
    position: "absolute",
    width: 250,
    borderRadius: 8,
    right: 10,
    bottom: 50,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomePage;
