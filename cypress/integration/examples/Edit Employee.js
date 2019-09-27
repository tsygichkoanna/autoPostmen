import { createRandomString } from '../../utils';
const newUserFirstName = `тест${createRandomString(8, 'ru')}`;
const newUserLastName = `тест${createRandomString(8, 'ru')}`;
const autoAdmin = "";

describe('Editing Employee in the role Admin', function () {

    beforeEach(() => {
        cy.authorizationAdmin(autoAdmin)

        cy.get('td')
            .contains('тестисьоЙБьч')
            .click()
    })

    it('Edit Employee Маркетинг/Стратегия/Стратег/Account manager', function () {
        // Edit First name
        cy.get('[name = "f_name"]')
            .clear()
            .type(newUserFirstName)

        // Edit Last Name
        cy.get('[name = "l_name"]')
            .clear()
            .type(newUserLastName)

        // Edit direction
        cy.get('#react-select-2--value')
            .click()

        cy.get('#react-select-2--option-0')
            .click()
        // Edit department
        cy.get('#react-select-3--value')
            .click()

        cy.get('#react-select-3--option-9')
            .click()
        // Edit position
        cy.get('#react-select-4--value')
            .click()

        cy.get('#react-select-4--option-0')
            .click()
        // Edit role
        cy.get('#react-select-5--value')
            .click()

        cy.get('#react-select-5--option-1')
            .click()
        // Edit client
        cy.get('#react-select-6--value > .Select-value > .Select-value-icon')
            .click()

        cy.get('#react-select-6--value')
            .click()

        cy.get('#react-select-6--option-33')
            .click()
        // Edit project
        cy.get('#react-select-7--value')
            .click()

        cy.get('#react-select-7--option-0')
            .click()
        // Edit work
        cy.get('[type = "checkbox"]')
            .get('#5ac38a84c26f352d84c442b55a2ff15f1cd34f1a4ee3c3cd')
            .check()
            .get('#5ac38a84c26f352d84c442b55a2ff56d1cd34f1a4ee3c3eb')
            .check()
            .get('#5ac38a84c26f352d84c442b55a5778980afd1073fa837df0')
            .check()
            .get('#5ac38a84c26f352d84c442b55a5779aa0afd1073fa837e07')
            .check()
            .get('#5ac38a84c26f352d84c442b55a577de90afd1073fa837e23')
            .check()
            .get('#5ac38a84c26f352d84c442b55a577de90afd1073fa837e25')
            .check()

        cy.get('#save')
            .click()

    })

    it('Edit Employee Загальногосподарські/Веб-розробка/Junior programmer', function () {
        // Edit First name
        cy.get('[name = "f_name"]')
            .clear()
            .type(newUserFirstName)

        // Edit Last Name
        cy.get('[name = "l_name"]')
            .clear()
            .type(newUserLastName)

        // Edit direction
        cy.get('#react-select-2--value')
            .click()

        cy.get('#react-select-2--option-2')
            .click()
        // Edit department
        cy.get('#react-select-3--value')
            .click()

        cy.get('#react-select-3--option-5')
            .click()
        // Edit position
        cy.get('#react-select-4--value')
            .click()

        cy.get('#react-select-4--option-0')
            .click()
        // Edit role
        cy.get('#react-select-5--value')
            .click()

        cy.get('#react-select-5--option-3')
            .click()
        // Edit client
        cy.get('#react-select-6--value > .Select-value > .Select-value-icon')
            .click()

        cy.get('#react-select-6--value')
            .click()

        cy.get('#react-select-6--option-9')
            .click()
        // Edit project
        cy.get('#react-select-7--value')
            .click()

        cy.get('#react-select-7--option-0')
            .click()
        // Edit work
        cy.get('[type = "checkbox"]')
            .get('#5a33b5de6f1c1110f7b5a4145a2ff56d1cd34f1a4ee3c3ec')
            .check()
            .get('#5a33b5de6f1c1110f7b5a4145a5778ea0afd1073fa837df7')
            .check()
            .get('#5a33b5de6f1c1110f7b5a4145a5779aa0afd1073fa837e03')
            .check()
            .get('#5a33b5de6f1c1110f7b5a4145a5779aa0afd1073fa837e04')
            .check()

        cy.get('[name = "salary"]')
            .clear()
            .type('1500')

        cy.get('#save')
            .click()
    })
})