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

describe('ProjectImage Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToProjectImageScreen();
  });

  const navigateToProjectImageScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('projectImageEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('projectImageEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('projectImageScreen');
  };

  it('should allow you to create, update, and delete the ProjectImage entity', async () => {
    await expect(element(by.id('projectImageScreen'))).toBeVisible();

    /*
     * Create ProjectImage
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('projectImageEditScrollView');
    // projectImageName
    await scrollTo('projectImageNameInput', 'projectImageEditScrollView');
    await element(by.id('projectImageNameInput')).replaceText('extend');
    await element(by.id('projectImageNameInput')).tapReturnKey();
    // projectImageUploadDate
    await scrollTo('projectImageUploadDateInput', 'projectImageEditScrollView');
    await setDateTimePickerValue('projectImageUploadDateInput', '2022-03-14T20:14:00+01:00', 'ISO8601');
    // projectImageAwsUrl
    await scrollTo('projectImageAwsUrlInput', 'projectImageEditScrollView');
    await element(by.id('projectImageAwsUrlInput')).replaceText('Orchestrator Avon');
    await element(by.id('projectImageAwsUrlInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'projectImageEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View ProjectImage - validate the creation
     */
    await waitForElementToBeVisibleById('projectImageDetailScrollView');
    // projectImageName
    await scrollTo('projectImageName', 'projectImageDetailScrollView');
    await expect(element(by.id('projectImageName'))).toHaveLabel('extend');
    // projectImageUploadDate
    await scrollTo('projectImageUploadDate', 'projectImageDetailScrollView');
    const projectImageUploadDateCreateAttributes = await element(by.id('projectImageUploadDate')).getAttributes();
    jestExpect(Date.parse(projectImageUploadDateCreateAttributes.label)).toEqual(Date.parse('2022-03-14T20:14:00+01:00'));
    // projectImageAwsUrl
    await scrollTo('projectImageAwsUrl', 'projectImageDetailScrollView');
    await expect(element(by.id('projectImageAwsUrl'))).toHaveLabel('Orchestrator Avon');

    /*
     * Update ProjectImage
     */
    await scrollTo('projectImageEditButton', 'projectImageDetailScrollView');
    await tapFirstElementByLabel('ProjectImage Edit Button');
    await waitForElementToBeVisibleById('projectImageEditScrollView');
    // projectImageName
    await scrollTo('projectImageNameInput', 'projectImageEditScrollView');
    await element(by.id('projectImageNameInput')).replaceText('extend');
    await element(by.id('projectImageNameInput')).tapReturnKey();
    // projectImageUploadDate
    await scrollTo('projectImageUploadDateInput', 'projectImageEditScrollView');
    await setDateTimePickerValue('projectImageUploadDateInput', '2022-03-15T00:11:00+01:00', 'ISO8601');
    // projectImageAwsUrl
    await scrollTo('projectImageAwsUrlInput', 'projectImageEditScrollView');
    await element(by.id('projectImageAwsUrlInput')).replaceText('Orchestrator Avon');
    await element(by.id('projectImageAwsUrlInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'projectImageEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View ProjectImage - validate the update
     */
    await waitForElementToBeVisibleById('projectImageDetailScrollView');
    // projectImageName
    await scrollTo('projectImageName', 'projectImageDetailScrollView');
    await expect(element(by.id('projectImageName'))).toHaveLabel('extend');
    // projectImageUploadDate
    await scrollTo('projectImageUploadDate', 'projectImageDetailScrollView');
    const projectImageUploadDateUpdateAttributes = await element(by.id('projectImageUploadDate')).getAttributes();
    jestExpect(Date.parse(projectImageUploadDateUpdateAttributes.label)).toEqual(Date.parse('2022-03-15T00:11:00+01:00'));
    // projectImageAwsUrl
    await scrollTo('projectImageAwsUrl', 'projectImageDetailScrollView');
    await expect(element(by.id('projectImageAwsUrl'))).toHaveLabel('Orchestrator Avon');

    /*
     * Delete
     */
    await scrollTo('projectImageDeleteButton', 'projectImageDetailScrollView');
    await waitThenTapButton('projectImageDeleteButton');
    await waitForElementToBeVisibleById('projectImageDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('projectImageScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
