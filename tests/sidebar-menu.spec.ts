import { expect, test } from '@playwright/test';
import { SidebarMenu } from '../UI/components/sidebar-menu';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

});

//Verify the sidebar menu is presented when open the site

test('Verify the sidebar menu ', async ({ page }) => {
    const sideBar = new SidebarMenu(page)
    await sideBar.openFormsPage()
    await expect(sideBar.menuItem('Forms')).toHaveAttribute('aria-expanded', 'true')

    await sideBar.openModalAndOverlays()
    await expect(sideBar.menuItem('Modal & Overlays')).toHaveAttribute('aria-expanded', 'true')

    await sideBar.openExtraComponents()
    await expect(sideBar.menuItem('Extra Components')).toHaveAttribute('aria-expanded', 'true')

    await sideBar.openCharts()
    await expect(sideBar.menuItem('Charts')).toHaveAttribute('aria-expanded', 'true')

    await sideBar.openTablesAndData()
    await expect(sideBar.menuItem('Tables & Data')).toHaveAttribute('aria-expanded', 'true')

    await sideBar.openAuth()
    await expect(sideBar.menuItem('Auth')).toHaveAttribute('aria-expanded', 'true')
});