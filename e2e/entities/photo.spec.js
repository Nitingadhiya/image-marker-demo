const jestExpect = require('expect');
const {
  reloadApp,
  loginAsUser,
  logout,
  goBack,
  tapFirstElementByLabel,
  openAndTapDrawerMenuItemByLabel,
  waitThenTapButton,
  waitForElementToBeVisibleById,
  setDateTimePickerValue,
  scrollTo,
} = require('../utils');

describe('Photo Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToPhotoScreen();
  });

  const navigateToPhotoScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('photoEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('photoEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('photoScreen');
  };

  it('should allow you to create, update, and delete the Photo entity', async () => {
    await expect(element(by.id('photoScreen'))).toBeVisible();

    /*
     * Create Photo
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('photoEditScrollView');
    // photoName
    await scrollTo('photoNameInput', 'photoEditScrollView');
    await element(by.id('photoNameInput')).replaceText('Direct');
    await element(by.id('photoNameInput')).tapReturnKey();
    // photoUploadDate
    await scrollTo('photoUploadDateInput', 'photoEditScrollView');
    await setDateTimePickerValue('photoUploadDateInput', '2022-03-15T08:12:00+01:00', 'ISO8601');
    // save
    await scrollTo('submitButton', 'photoEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View Photo - validate the creation
     */
    await waitForElementToBeVisibleById('photoDetailScrollView');
    // photoName
    await scrollTo('photoName', 'photoDetailScrollView');
    await expect(element(by.id('photoName'))).toHaveLabel('Direct');
    // photoUploadDate
    await scrollTo('photoUploadDate', 'photoDetailScrollView');
    const photoUploadDateCreateAttributes = await element(by.id('photoUploadDate')).getAttributes();
    jestExpect(Date.parse(photoUploadDateCreateAttributes.label)).toEqual(Date.parse('2022-03-15T08:12:00+01:00'));

    /*
     * Update Photo
     */
    await scrollTo('photoEditButton', 'photoDetailScrollView');
    await tapFirstElementByLabel('Photo Edit Button');
    await waitForElementToBeVisibleById('photoEditScrollView');
    // photoName
    await scrollTo('photoNameInput', 'photoEditScrollView');
    await element(by.id('photoNameInput')).replaceText('Direct');
    await element(by.id('photoNameInput')).tapReturnKey();
    // photoUploadDate
    await scrollTo('photoUploadDateInput', 'photoEditScrollView');
    await setDateTimePickerValue('photoUploadDateInput', '2022-03-15T01:55:00+01:00', 'ISO8601');
    // save
    await scrollTo('submitButton', 'photoEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View Photo - validate the update
     */
    await waitForElementToBeVisibleById('photoDetailScrollView');
    // photoName
    await scrollTo('photoName', 'photoDetailScrollView');
    await expect(element(by.id('photoName'))).toHaveLabel('Direct');
    // photoUploadDate
    await scrollTo('photoUploadDate', 'photoDetailScrollView');
    const photoUploadDateUpdateAttributes = await element(by.id('photoUploadDate')).getAttributes();
    jestExpect(Date.parse(photoUploadDateUpdateAttributes.label)).toEqual(Date.parse('2022-03-15T01:55:00+01:00'));

    /*
     * Delete
     */
    await scrollTo('photoDeleteButton', 'photoDetailScrollView');
    await waitThenTapButton('photoDeleteButton');
    await waitForElementToBeVisibleById('photoDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('photoScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
