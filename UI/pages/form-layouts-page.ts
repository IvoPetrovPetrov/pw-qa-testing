import { Page } from '@playwright/test';

export class FormLayoutsPage {

    readonly page: Page

    constructor (page: Page) {
        this.page = page
    }

    async submitUsingTheGridForm(email: string, password: string, optionText: string){

        const usingTheGridForm = this.page.locator('nb-card', {hasText: 'Using The Grid'})
        await usingTheGridForm.getByRole('textbox', {name: "Email"}).fill(email)
        await usingTheGridForm.getByRole('textbox', {name: "Password"}).fill(password)
        await usingTheGridForm.getByLabel(optionText).check({force:true})
        await usingTheGridForm.getByRole('button', {name: "Sign in"}).click()

    }

    async submitInlineForm(fullName: string, email: string, rememberMeCheckbox: boolean){

        const inlineForm = this.page.locator('nb-card', {hasText: 'Inline form'})
        await inlineForm.getByRole('textbox', {name: "Jane Doe"}).fill(fullName)
        await inlineForm.getByRole('textbox', {name: "Email"}).fill(email)
        if(rememberMeCheckbox){
            await inlineForm.getByRole('checkbox').check({force:true})
        }
        await inlineForm.getByRole('button', {name: "Submit"}).click()

    }

    async submitBasicForm(email: string, password: string, checkMeOutCheckbox: boolean){

        const basicForm = this.page.locator('nb-card', {hasText: 'Basic form'})
        await basicForm.getByRole('textbox', { name: 'Email address' }).fill(email)
        await basicForm.locator('#exampleInputPassword1').fill(password)
        if(checkMeOutCheckbox){
            await basicForm.getByText('Check me out').check({force:true})
        }
        await basicForm.getByRole('button', { name: 'Submit' }).click()

    }

    async submitTheFormWithoutLabels(email: string, password: string, checkMeOutCheckbox: boolean){

        const submitTheFormWithoutLabels = this.page.locator('nb-card', {hasText: 'Form without labels'})
        await submitTheFormWithoutLabels.getByRole('textbox', { name: 'Recipients' }).fill(email)
        await submitTheFormWithoutLabels.getByPlaceholder('Subject').fill(email)
        await submitTheFormWithoutLabels.getByPlaceholder('Message').fill(password)    
        await submitTheFormWithoutLabels.getByRole('button', { name: 'Send' }).click()

    }

    async submitBlockForm(firstName: string, lastName: string, email: string, website: string){

        const submitBlockForm = this.page.locator('nb-card', {hasText: 'Block form'})
        await submitBlockForm.getByPlaceholder('First Name').fill(firstName)
        await submitBlockForm.getByPlaceholder('Last Name').fill(lastName)
        await submitBlockForm.getByPlaceholder('Email').fill(email)
        await submitBlockForm.getByPlaceholder('Website').fill(website)   
        await submitBlockForm.getByRole('button', { name: 'Submit' }).click()

    }

    async submitHorizontalForm(email: string, password: string, rememberMeCheckbox: boolean,){

        const submitHorizontalForm = this.page.locator('nb-card', {hasText: 'Horizontal form'})
        await submitHorizontalForm.getByPlaceholder('Email').fill(email)
        await submitHorizontalForm.getByPlaceholder('Password').fill(password)
        if(rememberMeCheckbox){
            await submitHorizontalForm.getByText('Remember me').check({force:true})
        }
        await submitHorizontalForm.getByRole('button', { name: 'Sign in' }).click()

    }

    
}