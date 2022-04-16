import { takeLatest, all } from 'redux-saga/effects';
import API from '../services/api';
import FixtureAPI from '../services/fixture-api';
import AppConfig from '../../config/app-config';

/* ------------- Types ------------- */

import { StartupTypes } from '../reducers/startup.reducer';
import { LoginTypes } from '../../modules/login/login.reducer';
import { AccountTypes } from '../../shared/reducers/account.reducer';
import { RegisterTypes } from '../../modules/account/register/register.reducer';
import { ForgotPasswordTypes } from '../../modules/account/password-reset/forgot-password.reducer';
import { ChangePasswordTypes } from '../../modules/account/password/change-password.reducer';
import { UserTypes } from '../../shared/reducers/user.reducer';
import { ProjectTypes } from '../../modules/entities/project/project.reducer';
import { ProjectImageTypes } from '../../modules/entities/project-image/project-image.reducer';
import { ImageMarkerTypes } from '../../modules/entities/image-marker/image-marker.reducer';
import { PhotoTypes } from '../../modules/entities/photo/photo.reducer';
// jhipster-react-native-saga-redux-import-needle

/* ------------- Sagas ------------- */

import { startup } from './startup.saga';
import { login, logout, loginLoad } from '../../modules/login/login.sagas';
import { register } from '../../modules/account/register/register.sagas';
import { forgotPassword } from '../../modules/account/password-reset/forgot-password.sagas';
import { changePassword } from '../../modules/account/password/change-password.sagas';
import { getAccount, updateAccount } from '../../shared/sagas/account.sagas';
import UserSagas from '../../shared/sagas/user.sagas';
import ProjectSagas from '../../modules/entities/project/project.sagas';
import ProjectImageSagas from '../../modules/entities/project-image/project-image.sagas';
import ImageMarkerSagas from '../../modules/entities/image-marker/image-marker.sagas';
import PhotoSagas from '../../modules/entities/photo/photo.sagas';
// jhipster-react-native-saga-method-import-needle

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = AppConfig.useFixtures ? FixtureAPI : API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    // JHipster accounts
    takeLatest(LoginTypes.LOGIN_LOAD, loginLoad, api),
    takeLatest(LoginTypes.LOGIN_REQUEST, login, api),
    takeLatest(LoginTypes.LOGOUT_REQUEST, logout, api),

    takeLatest(ProjectTypes.PROJECT_REQUEST, ProjectSagas.getProject, api),
    takeLatest(ProjectTypes.PROJECT_ALL_REQUEST, ProjectSagas.getAllProjects, api),
    takeLatest(ProjectTypes.PROJECT_UPDATE_REQUEST, ProjectSagas.updateProject, api),
    takeLatest(ProjectTypes.PROJECT_DELETE_REQUEST, ProjectSagas.deleteProject, api),

    takeLatest(ProjectImageTypes.PROJECT_IMAGE_REQUEST, ProjectImageSagas.getProjectImage, api),
    takeLatest(ProjectImageTypes.PROJECT_IMAGE_ALL_REQUEST, ProjectImageSagas.getAllProjectImages, api),
    takeLatest(ProjectImageTypes.PROJECT_IMAGE_UPDATE_REQUEST, ProjectImageSagas.updateProjectImage, api),
    takeLatest(ProjectImageTypes.PROJECT_IMAGE_DELETE_REQUEST, ProjectImageSagas.deleteProjectImage, api),

    takeLatest(ImageMarkerTypes.IMAGE_MARKER_REQUEST, ImageMarkerSagas.getImageMarker, api),
    takeLatest(ImageMarkerTypes.IMAGE_MARKER_ALL_REQUEST, ImageMarkerSagas.getAllImageMarkers, api),
    takeLatest(ImageMarkerTypes.IMAGE_MARKER_BY_PROJECT_REQUEST, ImageMarkerSagas.getProjectImageMarkers, api),
    takeLatest(ImageMarkerTypes.IMAGE_MARKER_UPDATE_REQUEST, ImageMarkerSagas.updateImageMarker, api),
    takeLatest(ImageMarkerTypes.IMAGE_MARKER_DELETE_REQUEST, ImageMarkerSagas.deleteImageMarker, api),

    takeLatest(PhotoTypes.PHOTO_REQUEST, PhotoSagas.getPhoto, api),
    takeLatest(PhotoTypes.PHOTO_ALL_REQUEST, PhotoSagas.getAllPhotos, api),
    takeLatest(PhotoTypes.PHOTO_UPDATE_REQUEST, PhotoSagas.updatePhoto, api),
    takeLatest(PhotoTypes.PHOTO_DELETE_REQUEST, PhotoSagas.deletePhoto, api),
    // jhipster-react-native-saga-redux-connect-needle

    takeLatest(RegisterTypes.REGISTER_REQUEST, register, api),
    takeLatest(ForgotPasswordTypes.FORGOT_PASSWORD_REQUEST, forgotPassword, api),
    takeLatest(ChangePasswordTypes.CHANGE_PASSWORD_REQUEST, changePassword, api),
    takeLatest(UserTypes.USER_REQUEST, UserSagas.getUser, api),
    takeLatest(UserTypes.USER_UPDATE_REQUEST, UserSagas.updateUser, api),
    takeLatest(UserTypes.USER_DELETE_REQUEST, UserSagas.deleteUser, api),
    takeLatest(UserTypes.USER_ALL_REQUEST, UserSagas.getAllUsers, api),

    takeLatest(AccountTypes.ACCOUNT_REQUEST, getAccount, api),
    takeLatest(AccountTypes.ACCOUNT_UPDATE_REQUEST, updateAccount, api),


    takeLatest(ImageMarkerTypes.IMAGE_MARKER_OPT, ImageMarkerSagas.updateProjectImageMarkers),
    takeLatest(ImageMarkerTypes.IMAGE_MARKER_INFO_POPUP, ImageMarkerSagas.openMarkerInfoModal), // By JY



  ]);
}
