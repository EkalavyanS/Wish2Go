import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

const App = () => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState(null);
  const [query, setQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(14); // Initial zoom level
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const onMapPress = (e) => {
    setMarker(e.nativeEvent.coordinate);
  };

  const onSelectPress = () => {
    if (marker) {
        navigation.navigate('AddPlace', {
            latitude: marker.latitude,
            longitude: marker.longitude,
          });
    } else {
      alert('Please select a location on the map first');
    }
  };

  const searchLocation = async () => {
    if (query) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
        );
        const data = await response.json();
        if (data.length > 0) {
          const location = data[0];
          setRegion({
            ...region,
            latitude: parseFloat(location.lat),
            longitude: parseFloat(location.lon),
          });
          setMarker({
            latitude: parseFloat(location.lat),
            longitude: parseFloat(location.lon),
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const zoomIn = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  const zoomOut = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a location"
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchLocation}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.zoomContainer}>
          <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
      </View>
      <MapView
        style={styles.map}
        region={region}
        onPress={onMapPress}
      >
        <UrlTile
          urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        {marker && <Marker coordinate={marker} />}
      </MapView>
      <TouchableOpacity style={styles.button} onPress={onSelectPress}>
        <Text style={styles.buttonText}>Select</Text>
      </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={()=>{
                navigation.navigate('Home')
            }} >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width:370,
    height: 50,
    position:'relative',
    top:30,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    padding: 8,
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#6200EE',
    borderRadius: 5,
    marginLeft: 10,
  },
  zoomContainer: {
    flexDirection: 'column',
  },
  zoomButton: {
    padding: 10,
    backgroundColor: '#6200EE',
    borderRadius: 5,
    marginVertical: 5,
  },
  map: {
    flex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#FF0000',
    borderRadius: 25,
    width:100,
    position: 'absolute',
    bottom:30,
    left: '20%',
    height: 45,
  },
});

export default App;
