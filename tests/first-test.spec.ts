import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByText('Forms').click();
  await page.getByText('Form Layouts').click();
});

test('Locator Syntax rules', async ({ page }) => {
    //find by tag name
    page.locator('input')

    //find by id - put # before the id value
    page.locator('#inputEmail1')

    //find by class name - put . before the class value
    page.locator('.input-full-width')

    //find by attribute name
    page.locator('[placeholder="Email"]')

    //find by full class value - put . before each class value
    page.locator('[class="input-full-width size-medium shape-rectangle"]')

    //find by several selectors
    page.locator('input[placeholder="Email"].shape-rectangle')

    //find by Xpath - put // before the path // NOT recommended by playwright team
    page.locator('//input[@placeholder="Email"]')

    //find by partial text - put text= before the text value

    page.locator(':text("Using")')

    //find by actual text - put text= before the text value and use "" around the text value
    page.locator('text-is("Using the Grid")')
});

test('User visible locators', async ({page}) =>  {
  await page.getByRole('button', {name: 'Sign in'}).first().click()
  await page.getByRole('textbox', {name: 'Email'}).first().fill('test@test.com')

  await page.getByLabel('Email').first().fill('TestQA')

  await page.getByPlaceholder('Jane Doe').first().fill('Learning')

  await page.getByText('Submit').first().click()

  await page.getByTestId('inputEmail1').fill('MyTest')

  await page.getByTitle('IoT Dashboard').click()
});

test('Find child elements', async ({page}) =>  {
  await page.locator('nb-card nb-radio-group :text-is("Option 1")').click()

  await page.locator('nb-card').getByRole('button', {name: 'Sign in'}).first().click()
});

//Parent elements
test('Find parent elements', async ({page}) =>  {
  await page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('button').click()
  await page.locator('nb-card', {has: page.locator ('#inputEmail1')}).getByRole('button').click()
});

//Reusing locators
test('Reusing locators', async ({page}) =>  {
  
  const basicFormSection = page.locator('nb-card', {hasText: 'Basic form'})

  await basicFormSection.getByLabel('Email').fill('TestQA1')
  await basicFormSection.getByLabel('Password').fill('TestQA2')
  await basicFormSection.locator('nb-checkbox').click()
  await basicFormSection.getByRole('button').click()

});

test('Assertion', async ({ page }) => {
  const value = 5
  expect(value).toEqual(5)
});

test('testAuto', async ({ page }) => {
  await page.goto('/');
  await page.goto('/pages/iot-dashboard');
  await page.getByRole('link', { name: 'Forms' }).click();
  await page.getByRole('link', { name: 'Form Layouts' }).click();
  await page.getByRole('textbox', { name: 'Jane Doe' }).click();
  await page.getByRole('textbox', { name: 'Jane Doe' }).fill('test');
  await page.locator('form').filter({ hasText: 'Remember meSubmit' }).getByPlaceholder('Email').fill('test1');
  await page.locator('.custom-checkbox').first().click();
  await page.locator('form').filter({ hasText: 'Remember meSubmit' }).getByLabel('Remember me').check();
  await page.locator('form').filter({ hasText: 'Remember meSubmit' }).getByRole('button').click();
});