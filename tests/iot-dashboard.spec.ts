import { expect, test } from '@playwright/test';
import {
    ConsumptionPeriod,
    DeviceName,
    IotDashboardPage,
    RoomName
} from '../UI/pages/iot-dashboard-page';

test.beforeEach(async ({ page }) => {
    await new IotDashboardPage(page).open();
});

    test('loads the dashboard and its primary sections', {tag: ['@smoke', '@positive']}, async ({ page }) => {
        const iotDashboard = new IotDashboardPage(page);
        await expect(page).toHaveURL(/\/pages\/iot-dashboard$/)
        await expect(page.getByRole('link', {name: 'IoT Dashboard', exact: true})).toBeVisible()
        await expect(iotDashboard.deviceCard('Light')).toBeVisible()
        await expect(iotDashboard.deviceCard('Roller Shades')).toBeVisible()
        await expect(iotDashboard.deviceCard('Wireless Audio')).toBeVisible()
        await expect(iotDashboard.deviceCard('Coffee Maker')).toBeVisible()
        await expect(page.getByRole('link', {name: 'Temperature', exact: true})).toBeVisible()
        await expect(page.getByRole('link', {name: 'Humidity', exact: true})).toBeVisible()
        await expect(page.locator('nb-card.chart-card').filter({hasText: 'Consumed'})).toBeVisible()
        await expect(page.locator('nb-card').filter({hasText: 'Solar Energy Consumption'})).toBeVisible()
        await expect(page.locator('nb-card.size-tiny').filter({hasText: 'Traffic Consumption'})).toBeVisible()
        await expect(page.locator('nb-card.size-giant').filter({hasText: 'Security Cameras'})).toBeVisible()
    })

    test('toggles each device and restores its original state', {tag: '@positive'}, async ({ page }) => {
        const iotDashboard = new IotDashboardPage(page);
        const devices: DeviceName[] = ['Light', 'Roller Shades', 'Wireless Audio', 'Coffee Maker']

        for (const device of devices) {
            const deviceState = iotDashboard.deviceState(device)
            const initialState = await deviceState.innerText()

            await iotDashboard.toggleDevice(device)
            await expect(deviceState).not.toHaveText(initialState)

            await iotDashboard.toggleDevice(device)
            await expect(deviceState).toHaveText(initialState)
        }
    })

    test('switches the dashboard theme from Light to Dark', {tag: '@positive'}, async ({ page }) => {
        const iotDashboard = new IotDashboardPage(page);
        // Finding F01: switchTheme() previously only opened the header dropdown
        // and never selected an option, so the theme never actually changed.
        await expect(page.locator('body')).toHaveClass(/nb-theme-default/)

        await iotDashboard.switchTheme('Dark')

        await expect(iotDashboard.header.themeControlButton).toHaveText('Dark')
        await expect(page.locator('body')).toHaveClass(/nb-theme-dark/)
    })

    test('switches between temperature and humidity views', {tag: '@positive'}, async ({ page }) => {
        const iotDashboard = new IotDashboardPage(page);
        await iotDashboard.selectTemperature()
        await expect(page.getByRole('link', {name: 'Temperature', exact: true})).toBeVisible()

        await iotDashboard.selectHumidity()
        await expect(page.getByRole('link', {name: 'Humidity', exact: true})).toBeVisible()
    })

    test('switches the consumption period across week, month, and year', {tag: '@positive'}, async ({ page }) => {
        const iotDashboard = new IotDashboardPage(page);
        // Finding F14: this is an nb-select dropdown, not sibling buttons -
        // the collapsed control only ever shows the currently selected value.
        const periods: ConsumptionPeriod[] = ['week', 'month', 'year']

        for (const period of periods) {
            await iotDashboard.selectConsumptionPeriod(period)
            await expect(iotDashboard.consumptionPeriodButton).toHaveText(period)
        }
    })

    test('selects each room and moves the selected-room indicator', {tag: '@positive'}, async ({ page }) => {
        const iotDashboard = new IotDashboardPage(page);
        // Finding F15: the real selected state lives on <g class="selected-room">,
        // not on the <text> label - and only one room carries it at a time.
        const roomNames: RoomName[] = ['Kitchen', 'Bedroom', 'Hallway', 'Living Room']
        let previousRoomId: string | null = null

        for (const room of roomNames) {
            await iotDashboard.selectRoom(room)

            await expect(iotDashboard.selectedRoomIndicator).toHaveCount(1)
            const currentRoomId = await iotDashboard.selectedRoomIndicator.getAttribute('id')
            expect(currentRoomId).not.toBeNull()
            expect(currentRoomId).not.toBe(previousRoomId)
            previousRoomId = currentRoomId
        }
    })

    test('switches between contacts views', {tag: '@positive'}, async ({ page }) => {
        const iotDashboard = new IotDashboardPage(page);
        await iotDashboard.showContacts()
        await expect(page.getByRole('link', {name: 'Contacts', exact: true})).toBeVisible()

        await iotDashboard.showRecentContacts()
        await expect(page.getByRole('link', {name: 'Recent', exact: true})).toBeVisible()
    })

    test('selecting a camera switches the card into single-view mode', {tag: '@positive'}, async ({ page }) => {
        const iotDashboard = new IotDashboardPage(page);
        // Finding F16: clicking a camera does not add a "selected" class among
        // four visible tiles - it switches the whole card to single-view and
        // removes the other three cameras from the DOM entirely.
        const securityCamerasCard = page.locator('nb-card.size-giant').filter({hasText: 'Security Cameras'})

        for (const cameraNumber of [1, 2, 3, 4] as const) {
            await iotDashboard.selectCameraView('grid')
            await expect(securityCamerasCard.locator('.camera')).toHaveCount(4)

            await iotDashboard.selectCamera(cameraNumber)

            await expect(securityCamerasCard.locator('.camera')).toHaveCount(1)
            await expect(iotDashboard.camera(cameraNumber)).toBeVisible()
            await expect(iotDashboard.cameraViewButton('single')).toHaveClass(/appearance-filled/)
            await expect(iotDashboard.cameraViewButton('grid')).toHaveClass(/appearance-outline/)
        }
    })

    test('camera Pause action produces no observable state change', {tag: ['@negative', '@known-issue']}, async ({ page }) => {
        const iotDashboard = new IotDashboardPage(page);
        // Finding F17: confirmed inert - label and icon never change on click.
        // This documents the current (broken) behavior so a real fix downstream
        // will be caught as a change here, not silently ignored.
        const iconBefore = await iotDashboard.cameraActionIcon('Pause').getAttribute('icon')

        await iotDashboard.pauseCamera()

        await expect(iotDashboard.cameraAction('Pause')).toHaveText('Pause')
        await expect(iotDashboard.cameraActionIcon('Pause')).toHaveAttribute('icon', iconBefore ?? '')
    })

    test('camera Logs action produces no observable change', {tag: ['@negative', '@known-issue']}, async ({ page }) => {
        const iotDashboard = new IotDashboardPage(page);
        const elementCountBefore = await page.locator('*').count()

        await iotDashboard.openCameraLogs()

        await expect(page.locator('*')).toHaveCount(elementCountBefore)
    })

    test('camera Search action produces no observable change', {tag: ['@negative', '@known-issue']}, async ({ page }) => {
        const iotDashboard = new IotDashboardPage(page);
        // Finding F12: this icon is confirmed non-functional; the only real
        // search input on the page is the unrelated header global search.
        const elementCountBefore = await page.locator('*').count()

        await iotDashboard.openCameraSearch()

        await expect(page.locator('*')).toHaveCount(elementCountBefore)
    })

    test('camera Setup action produces no observable change', {tag: ['@negative', '@known-issue']}, async ({ page }) => {
        const iotDashboard = new IotDashboardPage(page);
        const elementCountBefore = await page.locator('*').count()

        await iotDashboard.openCameraSetup()

        await expect(page.locator('*')).toHaveCount(elementCountBefore)
    })

    test('keeps the dashboard usable when image assets fail', {tag: '@negative'}, async ({ page }) => {
        const iotDashboard = new IotDashboardPage(page);
        await page.route('**/*', async route => {
            if (route.request().resourceType() === 'image') {
                await route.abort()
                return
            }

            await route.continue()
        })
        await page.reload()

        await expect(iotDashboard.deviceCard('Light')).toBeVisible()
        await expect(iotDashboard.page.getByText('Security Cameras', {exact: false})).toBeVisible()
    })

    test('does not expose unsupported period or camera options', {tag: '@negative'}, async ({ page }) => {
        const iotDashboard = new IotDashboardPage(page);
        // Finding F14: "month" previously appeared unsupported only because the
        // period dropdown was closed - it is a real option alongside week/year.
        const securityCamerasCard = iotDashboard.page.locator('nb-card.size-giant').filter({hasText: 'Security Cameras'})

        await iotDashboard.consumptionPeriodButton.click()
        await expect(iotDashboard.page.locator('nb-option')).toHaveCount(3)
        await iotDashboard.page.keyboard.press('Escape')

        await expect(securityCamerasCard.locator('.camera').filter({hasText: 'Camera #5'})).toHaveCount(0)
    })

    test('Verify UI Kitten home navigation', {tag: '@positive'}, async ({ page, context }) => {
        const iotDashboard = new IotDashboardPage(page)

        await expect(iotDashboard.kittenFooter).toBeVisible()

        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            iotDashboard.kittenGlobeLink.click()
        ])
        await newTab.waitForLoadState()
        await expect(newTab).toHaveURL('https://akveo.github.io/react-native-ui-kitten/?utm_campaign=ui_kitten%20-%20home%20-%20ngx_admin%20code%20embed&utm_source=ngx_admin&utm_medium=embedded&utm_content=iot_dashboard_kitten_card')
    })

    test('Verify UI Kitten apple navigation', {tag: '@positive'}, async ({ page, context }) => {
        const iotDashboard = new IotDashboardPage(page)

        await expect(iotDashboard.kittenFooter).toBeVisible()

        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            iotDashboard.kittenAppleLink.click()
        ])
        await newTab.waitForLoadState()
        await expect(newTab).toHaveURL('https://apps.apple.com/us/app/kitten-tricks/id1246143230')
    })

    test('Verify UI Kitten android navigation', {tag: '@positive'}, async ({ page, context }) => {
        const iotDashboard = new IotDashboardPage(page)

        await expect(iotDashboard.kittenFooter).toBeVisible()

        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            iotDashboard.kittenAndroidLink.click()
        ])
        await newTab.waitForLoadState()
        await expect(newTab).toHaveURL('https://play.google.com/store/apps/details?id=com.akveo.kittenTricks')
    })

    test('Verify UI Kitten git navigation', {tag: '@positive'}, async ({ page, context }) => {
        const iotDashboard = new IotDashboardPage(page)

        await expect(iotDashboard.kittenFooter).toBeVisible()

        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            iotDashboard.kittenGitLink.click()
        ])
        await newTab.waitForLoadState()
        await expect(newTab).toHaveURL('https://github.com/akveo/react-native-ui-kitten')
    })
