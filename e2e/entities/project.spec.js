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

describe('Project Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToProjectScreen();
  });

  const navigateToProjectScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('projectEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('projectEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('projectScreen');
  };

  it('should allow you to create, update, and delete the Project entity', async () => {
    await expect(element(by.id('projectScreen'))).toBeVisible();

    /*
     * Create Project
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('projectEditScrollView');
    // projectName
    await scrollTo('projectNameInput', 'projectEditScrollView');
    await element(by.id('projectNameInput')).replaceText('Uruguayo');
    await element(by.id('projectNameInput')).tapReturnKey();
    // projectStartDate
    await scrollTo('projectStartDateInput', 'projectEditScrollView');
    await setDateTimePickerValue('projectStartDateInput', '2022-03-15T05:49:00+01:00', 'ISO8601');
    // save
    await scrollTo('submitButton', 'projectEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View Project - validate the creation
     */
    await waitForElementToBeVisibleById('projectDetailScrollView');
    // projectName
    await scrollTo('projectName', 'projectDetailScrollView');
    await expect(element(by.id('projectName'))).toHaveLabel('Uruguayo');
    // projectStartDate
    await scrollTo('projectStartDate', 'projectDetailScrollView');
    const projectStartDateCreateAttributes = await element(by.id('projectStartDate')).getAttributes();
    jestExpect(Date.parse(projectStartDateCreateAttributes.label)).toEqual(Date.parse('2022-03-15T05:49:00+01:00'));

    /*
     * Update Project
     */
    await scrollTo('projectEditButton', 'projectDetailScrollView');
    await tapFirstElementByLabel('Project Edit Button');
    await waitForElementToBeVisibleById('projectEditScrollView');
    // projectName
    await scrollTo('projectNameInput', 'projectEditScrollView');
    await element(by.id('projectNameInput')).replaceText('Uruguayo');
    await element(by.id('projectNameInput')).tapReturnKey();
    // projectStartDate
    await scrollTo('projectStartDateInput', 'projectEditScrollView');
    await setDateTimePickerValue('projectStartDateInput', '2022-03-14T21:52:00+01:00', 'ISO8601');
    // save
    await scrollTo('submitButton', 'projectEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View Project - validate the update
     */
    await waitForElementToBeVisibleById('projectDetailScrollView');
    // projectName
    await scrollTo('projectName', 'projectDetailScrollView');
    await expect(element(by.id('projectName'))).toHaveLabel('Uruguayo');
    // projectStartDate
    await scrollTo('projectStartDate', 'projectDetailScrollView');
    const projectStartDateUpdateAttributes = await element(by.id('projectStartDate')).getAttributes();
    jestExpect(Date.parse(projectStartDateUpdateAttributes.label)).toEqual(Date.parse('2022-03-14T21:52:00+01:00'));

    /*
     * Delete
     */
    await scrollTo('projectDeleteButton', 'projectDetailScrollView');
    await waitThenTapButton('projectDeleteButton');
    await waitForElementToBeVisibleById('projectDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('projectScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
