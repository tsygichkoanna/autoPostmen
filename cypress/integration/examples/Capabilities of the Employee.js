// import { createRandomString } from '../../utils';
// const randomPassword = `0${createRandomString(7, 'num')}`;
const autoEmployee = "";


describe('Capabilities of the Employee', function () {
    it.only('Time recording in the result sheet', function () {
        cy.authorizationEmployee(autoEmployee)

        cy.get(':nth-child(2) > :nth-child(2) > .track_time')
            .clear()
            .type('7.5')

        cy.get(':nth-child(3) > :nth-child(2) > .track_time')
            .clear()
            .type('7.5')

        cy.get(':nth-child(4) > :nth-child(2) > .track_time')
            .clear()
            .type('4')

            cy.get(':nth-child(3) > :nth-child(3) > .track_time')
            .click()
    })

    it('Changing password', function () {
        cy.authorizationEmployee(autoEmployee)

        cy.get('.sidebar-menu')
            .contains('Мої дані ')
            .click()

        cy.get('[name = "password"]')
            .type('test')
            .get('[name = "secondPassword"]')
            .type('test')

        cy.get('#save')
            .click()

        cy.get('.logo')
            .click()
    })
})
