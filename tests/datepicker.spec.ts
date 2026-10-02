import { expect, test, Locator } from '@playwright/test';
import { Datepicker } from '../UI/pages/datepicker-page';

test.beforeEach(async ({ page }) => {
    await new Datepicker(page).open();
});

// --- Date helpers: every "today" expectation is computed at runtime ---

const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})

const formatMonthYear = (monthOffset = 0) => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
        .toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
}

const currentMonthDate = (day: number) => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), day)
}

// Year page header, e.g. "2016 - 2027". Regexes are matched against the raw
// text (padded with spaces), unlike string expectations, hence \s*.
const YEAR_PAGE_HEADER = /^\s*\d{4} - \d{4}\s*$/

// Min/Max window observed live: today-5 ... today+5 (plan Section 6.4, Q1).
const enabledDaysOfCurrentMonth = () => {
    const now = new Date()
    const days: string[] = []
    for (let offset = -5; offset <= 5; offset++) {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset)
        if (date.getMonth() === now.getMonth()) {
            days.push(String(date.getDate()))
        }
    }
    return days
}

const pickers = [
    {name: 'Common', placeholder: 'Form Picker', input: (d: Datepicker) => d.formPicker, calendar: (d: Datepicker) => d.formPickerCalendar, card: (d: Datepicker) => d.commonDatePicker},
    {name: 'Range', placeholder: 'Range Picker', input: (d: Datepicker) => d.rangePicker, calendar: (d: Datepicker) => d.rangePickerCalendar, card: (d: Datepicker) => d.datePickerWithRange},
    {name: 'Min Max', placeholder: 'Min Max Picker', input: (d: Datepicker) => d.minMaxPicker, calendar: (d: Datepicker) => d.minMaxPickerCalendar, card: (d: Datepicker) => d.datePickerWithDisabledMinMaxValues},
]

// --- 6.1 Page and initial state (docs/test-plans/datepicker-test-plan.md) ---

test('DPK-P01: datepicker page loads with no calendar open', {tag: ['@smoke', '@positive']}, async ({ page }) => {
    const datepicker = new Datepicker(page)

    await expect(page).toHaveURL(/\/pages\/forms\/datepicker$/)
    await expect(datepicker.commonDatePicker).toBeVisible()
    await expect(datepicker.datePickerWithRange).toBeVisible()
    await expect(datepicker.datePickerWithDisabledMinMaxValues).toBeVisible()
    await expect(datepicker.openCalendars).toHaveCount(0)
})

test('DPK-P02: Common, With Range and Disabled Min Max cards are presented', {tag: '@positive'}, async ({ page }) => {
    const datepicker = new Datepicker(page)

    await expect(datepicker.cardHeaders).toHaveText(['Common Datepicker', 'Datepicker With Range', 'Datepicker With Disabled Min Max Values'])
    for (const picker of pickers) {
        await expect(picker.card(datepicker).locator('input')).toHaveCount(1)
    }
})

test('DPK-P03: each input shows its placeholder and an empty value before any click', {tag: '@positive'}, async ({ page }) => {
    const datepicker = new Datepicker(page)

    for (const picker of pickers) {
        await expect(picker.input(datepicker)).toHaveAttribute('placeholder', picker.placeholder)
        await expect(picker.input(datepicker)).toHaveValue('')
    }
})

// --- 6.2 Open / close behavior ---

for (const picker of pickers) {
    test(`DPK-P04: clicking the ${picker.name} input opens its calendar`, {tag: ['@smoke', '@positive']}, async ({ page }) => {
        const datepicker = new Datepicker(page)
        const calendar = picker.calendar(datepicker)

        await picker.input(datepicker).click()

        await expect(calendar).toBeVisible()
        await expect(datepicker.openCalendars).toHaveCount(1)
        await expect(datepicker.monthHeader(calendar)).toHaveText(formatMonthYear())
        for (const weekday of ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']) {
            await expect(calendar.getByText(weekday, {exact: true})).toBeVisible()
        }
    })

    test(`DPK-P05: clicking outside closes the ${picker.name} calendar and keeps the input empty`, {tag: '@positive'}, async ({ page }) => {
        const datepicker = new Datepicker(page)

        await picker.input(datepicker).click()
        await expect(picker.calendar(datepicker)).toBeVisible()

        await datepicker.clickOutside(picker.card(datepicker))

        await expect(datepicker.openCalendars).toHaveCount(0)
        await expect(picker.input(datepicker)).toHaveValue('')
    })

    test(`DPK-P06: ${picker.name} calendar highlights today and nothing else as selected`, {tag: ['@smoke', '@positive']}, async ({ page }) => {
        const datepicker = new Datepicker(page)
        const calendar = picker.calendar(datepicker)

        await picker.input(datepicker).click()

        await expect(datepicker.monthHeader(calendar)).toHaveText(formatMonthYear())
        await expect(datepicker.todayCell(calendar)).toHaveCount(1)
        await expect(datepicker.todayCell(calendar)).toHaveText(String(new Date().getDate()))
        await expect(datepicker.selectedCells(calendar)).toHaveCount(0)
        await expect(picker.input(datepicker)).toHaveValue('')
    })
}

