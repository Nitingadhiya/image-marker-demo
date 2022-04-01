import React from 'react';
import { ScrollView, Text } from 'react-native';
// Styles
import RoundedButton from '../../shared/components/rounded-button/rounded-button';

import styles from './entities-screen.styles';

export default function EntitiesScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="entityScreenScrollList">
      <Text style={styles.centerText}>JHipster Entities will appear below</Text>
      <RoundedButton text="Project" onPress={() => navigation.navigate('Project')} testID="projectEntityScreenButton" />
      <RoundedButton text="ProjectImage" onPress={() => navigation.navigate('ProjectImage')} testID="projectImageEntityScreenButton" />
      <RoundedButton text="ImageMarker" onPress={() => navigation.navigate('ImageMarker')} testID="imageMarkerEntityScreenButton" />
      <RoundedButton text="Photo" onPress={() => navigation.navigate('Photo')} testID="photoEntityScreenButton" />
      {/* jhipster-react-native-entity-screen-needle */}
    </ScrollView>
  );
}
