import { expect, test } from '@playwright/test';
import { NavigationPage } from '../UI/pages/navigation-page';
import { PopoverPage } from '../UI/pages/popover-page';

const simplePopoverText = 'Hello, how are you today?';

test.beforeEach(async ({ page }) => {
    await page.goto('/');

    const navigationPage = new NavigationPage(page);
    await navigationPage.popoverPage();
});

test('POP-P01: open the Popover page and verify its initial UI', async ({ page }) => {
    const popoverPage = new PopoverPage(page);

    await expect(page).toHaveURL(/\/pages\/modal-overlays\/popover$/);
    await expect(popoverPage.popoverPositionCard).toBeVisible();
    await expect(popoverPage.simplePopoverCard).toBeVisible();
    await expect(popoverPage.templatePopoverCard).toBeVisible();
    await expect(popoverPage.componentPopoverCard).toBeVisible();
    await expect(popoverPage.eventDebouncingCard).toBeVisible();

    await expect(popoverPage.leftButton).toBeVisible();
    await expect(popoverPage.topButton).toBeVisible();
    await expect(popoverPage.bottomButton).toBeVisible();
    await expect(popoverPage.rightButton).toBeVisible();
    await expect(popoverPage.onClickPopoverButton).toBeVisible();
    await expect(popoverPage.onHoverPopoverButton).toBeVisible();
    await expect(popoverPage.onHintPopoverButton).toBeVisible();
    await expect(popoverPage.templatePopoverCard.getByRole('button')).toHaveCount(3);
    await expect(popoverPage.componentPopoverCard.getByRole('button')).toHaveCount(3);
    await expect(popoverPage.showHintButtons).toHaveCount(16);
    await expect(page.getByText(simplePopoverText, { exact: true })).toBeHidden();
});

test('POP-P02: activate the simple click popover and verify its content', async ({ page }) => {
    const popoverPage = new PopoverPage(page);
    const popoverText = page.getByText(simplePopoverText, { exact: true });

    await popoverPage.openSimplePopover('on click');

    await expect(popoverText).toBeVisible();
    await expect(popoverText).toHaveCount(1);
});

test('POP-P03: activate and dismiss the simple hover popover', async ({ page }) => {
    const popoverPage = new PopoverPage(page);
    const popoverText = page.getByText(simplePopoverText, { exact: true });

    await popoverPage.onHoverPopoverButton.hover();
    await expect(popoverText).toBeVisible();

    await page.getByText('Popover Position', { exact: true }).hover();
    await expect(popoverText).toBeHidden();
});

test('POP-N01: keep the click popover closed on hover, then open it on click', async ({ page }) => {
    const popoverPage = new PopoverPage(page);
    const popoverText = page.getByText(simplePopoverText, { exact: true });

    await popoverPage.onClickPopoverButton.hover();
    await expect(popoverText).toBeHidden();

    await popoverPage.onClickPopoverButton.click();
    await expect(popoverText).toBeVisible();
});

test('POP-A01: render and switch tabs in template and component popovers', async ({ page }) => {
    const popoverPage = new PopoverPage(page);

    for (const openTabsPopover of [
        () => popoverPage.openTemplatePopover('With tabs'),
        () => popoverPage.openComponentPopover('With tabs'),
    ]) {
        await openTabsPopover();

        const firstTab = page.getByRole('link', { name: /What's up\?/i });
        const secondTab = page.getByRole('link', { name: /Second Tab/i });
        await expect(firstTab).toBeVisible();
        await expect(secondTab).toBeVisible();
        await expect(page.getByText('Such a wonderful day!', { exact: true })).toBeVisible();

        await secondTab.click();
        await expect(page.getByText('Indeed!', { exact: true })).toBeVisible();
        await expect(page.getByText('Such a wonderful day!', { exact: true })).toBeHidden();

        await page.getByText('Popover Position', { exact: true }).click();
        await expect(secondTab).toBeHidden();
    }
});

test('POP-A02: render and enter text in template and component form popovers', async ({ page }) => {
    const popoverPage = new PopoverPage(page);
    const formCases = [
        () => popoverPage.openTemplatePopover('With form'),
        () => popoverPage.openComponentPopover('With form'),
    ];

    for (const openFormPopover of formCases) {
        await openFormPopover();

        const recipients = page.getByRole('textbox', { name: 'Recipients' });
        const subject = page.getByRole('textbox', { name: 'Subject' });
        const message = page.getByRole('textbox', { name: 'Message' });

        await expect(recipients).toBeVisible();
        await expect(subject).toBeVisible();
        await expect(message).toBeVisible();
        await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();

        await recipients.fill('qa@example.test');
        await subject.fill('Popover check');
        await message.fill('UI-only sample');

        await expect(recipients).toHaveValue('qa@example.test');
        await expect(subject).toHaveValue('Popover check');
        await expect(message).toHaveValue('UI-only sample');

        await page.getByText('Popover Position', { exact: true }).click();
        await expect(recipients).toBeHidden();
    }
});

test('POP-A03: render matching card content in template and component popovers', async ({ page }) => {
    const popoverPage = new PopoverPage(page);

    for (const openCardPopover of [
        () => popoverPage.openTemplatePopover('With card'),
        () => popoverPage.openComponentPopover('With card'),
    ]) {
        await openCardPopover();

        await expect(page.getByText('Hello!', { exact: true })).toBeVisible();
        await expect(page.getByText('Far far away, behind the word mountains')).toBeVisible();

        await page.getByText('Popover Position', { exact: true }).click();
        await expect(page.getByText('Hello!', { exact: true })).toBeHidden();
    }
});

test('POP-R01: dismiss and reopen the simple click popover', async ({ page }) => {
    const popoverPage = new PopoverPage(page);
    const popoverText = page.getByText(simplePopoverText, { exact: true });

    await popoverPage.openSimplePopover('on click');
    await expect(popoverText).toBeVisible();

    await page.getByText('Popover Position', { exact: true }).click();
    await expect(popoverText).toBeHidden();

    await popoverPage.openSimplePopover('on click');
    await expect(popoverText).toBeVisible();
});
