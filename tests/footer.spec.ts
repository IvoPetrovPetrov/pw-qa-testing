import { expect, test } from '@playwright/test';
import { Footer } from '../UI/components/footer';
import { IotDashboardPage } from '../UI/pages/iot-dashboard-page';

test.beforeEach(async ({ page }) => {
    await new IotDashboardPage(page).open();
});

// --- 6.1 Smoke and positive cases (docs/test-plans/footer-test-plan.md) ---

test('FTR-P01: footer displays the two attribution links and four social icons', {tag: ['@smoke', '@positive']}, async ({ page }) => {
    const footer = new Footer(page)

    await expect(footer.akveoLink).toBeVisible()
    await expect(footer.bondarAcademyLink).toBeVisible()
    await expect(footer.gitHubIcon).toBeVisible()
    await expect(footer.facebookIcon).toBeVisible()
    await expect(footer.twitterIcon).toBeVisible()
    await expect(footer.linkedInIcon).toBeVisible()
})

test('FTR-P02: clicking the Akveo link opens a new tab to the Akveo destination', {tag: '@positive'}, async ({ page, context }) => {
    const footer = new Footer(page)
    const urlBefore = page.url()

    const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        footer.clickAkveoLink()
    ])
    await newTab.waitForLoadState()

    // akveo.page.link is a short link that redirects to akveo.com with
    // marketing UTM params - match the host, not the full query string.
    await expect(newTab).toHaveURL(/^https:\/\/(www\.)?akveo\.com\//)
    await expect(page).toHaveURL(urlBefore)
})

test('FTR-P03: clicking the Bondar Academy link opens a new tab to the Bondar Academy destination', {tag: '@positive'}, async ({ page, context }) => {
    const footer = new Footer(page)
    const urlBefore = page.url()

    const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        footer.clickBondarAcademyLink()
    ])
    await newTab.waitForLoadState()

    // Live redirect strips "www." from the href's https://www.bondaracademy.com
    await expect(newTab).toHaveURL('https://bondaracademy.com/')
    await expect(page).toHaveURL(urlBefore)
})

test('FTR-P04: hovering a social icon shows a visible color change', {tag: '@positive'}, async ({ page }) => {
    const footer = new Footer(page)

    await expect(footer.gitHubIcon).toHaveCSS('color', 'rgb(143, 155, 179)')
    await footer.gitHubIcon.hover()
    await expect(footer.gitHubIcon).toHaveCSS('color', 'rgb(34, 43, 69)')

    for (const icon of [footer.facebookIcon, footer.twitterIcon, footer.linkedInIcon]) {
        const colorBefore = await icon.evaluate(el => getComputedStyle(el).color)
        await icon.hover()
        await expect.poll(() => icon.evaluate(el => getComputedStyle(el).color)).not.toBe(colorBefore)
    }
})

// Finding FF01: all four icons use a placeholder href="#", so the "new tab"
// simply lands back on the page the footer is on - documenting current
// behavior so a real fix downstream is caught as a change, the same pattern
// used for the header's Finding HF01.
test('FTR-P05: clicking the GitHub icon opens a new tab landing back on the current page', {tag: ['@positive', '@known-issue']}, async ({ page, context }) => {
    const footer = new Footer(page)
    const urlBefore = page.url()

    const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        footer.clickGitHubIcon()
    ])
    await newTab.waitForLoadState()

    await expect(newTab).toHaveURL(urlBefore)
})

test('FTR-P05: clicking the Facebook icon opens a new tab landing back on the current page', {tag: ['@positive', '@known-issue']}, async ({ page, context }) => {
    const footer = new Footer(page)
    const urlBefore = page.url()

    const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        footer.clickFacebookIcon()
    ])
    await newTab.waitForLoadState()

    await expect(newTab).toHaveURL(urlBefore)
})

test('FTR-P05: clicking the Twitter icon opens a new tab landing back on the current page', {tag: ['@positive', '@known-issue']}, async ({ page, context }) => {
    const footer = new Footer(page)
    const urlBefore = page.url()

    const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        footer.clickTwitterIcon()
    ])
    await newTab.waitForLoadState()

    await expect(newTab).toHaveURL(urlBefore)
})

test('FTR-P05: clicking the LinkedIn icon opens a new tab landing back on the current page', {tag: ['@positive', '@known-issue']}, async ({ page, context }) => {
    const footer = new Footer(page)
    const urlBefore = page.url()

    const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        footer.clickLinkedInIcon()
    ])
    await newTab.waitForLoadState()

    await expect(newTab).toHaveURL(urlBefore)
})

// --- 6.2 Negative cases (docs/test-plans/footer-test-plan.md) ---

test('FTR-N01: ctrl-clicking each footer link still opens it in a new tab', {tag: '@negative'}, async ({ page, context }) => {
    const footer = new Footer(page)
    const links = [footer.akveoLink, footer.bondarAcademyLink, footer.gitHubIcon, footer.facebookIcon, footer.twitterIcon, footer.linkedInIcon]

    for (const link of links) {
        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            link.click({modifiers: ['ControlOrMeta']})
        ])
        await newTab.waitForLoadState()
        await expect(newTab).not.toBeNull()
        await newTab.close()
    }
})

test('FTR-N02: clicking any footer link leaves the original tab unchanged', {tag: '@negative'}, async ({ page, context }) => {
    const footer = new Footer(page)
    const urlBefore = page.url()
    const links = [footer.akveoLink, footer.bondarAcademyLink, footer.gitHubIcon, footer.facebookIcon, footer.twitterIcon, footer.linkedInIcon]

    for (const link of links) {
        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            link.click()
        ])
        await newTab.waitForLoadState()
        await newTab.close()

        await expect(page).toHaveURL(urlBefore)
    }
})

// Finding FF02 (confirmed defect): none of the six footer links carries
// rel="noopener" on their target="_blank" anchor - a reverse-tabnabbing
// exposure. This test documents the current (vulnerable) state so a fix
// downstream is caught as a change, not silently ignored.
test('FTR-N03: none of the six footer links has a rel="noopener" attribute', {tag: ['@negative', '@known-issue']}, async ({ page }) => {
    const footer = new Footer(page)
    const links = [footer.akveoLink, footer.bondarAcademyLink, footer.gitHubIcon, footer.facebookIcon, footer.twitterIcon, footer.linkedInIcon]

    for (const link of links) {
        await expect(link).toHaveAttribute('target', '_blank')
        await expect(link).not.toHaveAttribute('rel')
    }
})

test('FTR-N04: only the company name is clickable, not the full attribution phrase', {tag: '@negative'}, async ({ page }) => {
    const footer = new Footer(page)
    const attributionText = page.locator('span.created-by')

    await expect(attributionText).toContainText('Created by Akveo. Modified by Bondar Academy.')
    await expect(footer.akveoLink).toHaveText('Akveo')
    await expect(footer.bondarAcademyLink).toHaveText('Bondar Academy')
})
