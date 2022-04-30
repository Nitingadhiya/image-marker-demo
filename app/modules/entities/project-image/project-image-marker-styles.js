import { StyleSheet, Dimensions } from 'react-native';

import { ApplicationStyles } from '../../../shared/themes';

const bgColor = '#1C1C1E';

export default StyleSheet.create({
  mainView: {alignItems: 'center', justifyContent: 'center', height: '100%'},
  imagePanView: { position: 'relative', alignSelf: 'center' },
  markerView: {
    zIndex:99999, 
    borderRadius:Dimensions.get('window').width * 0.6 / 14,
    width:Dimensions.get('window').width * 0.6 / 14,
    height:Dimensions.get('window').width * 0.6 / 14,
    backgroundColor:'#333',
    position:'absolute', 
    borderWidth: 2, 
    borderColor: '#fff', 
    shadowColor: "#000",
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.84,elevation: 5,
  },

  /* Bottom Sheet Style */

  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: 22,
  },
  modalView: {
    // margin: 20,
    // height: Dimensions.get('window').height,
    backgroundColor: "#1C1C1E",
    // borderRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: Dimensions.get('window').width
  },
  button: {
    borderRadius: 10,
    padding: 15,
    paddingHorizontal: 40,
    elevation: 2,
    width: 200
  },
  buttonHorizontalSpacing: {
    marginHorizontal: 10
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },

  /* Text Input Style */
  input: {
    height: 140,
    width: '100%',
    margin: 12,
    // borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 20,
    color: '#666',
    backgroundColor: '#29292B'
  },

  /*add & remove marker button */
  addMarkerButton: { zIndex: 10001, height: 50, width: 100, backgroundColor: '#ffcc00', position: 'absolute', top: 50, right: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center'},
  addMarkerText: { color: '#000', fontSize: 16},
  removeMarkerButton: { zIndex: 10001, height: 50, width: 100, backgroundColor: '#ffcc00', position: 'absolute', top: 50, right: 130, borderRadius: 10, justifyContent: 'center', alignItems: 'center'},
  bottomSections: {
    alignItems: 'flex-end', 
    flexDirection: 'row', 
    alignSelf: 'flex-end',
    height: 60
  },
  moveMarker: {
    padding: 10,
  },

  buttonFlexRow: {
    flexDirection: 'row'
  },
  markerInfoImageView:{
    marginBottom: 20
  },
  markerInfoImage:{
    width: 100,
    height: 100,
  },
  modalPosition: {
    position: 'absolute',
    zIndex: 1,
    bottom: 0
  },
  closeIcon: {
    backgroundColor: bgColor,
    padding: 15,
    borderTopLeftRadius: 10
  }
});
