import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import ImageMarkerActions from './image-marker.reducer';
import styles from './image-marker-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function ImageMarkerScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { imageMarker, imageMarkerList, getAllImageMarkers, fetching } = props;

  useFocusEffect(
    React.useCallback(() => {
      console.debug('ImageMarker entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchImageMarkers();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [imageMarker, fetchImageMarkers]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('ImageMarkerDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No ImageMarkers Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const fetchImageMarkers = React.useCallback(() => {
    getAllImageMarkers({ page: page - 1, sort, size });
  }, [getAllImageMarkers, page, sort, size]);

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchImageMarkers();
  };
  return (
    <View style={styles.container} testID="imageMarkerScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={imageMarkerList}
        renderItem={renderRow}
        keyExtractor={keyExtractor}
        initialNumToRender={oneScreensWorth}
        onEndReached={handleLoadMore}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
    imageMarkerList: state.imageMarkers.imageMarkerList,
    imageMarker: state.imageMarkers.imageMarker,
    fetching: state.imageMarkers.fetchingAll,
    error: state.imageMarkers.errorAll,
    links: state.imageMarkers.links,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllImageMarkers: (options) => dispatch(ImageMarkerActions.imageMarkerAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageMarkerScreen);
