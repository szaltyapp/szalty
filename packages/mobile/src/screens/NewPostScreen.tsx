import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { pickImage, takePhoto, uploadPhoto } from '../services/photoService';
import auth from '@react-native-firebase/auth';

export const NewPostScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSelectImage = async () => {
    try {
      const uri = await pickImage();
      if (uri) {
        setImage(uri);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  
  const handleTakePhoto = async () => {
    try {
      const uri = await takePhoto();
      if (uri) {
        setImage(uri);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  
  const handlePost = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image');
      return;
    }
    
    setLoading(true);
    
    try {
      const user = auth().currentUser;
      
      if (!user) {
        throw new Error('You must be logged in to post');
      }
      
      // Upload image to Firebase Storage
      const imageUrl = await uploadPhoto(image, user.uid);
      
      // Create post in API
      const response = await fetch('YOUR_API_URL/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageUrl,
          caption,
          userId: user.uid,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      
      // Reset form and navigate to feed
      setImage(null);
      setCaption('');
      Alert.alert('Success', 'Your meal was posted successfully!');
      navigation.navigate('Feed');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Your Meal</Text>
      
      {!image ? (
        <View style={styles.imagePicker}>
          <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
            <Text style={styles.buttonText}>Select from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <Text style={styles.buttonText}>Take a Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity style={styles.retakeButton} onPress={handleSelectImage}>
            <Text style={styles.buttonText}>Change Image</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <TextInput
        style={styles.input}
        placeholder="What's on your plate?"
        value={caption}
        onChangeText={setCaption}
        multiline
      />
      
      <TouchableOpacity 
        style={[styles.postButton, !image && styles.disabledButton]}
        onPress={handlePost}
        disabled={!image || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.postButtonText}>Post My Meal</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3CB371',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  retakeButton: {
    backgroundColor: '#FF7F50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  postButton: {
    backgroundColor: '#3CB371',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default NewPostScreen;
