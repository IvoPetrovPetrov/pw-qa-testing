import { expect, test } from '@playwright/test';
import { NavigationPage } from '../UI/pages/navigation-page'
import { DialogPage } from '../UI/pages/dialog-page';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

});

test('Open component dialog and verify its card', async ({ page }) => {
    const navigateTo = new NavigationPage(page)
    const dialogPage = new DialogPage(page)

    await navigateTo.dialogPage()
    await dialogPage.openComponentDialog()
    const headerCard = page.locator('nb-dialog-container', {hasText: 'This is a title passed to the dialog component'})
    await expect(headerCard).toBeVisible()
    await expect(headerCard).toContainText('This is a title passed to the dialog component')
})

test('Dismiss component dialog', async ({ page }) => {
    const navigateTo = new NavigationPage(page)
    const dialogPage = new DialogPage(page)

    await navigateTo.dialogPage()
    await dialogPage.openComponentDialog()
    const headerCard = page.locator('nb-dialog-container', {hasText: 'This is a title passed to the dialog component'})
    await dialogPage.closeComponentDialog()
    await expect(headerCard).toBeHidden()
})

test('Open template component and verify its card', async ({ page }) => {
    const navigateTo = new NavigationPage(page)
    const dialogPage = new DialogPage(page)

    await navigateTo.dialogPage()
    await dialogPage.openDialogWithTemplate()
    const headerCard = page.locator('nb-dialog-container', {hasText: 'Friendly reminder'})
    await expect(headerCard).toBeVisible()
    await expect(headerCard).toContainText('this is some additional data passed to dialog')
})

test('Close template component  ', async ({ page }) => {
    const navigateTo = new NavigationPage(page)
    const dialogPage = new DialogPage(page)

    await navigateTo.dialogPage()
    await dialogPage.openDialogWithTemplate()
    const headerCard = page.locator('nb-dialog-container', {hasText: 'Friendly reminder'})
    await dialogPage.closeComponentWithDialog()
    await expect(headerCard).toBeHidden()
})

test('Open dialog with 3 seconds delay and verify its card', async ({ page }) => {
    const navigateTo = new NavigationPage(page)
    const dialogPage = new DialogPage(page)

    await navigateTo.dialogPage()
    await dialogPage.openDialogWithDelay3Seconds()
    const headerCard = page.locator('nb-dialog-container', {hasText: 'Friendly reminder'})
    await expect(headerCard).toBeVisible()
    await expect(headerCard).toContainText('Dialog opened after a 3 second API call')
})

test('Close dialog with 3 seconds delay', async ({ page }) => {
    const navigateTo = new NavigationPage(page)
    const dialogPage = new DialogPage(page)

    await navigateTo.dialogPage()
    await dialogPage.openDialogWithDelay3Seconds()
    const headerCard = page.locator('nb-dialog-container', {hasText: 'Friendly reminder'})
    await dialogPage.closeDialogWithDelay()
    await expect(headerCard).toBeHidden()
})

test('Open dialog with 10 seconds delay and verify its card', async ({ page }) => {
    const navigateTo = new NavigationPage(page)
    const dialogPage = new DialogPage(page)

    await navigateTo.dialogPage()
    await dialogPage.openDialogWithDelay10Seconds()
    const headerCard = page.locator('nb-dialog-container', {hasText: 'Friendly reminder'})
    await expect(headerCard).toBeVisible({ timeout: 12000 })
    await expect(headerCard).toContainText('Dialog opened after a 10 second API call')
})

test('Close dialog with 10 seconds delay', async ({ page }) => {
    const navigateTo = new NavigationPage(page)
    const dialogPage = new DialogPage(page)

    await navigateTo.dialogPage()
    await dialogPage.openDialogWithDelay10Seconds()
    const headerCard = page.locator('nb-dialog-container', {hasText: 'Friendly reminder'})
    await expect(headerCard).toBeVisible({ timeout: 12000 })
    await dialogPage.closeDialogWithDelay()
    await expect(headerCard).toBeHidden()
})
