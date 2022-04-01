const {
  reloadApp,
  loginAsUser,
  logout,
  goBack,
  tapFirstElementByLabel,
  openAndTapDrawerMenuItemByLabel,
  waitThenTapButton,
  waitForElementToBeVisibleById,
  scrollTo,
} = require('../utils');

describe('ImageMarker Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToImageMarkerScreen();
  });

  const navigateToImageMarkerScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('imageMarkerEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('imageMarkerEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('imageMarkerScreen');
  };

  it('should allow you to create, update, and delete the ImageMarker entity', async () => {
    await expect(element(by.id('imageMarkerScreen'))).toBeVisible();

    /*
     * Create ImageMarker
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('imageMarkerEditScrollView');
    // imageMarkerxPos
    await scrollTo('imageMarkerxPosInput', 'imageMarkerEditScrollView');
    await element(by.id('imageMarkerxPosInput')).replaceText('35938');
    await element(by.id('imageMarkerxPosInput')).tapReturnKey();
    // imageMarkeryPos
    await scrollTo('imageMarkeryPosInput', 'imageMarkerEditScrollView');
    await element(by.id('imageMarkeryPosInput')).replaceText('77585');
    await element(by.id('imageMarkeryPosInput')).tapReturnKey();
    // imageMarkerDescription
    await scrollTo('imageMarkerDescriptionInput', 'imageMarkerEditScrollView');
    await element(by.id('imageMarkerDescriptionInput')).replaceText('Unbranded');
    await element(by.id('imageMarkerDescriptionInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'imageMarkerEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View ImageMarker - validate the creation
     */
    await waitForElementToBeVisibleById('imageMarkerDetailScrollView');
    // imageMarkerxPos
    await scrollTo('imageMarkerxPos', 'imageMarkerDetailScrollView');
    await expect(element(by.id('imageMarkerxPos'))).toHaveLabel('35938');
    // imageMarkeryPos
    await scrollTo('imageMarkeryPos', 'imageMarkerDetailScrollView');
    await expect(element(by.id('imageMarkeryPos'))).toHaveLabel('77585');
    // imageMarkerDescription
    await scrollTo('imageMarkerDescription', 'imageMarkerDetailScrollView');
    await expect(element(by.id('imageMarkerDescription'))).toHaveLabel('Unbranded');

    /*
     * Update ImageMarker
     */
    await scrollTo('imageMarkerEditButton', 'imageMarkerDetailScrollView');
    await tapFirstElementByLabel('ImageMarker Edit Button');
    await waitForElementToBeVisibleById('imageMarkerEditScrollView');
    // imageMarkerxPos
    await scrollTo('imageMarkerxPosInput', 'imageMarkerEditScrollView');
    await element(by.id('imageMarkerxPosInput')).replaceText('57731');
    await element(by.id('imageMarkerxPosInput')).tapReturnKey();
    // imageMarkeryPos
    await scrollTo('imageMarkeryPosInput', 'imageMarkerEditScrollView');
    await element(by.id('imageMarkeryPosInput')).replaceText('59565');
    await element(by.id('imageMarkeryPosInput')).tapReturnKey();
    // imageMarkerDescription
    await scrollTo('imageMarkerDescriptionInput', 'imageMarkerEditScrollView');
    await element(by.id('imageMarkerDescriptionInput')).replaceText('Unbranded');
    await element(by.id('imageMarkerDescriptionInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'imageMarkerEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View ImageMarker - validate the update
     */
    await waitForElementToBeVisibleById('imageMarkerDetailScrollView');
    // imageMarkerxPos
    await scrollTo('imageMarkerxPos', 'imageMarkerDetailScrollView');
    await expect(element(by.id('imageMarkerxPos'))).toHaveLabel('57731');
    // imageMarkeryPos
    await scrollTo('imageMarkeryPos', 'imageMarkerDetailScrollView');
    await expect(element(by.id('imageMarkeryPos'))).toHaveLabel('59565');
    // imageMarkerDescription
    await scrollTo('imageMarkerDescription', 'imageMarkerDetailScrollView');
    await expect(element(by.id('imageMarkerDescription'))).toHaveLabel('Unbranded');

    /*
     * Delete
     */
    await scrollTo('imageMarkerDeleteButton', 'imageMarkerDetailScrollView');
    await waitThenTapButton('imageMarkerDeleteButton');
    await waitForElementToBeVisibleById('imageMarkerDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('imageMarkerScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
