import * as React from 'react';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { DrawerButton } from './drawer/drawer-button';
import { navigate, goBackOrIfParamsOrDefault } from './nav-ref';

// import screens
import EntitiesScreen from '../modules/entities/entities-screen';
import ProjectScreen from '../modules/entities/project/project-screen';
import ProjectDetailScreen from '../modules/entities/project/project-detail-screen';
import ProjectEditScreen from '../modules/entities/project/project-edit-screen';
import ProjectImageScreen from '../modules/entities/project-image/project-image-screen';
import ProjectImageDetailScreen from '../modules/entities/project-image/project-image-detail-screen';
import ProjectImageEditScreen from '../modules/entities/project-image/project-image-edit-screen';
import ImageMarkerScreen from '../modules/entities/image-marker/image-marker-screen';
import ImageMarkerDetailScreen from '../modules/entities/image-marker/image-marker-detail-screen';
import ImageMarkerEditScreen from '../modules/entities/image-marker/image-marker-edit-screen';
import PhotoScreen from '../modules/entities/photo/photo-screen';
import PhotoDetailScreen from '../modules/entities/photo/photo-detail-screen';
import PhotoEditScreen from '../modules/entities/photo/photo-edit-screen';
// jhipster-react-native-navigation-import-needle

export const entityScreens = [
  {
    name: 'Entities',
    route: '',
    component: EntitiesScreen,
    options: {
      headerLeft: DrawerButton,
    },
  },
  {
    name: 'Project',
    route: 'project',
    component: ProjectScreen,
    options: {
      title: 'Projects',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('ProjectEdit', { id: undefined })}
          backImage={(props) => <Ionicons name="md-add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'ProjectDetail',
    route: 'project/detail',
    component: ProjectDetailScreen,
    options: { title: 'View Project', headerLeft: () => <HeaderBackButton onPress={() => navigate('Project')} /> },
  },
  {
    name: 'ProjectEdit',
    route: 'project/edit',
    component: ProjectEditScreen,
    options: {
      title: 'Edit Project',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('ProjectDetail', 'Project')} />,
    },
  },
  {
    name: 'ProjectImage',
    route: 'project-image',
    component: ProjectImageScreen,
    options: {
      title: 'ProjectImages',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('ProjectImageEdit', { id: undefined })}
          backImage={(props) => <Ionicons name="md-add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'ProjectImageDetail',
    route: 'project-image/detail',
    component: ProjectImageDetailScreen,
    options: { title: 'View ProjectImage', headerLeft: () => <HeaderBackButton onPress={() => navigate('ProjectImage')} /> },
  },
  {
    name: 'ProjectImageEdit',
    route: 'project-image/edit',
    component: ProjectImageEditScreen,
    options: {
      title: 'Edit ProjectImage',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('ProjectImageDetail', 'ProjectImage')} />,
    },
  },
  {
    name: 'ImageMarker',
    route: 'image-marker',
    component: ImageMarkerScreen,
    options: {
      title: 'ImageMarkers',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('ImageMarkerEdit', { id: undefined })}
          backImage={(props) => <Ionicons name="md-add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'ImageMarkerDetail',
    route: 'image-marker/detail',
    component: ImageMarkerDetailScreen,
    options: { title: 'View ImageMarker', headerLeft: () => <HeaderBackButton onPress={() => navigate('ImageMarker')} /> },
  },
  {
    name: 'ImageMarkerEdit',
    route: 'image-marker/edit',
    component: ImageMarkerEditScreen,
    options: {
      title: 'Edit ImageMarker',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('ImageMarkerDetail', 'ImageMarker')} />,
    },
  },
  {
    name: 'Photo',
    route: 'photo',
    component: PhotoScreen,
    options: {
      title: 'Photos',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('PhotoEdit', { id: undefined })}
          backImage={(props) => <Ionicons name="md-add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'PhotoDetail',
    route: 'photo/detail',
    component: PhotoDetailScreen,
    options: { title: 'View Photo', headerLeft: () => <HeaderBackButton onPress={() => navigate('Photo')} /> },
  },
  {
    name: 'PhotoEdit',
    route: 'photo/edit',
    component: PhotoEditScreen,
    options: {
      title: 'Edit Photo',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('PhotoDetail', 'Photo')} />,
    },
  },
  // jhipster-react-native-navigation-declaration-needle
];

export const getEntityRoutes = () => {
  const routes = {};
  entityScreens.forEach((screen) => {
    routes[screen.name] = screen.route;
  });
  return routes;
};

const EntityStack = createStackNavigator();

export default function EntityStackScreen() {
  return (
    <EntityStack.Navigator>
      {entityScreens.map((screen, index) => {
        return <EntityStack.Screen name={screen.name} component={screen.component} key={index} options={screen.options} />;
      })}
    </EntityStack.Navigator>
  );
}
