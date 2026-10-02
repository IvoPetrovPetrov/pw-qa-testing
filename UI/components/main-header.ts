import { Locator, Page } from '@playwright/test';

export type Theme = 'Light' | 'Dark' | 'Cosmic' | 'Corporate';

export class MainHeader {

    readonly page: Page
    readonly sidebarToggleButton: Locator
    readonly sidebarContainer: Locator
    readonly themeControlButton: Locator
    readonly searchButton: Locator
    readonly searchInput: Locator
    readonly searchCloseButton: Locator
    readonly mailIcon: Locator
    readonly notificationsIcon: Locator
    readonly userMenuButton: Locator
    readonly userMenuPanel: Locator

    constructor (page: Page) {
        this.page = page
        this.sidebarToggleButton = page.locator('nb-layout-header a.sidebar-toggle')
        this.sidebarContainer = page.locator('nb-sidebar')
        this.themeControlButton = page.locator('nb-layout-header nb-select button.select-button')
        this.searchButton = page.locator('nb-search button.start-search')
        this.searchInput = page.locator('nb-search-field .search-input')
        this.searchCloseButton = page.locator('button.close-button')
        this.mailIcon = page.locator('nb-action[icon="email-outline"]')
        this.notificationsIcon = page.locator('nb-action[icon="bell-outline"]')
        this.userMenuButton = page.locator('nb-layout-header nb-action.user-action nb-user')
        this.userMenuPanel = page.locator('nb-context-menu nb-menu')
    }

    async toggleSidebar(): Promise<void> {
        await this.sidebarToggleButton.click()
    }

    async switchTheme(theme: Theme): Promise<void> {
        await this.themeControlButton.click()
        await this.page.locator('nb-option').filter({hasText: new RegExp(`^\\s*${theme}\\s*$`, 'i')}).click()
    }

    async openSearch(): Promise<void> {
        await this.searchButton.click()
    }

    async search(text: string): Promise<void> {
        await this.searchInput.fill(text)
        await this.searchInput.press('Enter')
    }

    async toggleUserMenu(): Promise<void> {
        await this.userMenuButton.click()
    }
}