test('DPK-P07: clicking the today cell in the Common calendar fills today\'s date and closes it', {tag: '@positive'}, async ({ page }) => {
    const datepicker = new Datepicker(page)

    await datepicker.formPicker.click()
    await datepicker.todayCell(datepicker.formPickerCalendar).click()

    await expect(datepicker.formPicker).toHaveValue(formatDate(new Date()))
    await expect(datepicker.openCalendars).toHaveCount(0)
})

// --- 6.3 Selection: Common and Range ---

test('DPK-P08: selecting a random day in the Common calendar fills that exact date and closes it', {tag: ['@smoke', '@positive']}, async ({ page }) => {
    const datepicker = new Datepicker(page)
    const day = Math.floor(Math.random() * 28) + 1
    test.info().annotations.push({type: 'random day', description: String(day)})

    await datepicker.formPicker.click()
    await datepicker.selectDay(datepicker.formPickerCalendar, day)

    await expect(datepicker.formPicker).toHaveValue(formatDate(currentMonthDate(day)))
    await expect(datepicker.openCalendars).toHaveCount(0)
})

test('DPK-P09: reopening the Common calendar shows the picked day as the only selected cell', {tag: '@positive'}, async ({ page }) => {
    const datepicker = new Datepicker(page)
    const calendar = datepicker.formPickerCalendar

    await datepicker.formPicker.click()
    await datepicker.selectDay(calendar, 15)
    await expect(datepicker.openCalendars).toHaveCount(0)
    await datepicker.formPicker.click()

    await expect(datepicker.monthHeader(calendar)).toHaveText(formatMonthYear())
    await expect(datepicker.selectedCells(calendar)).toHaveCount(1)
    await expect(datepicker.selectedCells(calendar)).toHaveText('15')
})

test('DPK-P10: Range calendar stays open after the start day and closes after the end day', {tag: ['@smoke', '@positive']}, async ({ page }) => {
    const datepicker = new Datepicker(page)
    const calendar = datepicker.rangePickerCalendar
    const start = formatDate(currentMonthDate(10))
    const end = formatDate(currentMonthDate(20))

    await datepicker.rangePicker.click()
    await datepicker.selectDay(calendar, 10)

    await expect(datepicker.rangePicker).toHaveValue(start)
    await expect(calendar).toBeVisible()

    await datepicker.selectDay(calendar, 20)

    await expect(datepicker.rangePicker).toHaveValue(`${start} - ${end}`)
    await expect(datepicker.openCalendars).toHaveCount(0)
})

test('DPK-P11: reopening the Range calendar highlights the picked range', {tag: '@positive'}, async ({ page }) => {
    const datepicker = new Datepicker(page)
    const calendar = datepicker.rangePickerCalendar

    await datepicker.rangePicker.click()
    await datepicker.selectDay(calendar, 10)
    await datepicker.selectDay(calendar, 20)
    await expect(datepicker.openCalendars).toHaveCount(0)
    await datepicker.rangePicker.click()

    await expect(datepicker.dayCell(calendar, 10)).toHaveClass(/\bstart\b/)
    for (let day = 10; day <= 20; day++) {
        await expect(datepicker.dayCell(calendar, day)).toHaveClass(/\bselected\b/)
    }
    await expect(datepicker.dayCell(calendar, 9)).not.toHaveClass(/\bselected\b/)
    await expect(datepicker.dayCell(calendar, 21)).not.toHaveClass(/\bselected\b/)
})

test('DPK-P12: month arrows move the Common calendar forward and back', {tag: '@positive'}, async ({ page }) => {
    const datepicker = new Datepicker(page)
    const calendar = datepicker.formPickerCalendar

    await datepicker.formPicker.click()
    await expect(datepicker.monthHeader(calendar)).toHaveText(formatMonthYear())

    await datepicker.nextMonthButton(calendar).click()
    await expect(datepicker.monthHeader(calendar)).toHaveText(formatMonthYear(1))

    await datepicker.previousMonthButton(calendar).click()
    await datepicker.previousMonthButton(calendar).click()
    await expect(datepicker.monthHeader(calendar)).toHaveText(formatMonthYear(-1))
})

