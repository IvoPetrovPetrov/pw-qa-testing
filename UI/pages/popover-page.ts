import { Locator, Page } from '@playwright/test';

export class PopoverPage {

    readonly page: Page
    readonly popoverPositionCard: Locator
    readonly simplePopoverCard: Locator
    readonly templatePopoverCard: Locator
    readonly componentPopoverCard: Locator
    readonly eventDebouncingCard: Locator

    readonly leftButton: Locator
    readonly topButton: Locator
    readonly bottomButton: Locator
    readonly rightButton: Locator

    readonly onClickPopoverButton: Locator
    readonly onHoverPopoverButton: Locator
    readonly onHintPopoverButton: Locator

    readonly templateWithTabsButton: Locator
    readonly templateWithFormButton: Locator
    readonly templateWithCardButton: Locator

    readonly componentWithTabsButton: Locator
    readonly componentWithFormButton: Locator
    readonly componentWithCardButton: Locator

    readonly showHintButtons: Locator

    constructor(page: Page) {
        this.page = page

        this.popoverPositionCard = page.locator('nb-card').filter({
            has: page.locator('nb-card-header', { hasText: /^Popover Position$/ })
        })
        this.simplePopoverCard = page.locator('nb-card').filter({
            has: page.locator('nb-card-header', { hasText: /^Simple Popovers$/ })
        })
        this.templatePopoverCard = page.locator('nb-card').filter({
            has: page.locator('nb-card-header', { hasText: /^Template Popovers$/ })
        })
        this.componentPopoverCard = page.locator('nb-card').filter({
            has: page.locator('nb-card-header', { hasText: /^Component Popovers$/ })
        })
        this.eventDebouncingCard = page.locator('nb-card').filter({
            has: page.locator('nb-card-header', { hasText: /^Event Debouncing$/ })
        })

        this.leftButton = this.popoverPositionCard.getByRole('button', { name: 'Left' })
        this.topButton = this.popoverPositionCard.getByRole('button', { name: 'Top' })
        this.bottomButton = this.popoverPositionCard.getByRole('button', { name: 'Bottom' })
        this.rightButton = this.popoverPositionCard.getByRole('button', { name: 'Right' })

        this.onClickPopoverButton = this.simplePopoverCard.getByRole('button', { name: 'on click' })
        this.onHoverPopoverButton = this.simplePopoverCard.getByRole('button', { name: 'on hover' })
        this.onHintPopoverButton = this.simplePopoverCard.getByRole('button', { name: 'on hint' })

        this.templateWithTabsButton = this.templatePopoverCard.getByRole('button', { name: 'With tabs' })
        this.templateWithFormButton = this.templatePopoverCard.getByRole('button', { name: 'With form' })
        this.templateWithCardButton = this.templatePopoverCard.getByRole('button', { name: 'With card' })

        this.componentWithTabsButton = this.componentPopoverCard.getByRole('button', { name: 'With tabs' })
        this.componentWithFormButton = this.componentPopoverCard.getByRole('button', { name: 'With form' })
        this.componentWithCardButton = this.componentPopoverCard.getByRole('button', { name: 'With card' })

        this.showHintButtons = this.eventDebouncingCard.getByRole('button', { name: 'show hint' })
    }

    async openPopoverAtPosition(position: 'Left' | 'Top' | 'Bottom' | 'Right') {
        const targetMap = {
            Left: this.leftButton,
            Top: this.topButton,
            Bottom: this.bottomButton,
            Right: this.rightButton,
        }

        await targetMap[position].click()
    }

    async openSimplePopover(type: 'on click' | 'on hover' | 'on hint') {
        const targetMap = {
            'on click': this.onClickPopoverButton,
            'on hover': this.onHoverPopoverButton,
            'on hint': this.onHintPopoverButton,
        }

        await targetMap[type].click()
    }

    async openTemplatePopover(type: 'With tabs' | 'With form' | 'With card') {
        const targetMap = {
            'With tabs': this.templateWithTabsButton,
            'With form': this.templateWithFormButton,
            'With card': this.templateWithCardButton,
        }

        await targetMap[type].click()
    }

    async openComponentPopover(type: 'With tabs' | 'With form' | 'With card') {
        const targetMap = {
            'With tabs': this.componentWithTabsButton,
            'With form': this.componentWithFormButton,
            'With card': this.componentWithCardButton,
        }

        await targetMap[type].click()
    }

    async hoverShowHint(index = 0) {
        await this.showHintButtons.nth(index).hover()
    }
}
