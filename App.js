import * as React from 'react';
import { Provider } from 'react-redux';
import createStore from './app/shared/reducers';
import * as SplashScreen from 'expo-splash-screen';

import NavContainer from './app/navigation/nav-container';

const store = createStore();

export default function App() {
  // prevent the splashscreen from disappearing until the redux store is completely ready (hidden in nav-container.js)
  const [displayApp, setDisplayApp] = React.useState(false);
  React.useEffect(() => {
    if (!displayApp) {
      SplashScreen.preventAutoHideAsync()
        .then(() => setDisplayApp(true))
        .catch(() => setDisplayApp(true));
    }
  }, [displayApp, setDisplayApp]);

  return displayApp ? (
    <Provider store={store}>
      <NavContainer />
    </Provider>
  ) : null;
}


// App.js 
/*import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as mime from 'react-native-mime-types';
import { Buffer } from "buffer";
import { RNS3 } from 'react-native-aws3';
import PhotoCameraModal from './app/shared/components/photo-camera-modal/photo-camera-modal';


function App() {
  // The path of the picked image
  const [pickedImagePath, setPickedImagePath] = useState('');
  const [isVisiblePhotoCameraModal, tooglePhotoCameraModal] = useState(false);

  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    // Explore the result
    console.log(result);
    uploadImageOnS3(result);
  }

  const uploadImageOnS3 = async (result) => {
    if(result != null ) {
      const splitedPath = result.uri.split('/') ;
      const fileName = splitedPath[splitedPath.length - 1] || String(Date.now());
      const contentType = mime.lookup(result.uri);
      console.log(fileName);
      
      const body = {
        // `uri` can also be a file system path (i.e. file://)
        uri: result.uri, //"assets-library://asset/asset.PNG?id=655DBE66-8008-459C-9358-914E1FB532DD&ext=PNG",
        name: fileName,
        type: contentType
      }
      
      const options = {
        keyPrefix: "uploads/",
        bucket: "siteappbucket",
        region: "eu-central-1",
        accessKey: "AKIA5TNCEEA6UM5U45Z6",
        secretKey: "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",
        successActionStatus: 201
      }
      
      console.log(options);

      RNS3.put(body, options).then(response => {
        console.log(response.body);
        if (response.status !== 201)
          throw new Error("Failed to upload image to S3");
        console.log("response.body", response.body);
        console.log("response.body", response.body.postResponse.key);
        if (!result.cancelled) {
          setPickedImagePath(result.uri);
          console.log(result.uri);
        }
            
        //**
         * {       
         *   postResponse: {
         *     bucket: "your-bucket",
         *     etag : "9f620878e06d28774406017480a59fd4",
         *     key: "uploads/image.png",
         *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
         *   }
         * }
         *
      });
    }
  }
  

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      console.log(result.uri);
    }
  }

  const capturePhoto = () => {
    tooglePhotoCameraModal(false);
    setTimeout(()=> openCamera(), 500);
  }

  const selectPhoto = () => {
    tooglePhotoCameraModal(false);
    setTimeout(()=> showImagePicker(), 500);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.buttonContainer}>
        <Button onPress={showImagePicker} title="Select an image" />
        <Button onPress={openCamera} title="Open camera" />
        <Button onPress={()=>tooglePhotoCameraModal(true)} title="Open Modal" />
      <PhotoCameraModal 
        isVisible={isVisiblePhotoCameraModal} 
        cancel={()=> tooglePhotoCameraModal(false)} 
        openImagePicker={selectPhoto} 
        openCamera={capturePhoto}
      />
      </View>

      <View style={styles.imageContainer}>
        {
          pickedImagePath !== '' && <Image
            source={{ uri: pickedImagePath }}
            style={styles.image}
          />
        }
      </View>
    </View>
  );
}

export default App;

// Kindacode.com
// Just some styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 400,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  imageContainer: {
    padding: 30
  },
  image: {
    width: 400,
    height: 300,
    resizeMode: 'cover'
  }
});
*/

