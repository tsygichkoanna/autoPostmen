// Checking the time thet is --> Adding time and checking its availability --> Delete the time that was added and check its absence
describe('Sum result sheet', function () {

    const autoAdmin = "";

    it.only('Check time', function () {
        let sumTime = 0;
        cy.authorizationAdmin(autoAdmin)

        cy.get('td')
            .contains('Гусаревич Cніжана')
            .parent()
            .parent()
            .contains('ІЛ')
            .click()

        cy.get('.month-picker')
            .click()
            .get('[data-id = "0:2"]')
            .click()

        cy.get('td')
        .contains('Назагал')
            .parent()
            .find('td')
            .not(':last')
            .last()
            .each((el) => {
                sumTime += +el.text() || 0;
                cy.log('Total sum:' + sumTime);
            })
            .should(() => {
                expect(sumTime).to.equal(72)
            })

        cy.get('.main-sidebar')
            .contains('Результуючі листи')
            .click()

        cy.get('.month-picker')
            .click()
            .get('[data-id = "0:2"]')
            .click()

        cy.get(':nth-child(2) > .Select > .Select-control > .Select-arrow-zone')
            .click()
            .wait(2000)
            .get('#react-select-2--option-1')
            .click()

        cy.get(':nth-child(5) > .Select > .Select-control > .Select-arrow-zone')
            .click()
            .get('#react-select-5--option-0')
            .click()

        cy.get(':nth-child(34) > :nth-child(19)')
            .should(() => {
                expect(sumTime).to.equal(72)
            })
    })

    it('Add time', function () {
        let sumTime = 0;
        cy.authorizationAdmin(autoAdmin)

        cy.get('.main-sidebar')
            .contains('Cпівробітники')
            .click()

        cy.get('td')
            .contains('Гусаревич Cніжана')
            .parent()
            .parent()
            .contains('ІЛ')
            .click()

        cy.get('.month-picker')
            .click()
            .get('[data-id = "0:2"]')
            .click()

        cy.get(':nth-child(9) > :nth-child(18) > .track_time')
            .type('7')

        cy.get(':nth-child(8) > :nth-child(23) > .track_time')
            .type('4.5')

        cy.get(':nth-child(3) > :nth-child(17) > .track_time')
            .type('5')

        cy.get(':nth-child(2) > :nth-child(24)')
            .click()

        cy.get(':nth-child(19) > [style="width: 74px;"]')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .not(':last')
            .each((el) => {
                sumTime += +el.text() || 0;
                cy.log('Total sum:' + sumTime);
            })
            .should(() => {
                expect(sumTime).to.equal(88.5)
            })

        cy.get('.main-sidebar')
            .contains('Результуючі листи')
            .click()

        cy.get('.month-picker')
            .click()
            .get('[data-id = "0:2"]')
            .click()

        cy.get('#react-select-2--value-item')
            .click()
            .wait(2000)
            .get('#react-select-2--option-1')
            .click()

        cy.get('#react-select-5--value-item')
            .click()
            .get('#react-select-5--option-0')
            .click()

        cy.get(':nth-child(34) > :nth-child(19)')
            .should(() => {
                expect(sumTime).to.equal(88.5)
            })
    })

    it('Clear time', function () {
        let sumTime = 0;
        cy.authorizationAdmin(autoAdmin)

        cy.get('.main-sidebar')
            .contains('Cпівробітники')
            .click()

        cy.get('td')
            .contains('Гусаревич Cніжана')
            .parent()
            .parent()
            .contains('ІЛ')
            .click()

        cy.get('.month-picker')
            .click()
            .get('[data-id = "0:2"]')
            .click()

        cy.get(':nth-child(9) > :nth-child(18) > .track_time')
            .clear()

        cy.get(':nth-child(8) > :nth-child(23) > .track_time')
            .clear()

        cy.get(':nth-child(3) > :nth-child(17) > .track_time')
            .clear()

        cy.get(':nth-child(2) > :nth-child(24)')
            .click()

        cy.get(':nth-child(19) > [style="width: 74px;"]')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .not(':last')
            .each((el) => {
                sumTime += +el.text() || 0;
                cy.log('Total sum:' + sumTime);
            })
            .should(() => {
                expect(sumTime).to.equal(72)
            })

        cy.get('.main-sidebar')
            .contains('Cпівробітники')
            .click()
    })
})