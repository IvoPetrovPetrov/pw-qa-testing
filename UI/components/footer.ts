import { Locator, Page } from '@playwright/test';

export class Footer {

    readonly page: Page;
    readonly akveoLink: Locator;
    readonly bondarAcademyLink: Locator;
    readonly gitHubIcon: Locator;
    readonly facebookIcon: Locator;
    readonly twitterIcon: Locator;
    readonly linkedInIcon: Locator;

    constructor (page: Page) {
        this.page = page
        this.akveoLink = page.getByRole('link', { name: 'Akveo', exact: true })
        this.bondarAcademyLink = page.getByRole('link', { name: 'Bondar Academy', exact: true })
        this.gitHubIcon = page.locator('.ion.ion-social-github')
        this.facebookIcon = page.locator('.ion.ion-social-facebook')
        this.twitterIcon = page.locator('.ion.ion-social-twitter')
        this.linkedInIcon = page.locator('.ion.ion-social-linkedin')
    }

    async clickAkveoLink(){
        await this.akveoLink.click()
    }

    async clickBondarAcademyLink(){
        await this.bondarAcademyLink.click()
    }

    async clickGitHubIcon(){
        await this.gitHubIcon.click()
    }

    async clickFacebookIcon(){
        await this.facebookIcon.click()
    }
    async clickTwitterIcon(){
        await this.twitterIcon.click()
    }
    async clickLinkedInIcon(){
        await this.linkedInIcon.click()
    }

}
