describe('Authorization', function () {

    beforeEach(() => {
        cy.visit('http://test/login')
    })


    // Authorization Admin
    it.only('Login valid ADMIN', function () {
        cy.get('[name = "email"]')
            .type('admin@test.com')

        cy.get('[name = "password"]')
            .type(Cypress.env('foo'))
            // .type(foo)

        cy.get('button')
            .click()

        cy.get('.bg_black_exit_a')
            .click()
    })

    it('Login missing "@" ADMIN', function () {
        cy.get('[name = "email"]')
            .type('mailtest.com')

        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login with Special symbols ADMIN', function () {
        cy.get('[name = "email"]')
            .type('#@%^%#$@#$@#.com')

        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login Multiple dots ADMIN', function () {
        cy.get('[name = "email"]')
            .type('email..admin@test.com')

        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login dot before domain ADMIN', function () {
        cy.get('[name = "email"]')
            .type('admin@.test.com')

        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Without login ADMIN', function () {
        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Without password ADMIN', function () {
        cy.get('[name = "email"]')
            .type('admin@test.com')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Це поле є обов`язковим')
    })

    it('With false password ADMIN', function () {
        cy.get('[name = "email"]')
            .type('admin@test.com')

        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.alert.alert-danger')
            .contains('Невірний логін або пароль')
    })


    // Authorization Head Dept
    it('Login valid HEAD DEPT', function () {
        cy.get('[name = "email"]')
            .type('test@mail.com')

        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.bg_black_exit_a')
            .click()
    })

    it('Login missing "@" HEAD DEPT', function () {
        cy.get('[name = "email"]')
            .type('test@mail.com')

        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login with Special symbols HEAD DEPT', function () {
        cy.get('[name = "email"]')
            .type('#@%^%#$@#$@#.com')

        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login Multiple dots HEAD DEPT', function () {
        cy.get('[name = "email"]')
            .type('email..test@r22.org')

        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login dot after domain HEAD DEPT', function () {
        cy.get('[name = "email"]')
            .type('email@.test.org')

        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Without login HEAD DEPT', function () {
        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Without password HEAD DEPT', function () {
        cy.get('[name = "email"]')
            .type('email@t23.com')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Це поле є обов`язковим')
    })

    it('With false password HEAD DEPT', function () {
        cy.get('[name = "email"]')
            .type('email@t23.com')

        cy.get('[name = "password"]')
            .type('3434')

        cy.get('button')
            .click()

        cy.get('.alert.alert-danger')
            .contains('Невірний логін або пароль')
    })


    //   Authorization Employee
    it('Login valid EMPLOYEE', function () {
        cy.get('[name = "email"]')
            .type('emaitest@mailforspam.com')

        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.bg_black_exit_a')
            .click()
    })

    it('Login missing "@" EMPLOYEE', function () {
        cy.get('[name = "email"]')
            .type('autotestmailforspam.com')

        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login with Special symbols EMPLOYEE', function () {
        cy.get('[name = "email"]')
            .type('#@%^%#$@#$@#.com')

        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login Multiple dots EMPLOYEE', function () {
        cy.get('[name = "email"]')
            .type('email..test@mailforspam.com')

        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login dot before domain EMPLOYEE', function () {
        cy.get('[name = "email"]')
            .type('emailtest@.mailforspam.com')

        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Without login EMPLOYEE', function () {
        cy.get('[name = "password"]')
            .type('test')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Without password EMPLOYEE', function () {
        cy.get('[name = "email"]')
            .type('emailtest@mailforspam.com')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Це поле є обов`язковим')
    })

    it('With false password EMPLOYEE', function () {
        cy.get('[name = "email"]')
            .type('emailtest@mailforspam.com')

        cy.get('[name = "password"]')
            .type('hWmP4mM3o')

        cy.get('button')
            .click()

        cy.get('.alert.alert-danger')
            .contains('Невірний логін або пароль')
    })
})