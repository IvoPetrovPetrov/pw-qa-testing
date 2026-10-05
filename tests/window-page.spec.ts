import { expect, test } from '@playwright/test';
import { NavigationPage } from '../UI/pages/navigation-page'
import { WindowPage } from '../UI/pages/window-page';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

});

test('Open window page and verify its card', async ({ page }) => {
    const navigateTo = new NavigationPage(page)
    const windowPage = new WindowPage(page)

    await navigateTo.windowPage()
    await windowPage.openWindowForm()
    const windowCard = page.locator('nb-card').filter({
        has: page.locator('nb-card-header', { hasText: /^Window$/ })
    })
    await expect(windowCard).toBeVisible()
    await expect(windowCard.getByRole('textbox', { name: 'Subject:' })).toBeVisible()
    await expect(windowCard.getByRole('textbox', { name: 'Text:' })).toBeVisible()
    await windowPage.closeWindowFormPopup()
})

test('Open window without backdrop and verify its card', async ({ page }) => {
    const navigateTo = new NavigationPage(page)
    const windowPage = new WindowPage(page)
    await navigateTo.windowPage()
    await windowPage.openWindowWithoutBackdrop()
    const windowCard = page.locator('nb-card').filter({
        has: page.locator('nb-card-header', { hasText:'Window without backdrop' })
    })
    await expect(windowCard).toBeVisible()
    await windowPage.closeWindowWithoutBackdropPopup()
})

test('Open closed shadow dom and verify its card', async ({ page }) => {
    const navigateTo = new NavigationPage(page)
    const windowPage = new WindowPage(page)
    await navigateTo.windowPage()
    await windowPage.openClosedShadowDom()
    await expect(windowPage.shadowDomWindow).toBeVisible()
    await expect(windowPage.shadowDomWindow.locator('nb-card-body'))
        .toHaveText('Here is the text provided via config: "Opened in the closed Shadow Dom"')
    await windowPage.closeShadowDomPopup()
})