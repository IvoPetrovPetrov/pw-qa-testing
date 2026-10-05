import { Locator, Page } from '@playwright/test';

export class WindowPage {

    readonly page: Page
    readonly windowForm: Locator
    readonly windowFormWithout: Locator
    readonly closedShadowDom: Locator
    readonly shadowDomWindow: Locator
    readonly openHomePageNewTab: Locator
    readonly windowHeader: Locator
    readonly closeWindowForm: Locator
    readonly windowFromWithoutPopUp: Locator
    readonly windowShadowDom: Locator
    readonly closeShadowDom: Locator

    constructor (page: Page) {
        this.page = page
        this.windowForm = page.locator('nb-card', {hasText: 'Open window form'})
        this.windowFormWithout = page.locator('nb-card', {hasText: 'Open window without backdrop'})
        this.closedShadowDom = page.locator('window-shadow')
        this.shadowDomWindow = page.locator('nb-card').filter({
            has: page.locator('nb-card-header', { hasText: /^Shadow Dom Window$/ })
        })
        this.openHomePageNewTab = page.locator('nb-card', {hasText: 'Open homepage in a new tab'})
        this.windowHeader = page.locator('nb-card-header', {hasText: 'Window'})
        this.closeWindowForm = page.getByRole('button').filter({ hasText: /^$/ }).nth(3)
        this.windowFromWithoutPopUp = page.getByRole('button').filter({ hasText: /^$/ }).nth(3)
        this.closeShadowDom = this.shadowDomWindow.locator('button:has(nb-icon[icon="close-outline"])')
        this.windowShadowDom = page.locator('nb-card').filter({
            has: page.locator('nb-card-header', { hasText: /^Shadow Dom Window$/ })
        })
    }

    async openWindowForm(){
        await this.windowForm.getByRole('button', {name: 'Open window form'}).click()
    }

    async openWindowWithoutBackdrop(){
        await this.windowFormWithout.getByRole('button', {name: 'Open window without backdrop'}).click()
    }

    async openClosedShadowDom(){
        // The button is inside a closed shadow root, so click its visible position on the host.
        await this.closedShadowDom.click({ position: { x: 76, y: 87 } })
    }

    async openHomePageInNewTab(){
        await this.openHomePageNewTab.getByRole('button', {name: 'Open homepage in a new tab'}).click()
    }
    
    async closeWindowFormPopup(){
        await this.closeWindowForm.click();
    }

    async closeWindowWithoutBackdropPopup(){
        await this.windowFromWithoutPopUp.click();
    }

    async closeShadowDomPopup(){
        await this.closeShadowDom.click();
    }

}