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


// import React from 'react';
// import { Dimensions, View, Image, Text,TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
// import ImageZoom from 'react-native-image-pan-zoom';
// import { MaterialIcons, AntDesign } from '@expo/vector-icons';
// import { useState } from 'react';

// const PinchableBox = () => {

//   const {width, height} = Dimensions.get('window');

//   const [scale, setScale] = useState('');
//   const [addMarker, setAddMarker] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [text, onChangeText] = useState("");

//   const [addedPoints, setPoints] = useState([]);
//   const handleClick = (e) => {
//     console.log('clicked', e);
//       if(addMarker) {
//         let points = [{
//           'x':e.locationX,
//           'y':e.locationY,
//           'label': addedPoints.length + 1
//           }, ...addedPoints];
//           setPoints(points);
//       }   
//   };

//   const showMarker = () => addedPoints.map( (point) => {
//     const xyPosition = { top: point.y, left: point.x };
//     return (
//       <TouchableOpacity key={point.x} style={[styles.markerView, xyPosition]} onPress={()=> openBottomSheetPanel()}>
//         <Text style={{fontSize:10,color: '#fff'}} key={point.x}>{point.label}</Text>
//       </TouchableOpacity>
//     );
//   });

//   const openBottomSheetPanel = () => setModalVisible(true);

//   const showBottomSheet = () => {
//     return (
//       <Modal
//       animationType="slide"
//       transparent={true}
//       visible={modalVisible}
//       onRequestClose={() => {
//         Alert.alert("Modal has been closed.");
//         setModalVisible(!modalVisible);
//       }}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <TextInput
//               style={styles.input}
//               onChangeText={onChangeText}
//               value={text}
//               multiline={true}
//               placeholderTextColor={'#4B4C4E'}
//               placeholder="Description"
//             />
//             <TouchableOpacity
//               style={[styles.button, styles.buttonClose]}
//               onPress={() => setModalVisible(!modalVisible)}
//             >
//               <Text style={styles.textStyle}>Update</Text>
//             </TouchableOpacity>
//             <View style={styles.bottomSections}>
//               <TouchableOpacity style={styles.moveMarker}>
//                 <MaterialIcons name="location-searching" size={30} color="#2196F3" />
//               </TouchableOpacity>
              
//               <TouchableOpacity style={styles.moveMarker}>
//                 <MaterialIcons name="delete-outline" size={30} color="#2196F3" />
//               </TouchableOpacity>
//             </View>
//           </View>

//         </View>
//       </Modal>
//     )
//   };

//   const renderAddMarkerButton = () => (
//     <TouchableOpacity 
//       onPress={()=>{
//         setAddMarker(!addMarker);
//       }} 
//       style={styles.addMarkerButton}
//     >
//     <Text style={styles.addMarkerText}>Add Marker</Text>
//   </TouchableOpacity>
//   );

//   const renderRemoveMarkerButton = () => (
//     <TouchableOpacity onPress={()=>{
//       let addedPoints1 = addedPoints.splice(0, 1);
//       setAddMarker(addedPoints1);
//       }} 
//       style={styles.removeMarkerButton}
//     >
//     <Text style={styles.addMarkerText}>Remover Marker</Text>
//   </TouchableOpacity>
//   );

//   return (
//     <View style={styles.mainView}>
//       {renderAddMarkerButton()}
//       {renderRemoveMarkerButton()}

//       <View style={styles.imagePanView}>
//         <ImageZoom
//           cropWidth={width}
//           cropHeight={height}
//           panToMove={true}
//           minScale={1}
//           maxScale={4}
//           imageHeight={width}
//           onMove={(e) => setScale(e.scale)}
//           imageWidth={width}
//           style={{ marginTop: 0 }}
//           onClick={handleClick}>
//             {showMarker()}
//           <Image
//             style={{ width: width, height: width }}
//             source={{
//               uri: `https://img.parts-catalogs.com/bmw_2020_01/data/JPG/209412.png`,
//             }}
//             resizeMode="contain"
//           />
//         </ImageZoom>
//       </View>
//       {showBottomSheet()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainView: {alignItems: 'center', justifyContent: 'center', height: '100%'},
//   imagePanView: { position: 'relative', alignSelf: 'center' },
//   markerView: {
//     zIndex:99999, 
//     borderRadius:Dimensions.get('window').width * 0.6 / 14,
//     width:Dimensions.get('window').width * 0.6 / 14,
//     height:Dimensions.get('window').width * 0.6 / 14,
//     backgroundColor:'#333',
//     position:'absolute', 
//     borderWidth: 2, 
//     borderColor: '#fff', 
//     shadowColor: "#000",
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 1.84,elevation: 5,
//   },

//   /* Bottom Sheet Style */

//   centeredView: {
//     flex: 1,
//     justifyContent: "flex-end",
//     alignItems: "flex-end",
//     marginTop: 22,
//   },
//   modalView: {
//     // margin: 20,
//     height: Dimensions.get('window').height,
//     backgroundColor: "#1C1C1E",
//     // borderRadius: 20,
//     paddingTop: 35,
//     paddingHorizontal: 20,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     width: Dimensions.get('window').width  - 60
//   },
//   button: {
//     borderRadius: 10,
//     padding: 15,
//     paddingHorizontal: 40,
//     elevation: 2,
//   },
//   buttonOpen: {
//     backgroundColor: "#F194FF",
//   },
//   buttonClose: {
//     backgroundColor: "#2196F3",
//   },
//   textStyle: {
//     color: "white",
//     fontWeight: "bold",
//     textAlign: "center"
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: "center"
//   },

//   /* Text Input Style */
//   input: {
//     height: 110,
//     width: '100%',
//     margin: 12,
//     // borderWidth: 1,
//     borderRadius: 10,
//     padding: 10,
//     fontSize: 18,
//     color: '#4B4C4E',
//     backgroundColor: '#29292B'
//   },

//   /*add & remove marker button */
//   addMarkerButton: { zIndex: 10001, height: 50, width: 100, backgroundColor: '#ffcc00', position: 'absolute', top: 50, right: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center'},
//   addMarkerText: { color: '#000', fontSize: 16},
//   removeMarkerButton: { zIndex: 10001, height: 50, width: 100, backgroundColor: '#ffcc00', position: 'absolute', top: 50, right: 130, borderRadius: 10, justifyContent: 'center', alignItems: 'center'},
//   bottomSections: {flex: 1, alignItems: 'flex-end', flexDirection: 'row'},
//   moveMarker: {
//     padding: 10,
//   }
// });




// export default PinchableBox;