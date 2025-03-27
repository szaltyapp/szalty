import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import storage from '@react-native-firebase/storage';

export const pickImage = async () => {
  // Request permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    throw new Error('Permission to access camera roll is required');
  }
  
  // Pick image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });
  
  if (result.canceled) {
    return null;
  }
  
  return result.assets[0].uri;
};

export const takePhoto = async () => {
  // Request camera permission
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  
  if (status !== 'granted') {
    throw new Error('Permission to access camera is required');
  }
  
  // Take photo
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });
  
  if (result.canceled) {
    return null;
  }
  
  return result.assets[0].uri;
};

export const uploadPhoto = async (uri: string, userId: string) => {
  try {
    // Compress image before upload
    const compressed = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1080 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    
    // Create reference to Firebase Storage
    const filename = `post-${userId}-${Date.now()}.jpg`;
    const reference = storage().ref(`user-photos/${filename}`);
    
    // Upload image
    await reference.putFile(compressed.uri);
    
    // Get download URL
    const url = await reference.getDownloadURL();
    
    return url;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};
