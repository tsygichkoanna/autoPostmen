import { createRandomString } from '../../utils';
const someText = `ТЕСТ${createRandomString(4, 'some')}`;
const randomNum = `T${createRandomString(2, 'num')}`;
const autoAdmin = "";

beforeEach(() => {
    cy.authorizationAdmin(autoAdmin)
})

describe('Types of jobs, clients', function () {
    it('Create and delete new job', function () {
        cy.get('.main-sidebar')
            .contains('Види робіт')
            .click()

        cy.get(':nth-child(2) > .btn')
            .click()

        cy.get(':nth-child(1) > .form-control')
            .type(someText)

        cy.get(':nth-child(2) > .form-control')
            .type(randomNum)

        cy.get('form > .btn')
            .click()
            .wait(2000)
            .reload()

        // delete new job
        cy.get('tr > td')
            .find(`input[value=${someText}]`)
            .parent()
            .parent()
            .find('.btn-delete')
            .click()
            .get('.popover_wrap > .btn')
            .click()
            .reload()
    })

    it('Create and delete new client', function () {
        cy.get('.main-sidebar')
            .contains('Клієнти')
            .click()

        cy.get('.btn-add')
            .click()

        cy.get('.form-control')
            .type(someText)

        cy.get('#react-select-2--value')
            .click()

        cy.get('#react-select-2--option-2')
            .click()

        cy.get('[style="position: relative;"] > .btn')
            .click()

        cy.get('.popover_wrap_add > form > .form-group > .form-control')
            .type('Some client first')
            .get('form > .btn')
            .click()

        cy.get(':nth-child(4) > .btn')
            .click()

        cy.get('.popover_wrap_add > form > .form-group > .form-control')
            .type('Some client second')
            .get('form > .btn')
            .click()

        cy.get('.btn_wrap > .btn-primary')
            .click()
            .reload()

        // delete new client
        cy.get('td')
            .contains(someText)
            .parent()
            .parent()
            .find(':nth-child(4) > div > .btn')
            .click()

        cy.get('.btn-danger')
            .click()


    })

    it('Create and delete position', function () {
        cy.get('.main-sidebar')
            .contains('Позиції')
            .click()

        cy.get('.btn-add')
            .click()

        cy.get('.form-control')
            .type(someText)

        cy.get('#react-select-2--value')
            .click()

        cy.get('#react-select-2--option-4')
            .click()

        cy.get('.btn-primary')
            .click()

            // delete new position
        cy.get('td')
            .contains(someText)
            .parent()
            .parent()
            .find(':nth-child(3) > div')
            .click()

        cy.get('.popover_wrap > .btn')
            .click()
    })
})