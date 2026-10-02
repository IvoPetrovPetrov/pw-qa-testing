import { Locator, Page } from '@playwright/test';

export class DialogPage {

    readonly page: Page
    readonly openDialogCard: Locator
    readonly openDialogWithDelayCard: Locator
    readonly dialogContainer: Locator

    constructor (page: Page) {
        this.page = page
        this.openDialogCard = page.locator('nb-card', {hasText: 'Open Dialog'})
        this.openDialogWithDelayCard = page.locator('nb-card', {hasText: 'Open Dialog With Delay'})
        this.dialogContainer = page.locator('nb-dialog-container')
    }

    async openComponentDialog(){
        await this.openDialogCard.getByRole('button', {name: 'Open Dialog with component'}).click()
    }

    async closeComponentDialog(){
        await this.dialogContainer.getByRole('button', {name: 'Dismiss Dialog'}).click()
    }

    async openDialogWithTemplate(){
        await this.openDialogCard.getByRole('button', {name: 'Open Dialog with template'}).click()
    }

    async closeComponentWithDialog(){
        await this.dialogContainer.getByRole('button', {name: 'OK'}).click()
    }

    async openDialogWithDelay3Seconds(){
        await this.openDialogWithDelayCard.getByRole('button', {name: 'Open with delay 3 seconds'}).click()
    }

    async openDialogWithDelay10Seconds(){
        await this.openDialogWithDelayCard.getByRole('button', {name: 'Open with delay 10 seconds'}).click()
    }

    async closeDialogWithDelay(){
        await this.dialogContainer.getByRole('button', {name: 'OK'}).click()
    }

}
