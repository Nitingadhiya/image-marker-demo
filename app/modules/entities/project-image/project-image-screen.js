import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import ProjectImageActions from './project-image.reducer';
import styles from './project-image-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function ProjectImageScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { projectImage, projectImageList, getAllProjectImages, fetching } = props;

  useFocusEffect(
    React.useCallback(() => {
      console.debug('ProjectImage entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchProjectImages();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [projectImage, fetchProjectImages]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('ProjectImageDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No ProjectImages Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const fetchProjectImages = React.useCallback(() => {
    getAllProjectImages({ page: page - 1, sort, size });
  }, [getAllProjectImages, page, sort, size]);

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchProjectImages();
  };
  return (
    <View style={styles.container} testID="projectImageScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={projectImageList}
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
    projectImageList: state.projectImages.projectImageList,
    projectImage: state.projectImages.projectImage,
    fetching: state.projectImages.fetchingAll,
    error: state.projectImages.errorAll,
    links: state.projectImages.links,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllProjectImages: (options) => dispatch(ProjectImageActions.projectImageAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectImageScreen);
