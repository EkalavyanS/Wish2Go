import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { db } from '../firebaseConfig';
import {ref, set} from "firebase/database"
import { useNavigation } from '@react-navigation/native';

const AddPlaceScreen = ({route}) => {
  const [placeName, setPlaceName] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [importance, setImportance] = useState('');
  const { latitude, longitude } = route.params;
  const navigation = useNavigation();

  const addData = (placename, imagelink, important, latitude, longitude) => {
    const data = {placename: placename, imagelink: imagelink, important: important, latitude: latitude, longitude: longitude}
    set(ref(db, '/'+placeName), data)
}

  // Function to handle form submission
  const handleSubmit = () => {
    // Validate form fields
    console.log('Place Name:', placeName);
    console.log('Image Link:', imageLink);
    console.log('Importance:', importance);
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);
    // Reset form fields after submission
    addData(placeName, imageLink, importance, latitude, longitude)
    setPlaceName('');
    setImageLink('');
    setImportance('');
    navigation.navigate('Home')
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Image source={require('../assets/fanstasy.png')} style={styles.image}/>
        <Text style={styles.label}>Place Name:</Text>
        <TextInput
          style={styles.input}
          value={placeName}
          onChangeText={setPlaceName}
          placeholder="Enter place name"
        />
        <Text style={styles.label}>Image Link:</Text>
        <TextInput
          style={styles.input}
          value={imageLink}
          onChangeText={setImageLink}
          placeholder="Enter image link"
        />
        <Text style={styles.label}>Why is it important:</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={importance}
          onChangeText={setImportance}
          placeholder="Enter why it's important"
          multiline
        />
        <Text style={styles.label}>Latitude:</Text>
        <Text style={styles.coordinate}>{latitude}</Text>
        <Text style={styles.label}>Longitude:</Text>
        <Text style={styles.coordinate}>{longitude}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  coordinate: {
    fontSize: 16,
    marginBottom: 15,
  },
  map: {
    flex: 1,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: 390,
    height: 200,
    marginBottom: 15,
    borderRadius:25,
  },
});

export default AddPlaceScreen;
