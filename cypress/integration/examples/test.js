describe('Sum result sheet', function () {
    const autoAdmin = "";
    const febraury = "";

    it('Check time', function () {

        cy.log('CHECK TIME')
        cy.authorizationAdmin(autoAdmin)

        cy.get('td')
            .contains('Гусаревич Cніжана')
            .parent()
            .parent()
            .contains('ІЛ')
            .click()

        cy.monthFebraury(febraury)
            .wait(2000)

        let general = 0;
        cy.get('td')
            .contains('Назагал')
            .parent()
            .find('td')
            .not(':last')
            .last()
            .then(($span) => {
                general += parseFloat($span.text())
                cy.log('General sum: ' + general)
            })

        let sumCells = 0;
        cy.get('td')
            .contains('Назагал')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .not(':last')
            .each((el) => {
                sumCells += +el.text() || 0;
                cy.log('Sum Cells: ' + sumCells);
            })
            .should(() => {
                expect(sumCells).to.be.within(general - 0.3, general + 0.3)
            })

        cy.get('.main-sidebar')
            .contains('Результуючі листи')
            .click()

        cy.monthFebraury(febraury)

        cy.get(':nth-child(2) > .Select > .Select-control > .Select-arrow-zone > .Select-arrow')
            .click()
            .wait(2000)
            .get('#react-select-2--option-1')
            .click()

        cy.get(':nth-child(5) > .Select > .Select-control > .Select-arrow-zone > .Select-arrow')
            .click()
            .wait(2000)
            .get('#react-select-5--option-0')
            .click()

        let resultList = 0;
        cy.get(':nth-child(34) > :nth-child(19)')
            .then(($span) => {
                resultList += parseFloat($span.text())
                cy.log('Result list: ' + resultList)
            })
            .should(() => {
                expect(general).to.be.within(resultList - 0.3, resultList + 0.3)
            })

        cy.log('ADD TIME')
        cy.get('.main-sidebar')
            .contains('Cпівробітники')
            .click()

        cy.get('td')
            .contains('Гусаревич Cніжана')
            .parent()
            .parent()
            .contains('ІЛ')
            .click()

        cy.monthFebraury(febraury)

        cy.get(':nth-child(9) > :nth-child(18) > .track_time')
            .type('7')

        cy.get(':nth-child(8) > :nth-child(23) > .track_time')
            .type('4.5')

        cy.get(':nth-child(3) > :nth-child(17) > .track_time')
            .type('5')

        cy.get(':nth-child(2) > :nth-child(24)')
            .click()

        cy.get('td')
            .contains('Назагал')
            .parent()
            .find('td')
            .not(':last')
            .last()
            .then(($span) => {
                general += parseFloat($span.text())
                cy.log('General sum: ' + general)
            })
    })
})