const autoHead = "";

describe('Capabilities of the Head Department', function () {
    it('Track time yourself', function () {
        cy.authorizationHead(autoHead)
        
        cy.get('.main-sidebar')
            .contains('Індивідуальний лист')
            .click()

        cy.get(':nth-child(1) > :nth-child(2) > .track_time')
            .type('6')
            .clear()


        cy.get(':nth-child(2) > :nth-child(4) > .track_time')
            .type('7.5')
            .clear()

        cy.get(':nth-child(1) > :nth-child(3) > .track_time')
            .click()

        cy.get('.main-sidebar')
            .contains('СЛО')

        cy.get('.main-sidebar')
            .contains('Мої дані')
            .reload()

    })
})