test('DPK-P13: Common year > month > day flow fills the exact picked date', {tag: '@positive'}, async ({ page }) => {
    const datepicker = new Datepicker(page)
    const calendar = datepicker.formPickerCalendar
    const year = new Date().getFullYear() - 2

    await datepicker.formPicker.click()
    await datepicker.openYearView(calendar)
    await expect(datepicker.monthHeader(calendar)).toHaveText(YEAR_PAGE_HEADER)

    await datepicker.selectYear(calendar, year)
    await expect(datepicker.monthHeader(calendar)).toHaveText(String(year))
    await expect(datepicker.formPicker).toHaveValue('')

    await datepicker.selectMonth(calendar, 'Mar')
    await expect(datepicker.monthHeader(calendar)).toHaveText(`March ${year}`)
    await expect(datepicker.formPicker).toHaveValue('')

    await datepicker.selectDay(calendar, 7)

    await expect(datepicker.formPicker).toHaveValue(`Mar 7, ${year}`)
    await expect(datepicker.openCalendars).toHaveCount(0)

    await datepicker.formPicker.click()
    await expect(datepicker.monthHeader(calendar)).toHaveText(`March ${year}`)
    await expect(datepicker.selectedCells(calendar)).toHaveText('7')
})

test('DPK-P16: year page arrow pages back 12 years and month-view arrow steps one year', {tag: '@positive'}, async ({ page }) => {
    const datepicker = new Datepicker(page)
    const calendar = datepicker.formPickerCalendar
    const header = datepicker.monthHeader(calendar)

    await datepicker.formPicker.click()
    await datepicker.openYearView(calendar)
    await expect(header).toHaveText(YEAR_PAGE_HEADER)
    const [startYear] = (await header.innerText()).match(/\d{4}/g)!.map(Number)

    await datepicker.previousMonthButton(calendar).click()
    await expect(header).toHaveText(`${startYear - 12} - ${startYear - 1}`)

    await datepicker.selectYear(calendar, startYear - 12)
    await expect(header).toHaveText(String(startYear - 12))

    await datepicker.nextMonthButton(calendar).click()
    await expect(header).toHaveText(String(startYear - 11))
})

test('DPK-P17: Range year > month > day flow fills the exact picked range', {tag: '@positive'}, async ({ page }) => {
    const datepicker = new Datepicker(page)
    const calendar = datepicker.rangePickerCalendar
    const year = new Date().getFullYear() - 1

    await datepicker.rangePicker.click()
    await datepicker.openYearView(calendar)
    await expect(datepicker.monthHeader(calendar)).toHaveText(YEAR_PAGE_HEADER)

    await datepicker.selectYear(calendar, year)
    await datepicker.selectMonth(calendar, 'Feb')
    await expect(datepicker.monthHeader(calendar)).toHaveText(`February ${year}`)

    await datepicker.selectDay(calendar, 3)
    await datepicker.selectDay(calendar, 9)

    await expect(datepicker.rangePicker).toHaveValue(`Feb 3, ${year} - Feb 9, ${year}`)
    await expect(datepicker.openCalendars).toHaveCount(0)
})

// --- 6.4 Min/Max restrictions (positive) ---

test('DPK-P14: Min Max calendar enables only the days from today-5 to today+5', {tag: ['@smoke', '@positive']}, async ({ page }) => {
    const datepicker = new Datepicker(page)
    const calendar = datepicker.minMaxPickerCalendar

    await datepicker.minMaxPicker.click()

    await expect(datepicker.monthHeader(calendar)).toHaveText(formatMonthYear())
    await expect(datepicker.enabledInMonthDayCells(calendar)).toHaveText(enabledDaysOfCurrentMonth())
})

test('DPK-P15: selecting the first enabled day in the Min Max calendar fills that date', {tag: ['@smoke', '@positive']}, async ({ page }) => {
    const datepicker = new Datepicker(page)
    const calendar = datepicker.minMaxPickerCalendar
    const firstEnabledDay = Number(enabledDaysOfCurrentMonth()[0])

    await datepicker.minMaxPicker.click()
    await datepicker.selectDay(calendar, firstEnabledDay)

    await expect(datepicker.minMaxPicker).toHaveValue(formatDate(currentMonthDate(firstEnabledDay)))
    await expect(datepicker.openCalendars).toHaveCount(0)
})

// --- Negative cases ---

