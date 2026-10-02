import {Page} from '@playwright/test';
import { SidebarMenu } from '../components/sidebar-menu';

export class NavigationPage {

    readonly page: Page
    readonly sidebarMenu: SidebarMenu

    constructor (page: Page) {
        this.page = page
        this.sidebarMenu = new SidebarMenu(page)
    }

    async formLayoutsPage (){
        await this.sidebarMenu.openFormsPage()
        await this.page.getByText('Form Layouts').click()
    }

    async datePickerPage(){
        await this.sidebarMenu.openFormsPage()
        await this.page.getByText('Datepicker').click()
    }

    async toasterPage(){
        await this.sidebarMenu.openModalAndOverlays()
        await this.page.getByText('Toastr').click()
    }

    async tooltipPage(){
        await this.sidebarMenu.openModalAndOverlays()
        await this.page.getByText('Tooltip').click()
    }

    async dialogPage(){
        await this.sidebarMenu.openModalAndOverlays()
        await this.page.getByText('Dialog').click()
    }

    async smartTablePage(){
        await this.sidebarMenu.openTablesAndData()
        await this.page.getByText('Smart Table').click()
    }
}