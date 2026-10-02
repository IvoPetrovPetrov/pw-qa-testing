import { Locator, Page } from '@playwright/test';
import { MainHeader } from '../components/main-header';

export type DeviceName = 'Light' | 'Roller Shades' | 'Wireless Audio' | 'Coffee Maker';
export type RoomName = 'Kitchen' | 'Bedroom' | 'Hallway' | 'Living Room';
export type ConsumptionPeriod = 'week' | 'month' | 'year';
export type CameraView = 'single' | 'grid';
export type Theme = 'Light' | 'Dark' | 'Cosmic' | 'Corporate';

export class IotDashboardPage {
    readonly page: Page;
    readonly header: MainHeader;
    readonly selectedRoomIndicator: Locator;
    readonly consumptionPeriodButton: Locator;
    readonly kittenFooter: Locator;
    readonly kittenGlobeLink: Locator;
    readonly kittenAppleLink: Locator;
    readonly kittenAndroidLink: Locator;
    readonly kittenGitLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new MainHeader(page);

        const roomManagementCard = page.locator('nb-card.size-giant').filter({hasText: 'Room Management'})
        this.selectedRoomIndicator = roomManagementCard.locator('g.selected-room')

        const consumptionCard = page.locator('nb-card.chart-card').filter({hasText: 'Consumed'})
        this.consumptionPeriodButton = consumptionCard.locator('nb-select button.select-button')

        const kittenCard = page.locator('ngx-kitten')
        this.kittenFooter = kittenCard.locator('nb-card-footer')
        this.kittenGlobeLink = kittenCard.locator('a[href^="https://akveo.github.io/react-native-ui-kitten"]')
        this.kittenAppleLink = kittenCard.locator('a[href^="https://itunes.apple.com/"]')
        this.kittenAndroidLink = kittenCard.locator('a[href^="https://play.google.com/store/apps/"]')
        this.kittenGitLink = kittenCard.locator('a[href^="https://github.com/akveo/react-native-ui-kitten"]')
    }

    async open(): Promise<void> {
        await this.page.goto('https://playground.bondaracademy.com/pages/iot-dashboard');
    }

    deviceCard(deviceName: DeviceName): Locator {
        return this.page.locator('nb-card').filter({
            has: this.page.locator('.details .title').filter({hasText: deviceName})
        })
    }

    deviceState(deviceName: DeviceName): Locator {
        return this.deviceCard(deviceName).locator('.status')
    }

    async toggleDevice(deviceName: DeviceName): Promise<void> {
        await this.deviceCard(deviceName).click();
    }

    async switchTheme(theme: Theme): Promise<void> {
        await this.header.switchTheme(theme)
    }

    async selectTemperature(): Promise<void> {
        await this.page.getByRole('link', {name: 'Temperature', exact: true}).click()
    }

    async selectHumidity(): Promise<void> {
        await this.page.getByRole('link', {name: 'Humidity', exact: true}).click()
    }

    async selectConsumptionPeriod(period: ConsumptionPeriod): Promise<void> {
        await this.consumptionPeriodButton.click()
        await this.page.locator('nb-option').filter({hasText: new RegExp(`^\\s*${period}\\s*$`, 'i')}).click()
    }

    private roomGroup(roomName: RoomName): Locator {
        const roomManagementCard = this.page.locator('nb-card.size-giant').filter({hasText: 'Room Management'})
        return roomManagementCard.locator('g').filter({has: this.page.getByText(roomName, {exact: true})})
    }

    async selectRoom(roomName: RoomName): Promise<void> {
        await this.roomGroup(roomName).locator('path.room-bg').click()
    }

    async showContacts(): Promise<void> {
        await this.page.getByRole('link', {name: 'Contacts', exact: true}).click()
    }

    async showRecentContacts(): Promise<void> {
        await this.page.getByRole('link', {name: 'Recent', exact: true}).click()
    }

    camera(cameraNumber: 1 | 2 | 3 | 4): Locator {
        const securityCamerasCard = this.page.locator('nb-card.size-giant').filter({hasText: 'Security Cameras'})
        return securityCamerasCard.locator('.camera').filter({hasText: `Camera #${cameraNumber}`})
    }

    async selectCamera(cameraNumber: 1 | 2 | 3 | 4): Promise<void> {
        await this.camera(cameraNumber).click()
    }

    cameraAction(actionName: 'Pause' | 'Logs' | 'Search' | 'Setup'): Locator {
        const securityCamerasCard = this.page.locator('nb-card.size-giant').filter({hasText: 'Security Cameras'})
        return securityCamerasCard.locator('nb-action').filter({hasText: actionName})
    }

    cameraActionIcon(actionName: 'Pause' | 'Logs' | 'Search' | 'Setup'): Locator {
        return this.cameraAction(actionName).locator('nb-icon')
    }

    async pauseCamera(): Promise<void> {
        await this.cameraAction('Pause').click()
    }

    async openCameraLogs(): Promise<void> {
        await this.cameraAction('Logs').click()
    }

    async openCameraSearch(): Promise<void> {
        await this.cameraAction('Search').click()
    }

    async openCameraSetup(): Promise<void> {
        await this.cameraAction('Setup').click()
    }

    cameraViewButton(view: CameraView): Locator {
        const securityCamerasCard = this.page.locator('nb-card.size-giant').filter({hasText: 'Security Cameras'})
        return view === 'single'
            ? securityCamerasCard.locator('button.single-view-button')
            : securityCamerasCard.locator('button.grid-view-button')
    }

    async selectCameraView(view: CameraView): Promise<void> {
        await this.cameraViewButton(view).click()
    }
}
