import { Locator, Page } from '@playwright/test';

export class Datepicker {

    readonly page: Page;
    readonly commonDatePicker: Locator;
    readonly datePickerWithRange: Locator;
    readonly datePickerWithDisabledMinMaxValues: Locator;
    readonly formPicker: Locator;
    readonly rangePicker: Locator;
    readonly minMaxPicker: Locator;
    readonly formPickerCalendar: Locator;
    readonly rangePickerCalendar: Locator;
    readonly minMaxPickerCalendar: Locator;
    readonly cardHeaders: Locator;
    readonly openCalendars: Locator;

    constructor (page: Page) {
        this.page = page
        this.commonDatePicker = page.locator('nb-card', { hasText: 'Common Datepicker'})
        this.datePickerWithRange = page.locator('nb-card', { hasText: 'Datepicker With Range'})
        this.datePickerWithDisabledMinMaxValues = page.locator('nb-card', {hasText: 'Datepicker With Disabled Min Max Values'})
        this.formPicker = page.getByPlaceholder('Form Picker')
        this.rangePicker = page.getByPlaceholder('Range Picker')
        this.minMaxPicker = page.getByPlaceholder('Min Max Picker')
        this.formPickerCalendar = page.locator('nb-overlay-container nb-calendar')
        this.rangePickerCalendar = page.locator('nb-overlay-container nb-calendar-range')
        this.minMaxPickerCalendar = page.locator('nb-overlay-container nb-calendar')
        this.cardHeaders = page.locator('nb-card-header')
        this.openCalendars = page.locator('nb-overlay-container nb-calendar, nb-overlay-container nb-calendar-range')
    }

    async open(): Promise<void> {
        await this.page.goto('https://playground.bondaracademy.com/pages/forms/datepicker');
    }

    // The single and range calendars use different cell tags; every helper below
    // works on either by matching both.
    dayCells(calendar: Locator): Locator {
        return calendar.locator('nb-calendar-day-cell, nb-calendar-range-day-cell')
    }

    inMonthDayCells(calendar: Locator): Locator {
        return calendar.locator('nb-calendar-day-cell:not(.bounding-month), nb-calendar-range-day-cell:not(.bounding-month)')
    }

    dayCell(calendar: Locator, day: number): Locator {
        return this.inMonthDayCells(calendar).filter({hasText: new RegExp(`^\\s*${day}\\s*$`)})
    }

    todayCell(calendar: Locator): Locator {
        return calendar.locator('nb-calendar-day-cell.today, nb-calendar-range-day-cell.today')
    }

    selectedCells(calendar: Locator): Locator {
        return calendar.locator('nb-calendar-day-cell.selected, nb-calendar-range-day-cell.selected')
    }

    enabledInMonthDayCells(calendar: Locator): Locator {
        return calendar.locator('nb-calendar-day-cell:not(.bounding-month):not(.disabled)')
    }

    disabledInMonthDayCells(calendar: Locator): Locator {
        return calendar.locator('nb-calendar-day-cell.disabled:not(.bounding-month)')
    }

    monthHeader(calendar: Locator): Locator {
        return calendar.locator('nb-calendar-view-mode')
    }

    previousMonthButton(calendar: Locator): Locator {
        return calendar.locator('.prev-month')
    }

    nextMonthButton(calendar: Locator): Locator {
        return calendar.locator('.next-month')
    }

    async selectDay(calendar: Locator, day: number): Promise<void> {
        await this.dayCell(calendar, day).click()
    }

    // Clicking the card's own header is a safe "outside the calendar" click:
    // it is inert and never sits under the popup.
    async clickOutside(card: Locator): Promise<void> {
        await card.locator('nb-card-header').click()
    }

    async openYearView(calendar: Locator): Promise<void> {
        await this.monthHeader(calendar).locator('button').click()
    }

    async selectYear(calendar: Locator, year: number): Promise<void> {
        await calendar.getByText(String(year), {exact: true}).click()
    }

    async selectMonth(calendar: Locator, shortMonthName: string): Promise<void> {
        await calendar.getByText(shortMonthName, {exact: true}).click()
    }
}
