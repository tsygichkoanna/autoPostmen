const autoAdmin = "";

beforeEach(() => {
    cy.authorizationAdmin(autoAdmin)

    cy.get('.main-sidebar')
        .contains('СГА')
        .click()
})

describe('СГА', function () {

    it('January', function () {
        cy.get('.month-picker')
            .click()

        cy.get('[data-id = "0:1"]')
            .click()

        cy.get('.form-control')
            .clear()
            .type(1000000)

        cy.get('#save')
            .click()
            .get('.btn-danger')
            .click()

        let sumMoney = 0;

        cy.get(':nth-child(24) > :nth-child(3)')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumMoney += +el.text() || 0;
            })
            .should(() => {
                expect(sumMoney).to.be.within(999999, 1000020)
            })
    })

    it('February', function () {
        cy.get('.month-picker')
            .click()

        cy.get('[data-id = "0:2"]')
            .click()

        cy.get('.form-control')
            .clear()
            .type(1000000)

        cy.get('#save')
            .click()
            .get('.btn-danger')
            .click()

        let sumMoney = 0;

        cy.get(':nth-child(29) > :nth-child(2)')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumMoney += +el.text() || 0;
            })
            .should(() => {
                expect(sumMoney).to.be.within(999999, 1000020)
            })
    })

    it('March', function () {
        cy.get('.month-picker')
            .click()

        cy.get('[data-id = "0:3"]')
            .click()

        cy.get('.form-control')
            .clear()
            .type(1000000)

        cy.get('#save')
            .click()
            .get('.btn-danger')
            .click()

        let sumMoney = 0;

        cy.get('tbody > :nth-child(4) > :nth-child(2)')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumMoney += +el.text() || 0;
            })
            .should(() => {
                expect(sumMoney).to.be.within(999999, 1000020)
            })
    })

    it('April', function () {
        cy.get('.month-picker')
            .click()

        cy.get('[data-id = "0:4"]')
            .click()

        cy.get('.form-control')
            .clear()
            .type(1000000)

        cy.get('#save')
            .click()
            .get('.btn-danger')
            .click()

        let sumMoney = 0;

        cy.get(':nth-child(3) > [style="width: 399px;"]')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumMoney += +el.text() || 0;
            })
            .should(() => {
                expect(sumMoney).to.be.within(999999, 1000020)
            })
    })
})