test('DPK-N01: clicking a disabled day in the Min Max calendar selects nothing', {tag: '@negative'}, async ({ page }) => {
    const datepicker = new Datepicker(page)
    const calendar = datepicker.minMaxPickerCalendar

    await datepicker.minMaxPicker.click()
    await datepicker.disabledInMonthDayCells(calendar).first().click()

    await expect(datepicker.minMaxPicker).toHaveValue('')
    await expect(calendar).toBeVisible()
})

// Open question Q1/N02: navigation is not blocked outside the window - this
// documents the current behavior.
test('DPK-N02: Min Max month arrows stay usable and months outside the window have no enabled day', {tag: ['@negative', '@known-issue']}, async ({ page }) => {
    const datepicker = new Datepicker(page)
    const calendar = datepicker.minMaxPickerCalendar

    await datepicker.minMaxPicker.click()
    await datepicker.nextMonthButton(calendar).click()
    await datepicker.nextMonthButton(calendar).click()

    await expect(datepicker.monthHeader(calendar)).toHaveText(formatMonthYear(2))
    await expect(datepicker.nextMonthButton(calendar)).toBeEnabled()
    await expect(datepicker.previousMonthButton(calendar)).toBeEnabled()
    await expect(datepicker.enabledInMonthDayCells(calendar)).toHaveCount(0)
})

// Open question Q5: what the input holds afterwards (empty vs. the lone start
// day) varied with how the outside click was made during exploration, so only
// the stable part is asserted: the calendar closes and no full range is formed.
test('DPK-N03: Range with only a start day picked never forms a full range on outside click', {tag: '@negative'}, async ({ page }) => {
    const datepicker = new Datepicker(page)

    await datepicker.rangePicker.click()
    await datepicker.selectDay(datepicker.rangePickerCalendar, 12)
    await expect(datepicker.rangePicker).toHaveValue(formatDate(currentMonthDate(12)))

    await datepicker.clickOutside(datepicker.datePickerWithRange)

    await expect(datepicker.openCalendars).toHaveCount(0)
    await expect(datepicker.rangePicker).not.toHaveValue(/ - /)
})

// The input briefly shows only the first-clicked day before settling, so a
// loose assertion can pass on that transient value in some browsers; assert
// the final sorted range and confirm it stays put.
test('DPK-N04: Range end picked before start is normalised to an ascending range', {tag: '@negative'}, async ({ page }) => {
    const datepicker = new Datepicker(page)
    const calendar = datepicker.rangePickerCalendar
    const expected = `${formatDate(currentMonthDate(10))} - ${formatDate(currentMonthDate(20))}`

    await datepicker.rangePicker.click()
    await datepicker.selectDay(calendar, 20)
    await datepicker.selectDay(calendar, 10)

    await expect(datepicker.rangePicker).toHaveValue(expected)
    await expect(datepicker.openCalendars).toHaveCount(0)
    await expect(datepicker.rangePicker).toHaveValue(expected)
})

// Findings DF01 / DF03: typed input is accepted without validation. These
// document the current behavior so a real fix is caught as a change.
async function typeAndLeave(input: Locator, card: Locator, text: string) {
    await input.fill(text)
    await input.press('Enter')
    await card.locator('nb-card-header').click()
}

test('DPK-N05: a valid date typed into the Common input is kept', {tag: '@negative'}, async ({ page }) => {
    const datepicker = new Datepicker(page)

    await typeAndLeave(datepicker.formPicker, datepicker.commonDatePicker, 'Jan 5, 2024')

    await expect(datepicker.formPicker).toHaveValue('Jan 5, 2024')
})

test('DPK-N06: invalid text typed into the Common input is kept with no error styling', {tag: ['@negative', '@known-issue']}, async ({ page }) => {
    const datepicker = new Datepicker(page)

    await typeAndLeave(datepicker.formPicker, datepicker.commonDatePicker, 'garbage')

    await expect(datepicker.formPicker).toHaveValue('garbage')
    await expect(datepicker.formPicker).toHaveClass(/status-basic/)
    await expect(datepicker.formPicker).not.toHaveClass(/status-danger/)
})

test('DPK-N07: an out-of-range date typed into the Min Max input bypasses the restriction', {tag: ['@negative', '@known-issue']}, async ({ page }) => {
    const datepicker = new Datepicker(page)

    await typeAndLeave(datepicker.minMaxPicker, datepicker.datePickerWithDisabledMinMaxValues, 'Jan 1, 2000')

    await expect(datepicker.minMaxPicker).toHaveValue('Jan 1, 2000')
    await expect(datepicker.minMaxPicker).not.toHaveClass(/status-danger/)
})
