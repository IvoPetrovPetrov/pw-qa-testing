import { Locator, Page } from '@playwright/test';

type SidebarMenuItem = 'Forms' | 'Modal & Overlays' | 'Extra Components' | 'Charts' | 'Tables & Data' | 'Auth';

export class SidebarMenu{

    readonly page: Page

    constructor (page: Page) {
        this.page = page
    }

    menuItem(name: SidebarMenuItem): Locator {
        return this.page.getByRole('link', { name, exact: true });
    }

    async openFormsPage() {
        await this.menuItem('Forms').click();
    }

    async openModalAndOverlays() {
        await this.menuItem('Modal & Overlays').click();
    }

    async openExtraComponents() {
        await this.menuItem('Extra Components').click();
    }

    async openCharts() {
        await this.menuItem('Charts').click();
    }

    async openTablesAndData() {
        await this.menuItem('Tables & Data').click();
    }

    async openAuth() {
        await this.menuItem('Auth').click();
    }

}
