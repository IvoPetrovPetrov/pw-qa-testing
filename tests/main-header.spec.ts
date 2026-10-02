import { expect, test } from '@playwright/test';
import { MainHeader, Theme } from '../UI/components/main-header';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

const themeBodyClass: Record<Theme, RegExp> = {
    Light: /nb-theme-default/,
    Dark: /nb-theme-dark/,
    Cosmic: /nb-theme-cosmic/,
    Corporate: /nb-theme-corporate/,
};

// --- 6.1 Smoke and positive cases (docs/test-plans/header-test-plan.md) ---

test('HDR-P01: header renders all six controls with the sidebar expanded by default', {tag: ['@smoke', '@positive']}, async ({ page }) => {
    const header = new MainHeader(page)

    await expect(header.sidebarToggleButton).toBeVisible()
    await expect(header.themeControlButton).toBeVisible()
    await expect(header.searchButton).toBeVisible()
    await expect(header.mailIcon).toBeVisible()
    await expect(header.notificationsIcon).toBeVisible()
    await expect(header.userMenuButton).toBeVisible()
    await expect(header.sidebarContainer).toHaveClass(/expanded/)
})

test('HDR-P02: collapses the sidebar on the first toggle click', {tag: '@positive'}, async ({ page }) => {
    const header = new MainHeader(page)

    await header.toggleSidebar()

    await expect(header.sidebarContainer).toHaveClass(/compacted/)
    await expect(header.sidebarContainer).not.toHaveClass(/expanded/)
})

test('HDR-P03: restores the expanded sidebar on the second toggle click', {tag: '@positive'}, async ({ page }) => {
    const header = new MainHeader(page)

    await header.toggleSidebar()
    await header.toggleSidebar()

    await expect(header.sidebarContainer).toHaveClass(/expanded/)
    await expect(header.sidebarContainer).not.toHaveClass(/compacted/)
})

test('HDR-P04: switches the theme from Light to Dark', {tag: '@positive'}, async ({ page }) => {
    const header = new MainHeader(page)
    await expect(page.locator('body')).toHaveClass(themeBodyClass.Light)

    await header.switchTheme('Dark')

    await expect(header.themeControlButton).toHaveText('Dark')
    await expect(page.locator('body')).toHaveClass(themeBodyClass.Dark)
})

test('HDR-P05: cycles the theme through Cosmic, Corporate, and back to Light', {tag: '@positive'}, async ({ page }) => {
    const header = new MainHeader(page)
    const themes: Theme[] = ['Cosmic', 'Corporate', 'Light']

    for (const theme of themes) {
        await header.switchTheme(theme)

        await expect(header.themeControlButton).toHaveText(theme)
        await expect(page.locator('body')).toHaveClass(themeBodyClass[theme])
    }
})

test('HDR-P06: opens the search box and focuses its input', {tag: '@positive'}, async ({ page }) => {
    const header = new MainHeader(page)

    await header.openSearch()

    await expect(header.searchInput).toBeVisible()
    await expect(header.searchInput).toBeFocused()
})

// Finding HF01: pressing Enter does not close the search box - documents the
// current (broken) behavior so a real fix downstream is caught as a change,
// the same pattern used for the IoT plan's inert Pause/Logs/Setup actions.
test('HDR-P07: pressing Enter in the search box does not close it', {tag: ['@negative', '@known-issue']}, async ({ page }) => {
    const header = new MainHeader(page)
    await header.openSearch()

    await header.search('test')

    await expect(header.searchInput).toBeVisible()
})

test('HDR-P08: opens the user dropdown listing Profile and Log out', {tag: '@positive'}, async ({ page }) => {
    const header = new MainHeader(page)

    await header.toggleUserMenu()

    await expect(header.userMenuPanel).toBeVisible()
    await expect(header.userMenuPanel.getByText('Profile', {exact: true})).toBeVisible()
    await expect(header.userMenuPanel.getByText('Log out', {exact: true})).toBeVisible()
})

test('HDR-P09: closes the user dropdown on a second click', {tag: '@positive'}, async ({ page }) => {
    const header = new MainHeader(page)
    await header.toggleUserMenu()
    await expect(header.userMenuPanel).toBeVisible()

    await header.toggleUserMenu()

    await expect(header.userMenuPanel).toBeHidden()
})

// --- 6.2 Negative cases (docs/test-plans/header-test-plan.md) ---

test('HDR-N01: clicking the mail icon has no observable effect', {tag: '@negative'}, async ({ page }) => {
    const header = new MainHeader(page)
    const urlBefore = page.url()
    const elementCountBefore = await page.locator('*').count()

    await header.mailIcon.click()

    await expect(page).toHaveURL(urlBefore)
    await expect(page.locator('*')).toHaveCount(elementCountBefore)
})

test('HDR-N02: clicking the notifications icon has no observable effect', {tag: '@negative'}, async ({ page }) => {
    const header = new MainHeader(page)
    const urlBefore = page.url()
    const elementCountBefore = await page.locator('*').count()

    await header.notificationsIcon.click()

    await expect(page).toHaveURL(urlBefore)
    await expect(page.locator('*')).toHaveCount(elementCountBefore)
})

test('HDR-N03: pressing Enter on an empty search box produces no error', {tag: '@negative'}, async ({ page }) => {
    const header = new MainHeader(page)
    await header.openSearch()

    await header.searchInput.press('Enter')

    await expect(header.searchInput).toBeVisible()
})

test('HDR-N04: a long or special-character search string is handled safely', {tag: '@negative'}, async ({ page }) => {
    const header = new MainHeader(page)
    await header.openSearch()
    const urlBefore = page.url()
    const riskyText = '<script>alert(1)</script>'.repeat(20)

    await header.search(riskyText)

    await expect(page).toHaveURL(urlBefore)
    await expect(header.searchInput).toBeVisible()
})

test('HDR-N05: a single click while the user dropdown is open closes it', {tag: '@negative'}, async ({ page }) => {
    const header = new MainHeader(page)
    await header.toggleUserMenu()
    await expect(header.userMenuPanel).toBeVisible()

    await header.userMenuButton.click()

    await expect(header.userMenuPanel).toBeHidden()
})

test('HDR-N06: clicking elsewhere on the page closes the open user dropdown', {tag: '@negative'}, async ({ page }) => {
    const header = new MainHeader(page)
    await header.toggleUserMenu()
    await expect(header.userMenuPanel).toBeVisible()

    await page.mouse.click(10, 10)

    await expect(header.userMenuPanel).toBeHidden()
})

test('HDR-N07: rapidly double-clicking the sidebar toggle ends in a stable state', {tag: '@negative'}, async ({ page }) => {
    const header = new MainHeader(page)

    await header.sidebarToggleButton.dblclick()

    await expect(header.sidebarContainer).toHaveClass(/expanded/)
    await expect(header.sidebarContainer).not.toHaveClass(/compacted/)
})

// Finding HF01: the close ("x") button is confirmed inert, same as Enter (HDR-P07).
test('HDR-N08: the search box close button has no observable effect', {tag: ['@negative', '@known-issue']}, async ({ page }) => {
    const header = new MainHeader(page)
    await header.openSearch()

    await header.searchCloseButton.click()

    await expect(header.searchInput).toBeVisible()
})
