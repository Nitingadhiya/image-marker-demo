export default {
  // Functions return fixtures

  // entity fixtures
  updateProject: (project) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-project.json'),
    };
  },
  getAllProjects: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-projects.json'),
    };
  },
  getProject: (projectId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-project.json'),
    };
  },
  deleteProject: (projectId) => {
    return {
      ok: true,
    };
  },
  updateProjectImage: (projectImage) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-project-image.json'),
    };
  },
  getAllProjectImages: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-project-images.json'),
    };
  },
  getProjectImage: (projectImageId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-project-image.json'),
    };
  },
  deleteProjectImage: (projectImageId) => {
    return {
      ok: true,
    };
  },
  updateImageMarker: (imageMarker) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-image-marker.json'),
    };
  },
  getAllImageMarkers: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-image-markers.json'),
    };
  },
  getImageMarker: (imageMarkerId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-image-marker.json'),
    };
  },
  deleteImageMarker: (imageMarkerId) => {
    return {
      ok: true,
    };
  },
  updatePhoto: (photo) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-photo.json'),
    };
  },
  getAllPhotos: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-photos.json'),
    };
  },
  getPhoto: (photoId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-photo.json'),
    };
  },
  deletePhoto: (photoId) => {
    return {
      ok: true,
    };
  },
  // jhipster-react-native-api-fixture-needle

  // user fixtures
  updateUser: (user) => {
    return {
      ok: true,
      data: require('../fixtures/update-user.json'),
    };
  },
  getAllUsers: () => {
    return {
      ok: true,
      data: require('../fixtures/get-users.json'),
    };
  },
  getUser: (userId) => {
    return {
      ok: true,
      data: require('../fixtures/get-user.json'),
    };
  },
  deleteUser: (userId) => {
    return {
      ok: true,
    };
  },
  // auth fixtures
  setAuthToken: () => {},
  removeAuthToken: () => {},
  login: (authObj) => {
    if (authObj.username === 'user' && authObj.password === 'user') {
      return {
        ok: true,
        data: require('../fixtures/login.json'),
      };
    } else {
      return {
        ok: false,
        status: 400,
        data: 'Invalid credentials',
      };
    }
  },
  register: ({ user }) => {
    if (user === 'user') {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        data: {
          title: 'Invalid email',
        },
      };
    }
  },
  forgotPassword: ({ email }) => {
    if (email === 'valid@gmail.com') {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        data: 'Invalid email',
      };
    }
  },
  getAccount: () => {
    return {
      ok: true,
      status: 200,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      data: require('../fixtures/get-account.json'),
    };
  },
  updateAccount: () => {
    return {
      ok: true,
    };
  },
  changePassword: ({ currentPassword }) => {
    if (currentPassword === 'valid-password') {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        data: 'Password error',
      };
    }
  },
};