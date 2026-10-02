import { test } from '@playwright/test';
import { NavigationPage } from '../UI/pages/navigation-page';
import { FormLayoutsPage } from '../UI/pages/form-layouts-page';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

});

test('Verify navigate to form layouts page', async ({ page }) => {

    const navigateTo = new NavigationPage(page)    
    await navigateTo.formLayoutsPage()

})

test('Submit Using the Grid form', async ({ page }) => {
    
    const navigateTo = new NavigationPage(page)
    const formLayoutsPage = new FormLayoutsPage(page)
    await navigateTo.formLayoutsPage()
    await formLayoutsPage.submitUsingTheGridForm('test1@.com', 'welcome', 'Option 1')
    await formLayoutsPage.submitInlineForm('Test QA', 'welcome1@test.com', true)

})

test('Submit the Inline form', async ({ page }) => {
    
    const navigateTo = new NavigationPage(page)
    const formLayoutsPage = new FormLayoutsPage(page)
    await navigateTo.formLayoutsPage()
    await formLayoutsPage.submitInlineForm('Test QA', 'welcome1@test.com', true)

})

test('Submit the Basic form', async ({ page }) => {
    
    const navigateTo = new NavigationPage(page)
    const formLayoutsPage = new FormLayoutsPage(page)
    await navigateTo.formLayoutsPage()
    await formLayoutsPage.submitBasicForm('welcome1@test.com', 'Test1 QA', true)

})

test('Submit the Form without labels', async ({ page }) => {
    
    const navigateTo = new NavigationPage(page)
    const formLayoutsPage = new FormLayoutsPage(page)
    await navigateTo.formLayoutsPage()
    await formLayoutsPage.submitTheFormWithoutLabels('Test QA', 'test', true)

})

test('Submit the Block form', async ({ page }) => {
    
    const navigateTo = new NavigationPage(page)
    const formLayoutsPage = new FormLayoutsPage(page)
    await navigateTo.formLayoutsPage()
    await formLayoutsPage.submitBlockForm('Test', 'QA', 'test@test.com', 'www.google.com')

})

test('Submit the Horizontal form', async ({ page }) => {
    
    const navigateTo = new NavigationPage(page)
    const formLayoutsPage = new FormLayoutsPage(page)
    await navigateTo.formLayoutsPage()
    await formLayoutsPage.submitHorizontalForm('test1@test.com', 'welcome', true)

})
