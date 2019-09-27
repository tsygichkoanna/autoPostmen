describe('Authorization', function () {

    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
    })


    // Authorization Admin
    it.only('Login valid ADMIN', function () {
        cy.get('[name = "email"]')
            .type('admin@atilog.com')

        cy.get('[name = "password"]')
            .type('b59c67bf196a')

        cy.get('button')
            .click()

        cy.get('.bg_black_exit_a')
            .click()
    })

    it('Login missing "@" ADMIN', function () {
        cy.get('[name = "email"]')
            .type('adminatilog.com')

        cy.get('[name = "password"]')
            .type('b59c67bf196a')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login with Special symbols ADMIN', function () {
        cy.get('[name = "email"]')
            .type('#@%^%#$@#$@#.com')

        cy.get('[name = "password"]')
            .type('b59c67bf196a')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login Multiple dots ADMIN', function () {
        cy.get('[name = "email"]')
            .type('email..admin@atilog.com')

        cy.get('[name = "password"]')
            .type('b59c67bf196a')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login dot before domain ADMIN', function () {
        cy.get('[name = "email"]')
            .type('admin@.atilog.com')

        cy.get('[name = "password"]')
            .type('b59c67bf196a')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Without login ADMIN', function () {
        cy.get('[name = "password"]')
            .type('b59c67bf196a')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Without password ADMIN', function () {
        cy.get('[name = "email"]')
            .type('admin@atilog.com')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Це поле є обов`язковим')
    })

    it('With false password ADMIN', function () {
        cy.get('[name = "email"]')
            .type('admin@atilog.com')

        cy.get('[name = "password"]')
            .type('b59x67bf196a')

        cy.get('button')
            .click()

        cy.get('.alert.alert-danger')
            .contains('Невірний логін або пароль')
    })


    // Authorization Head Dept
    it('Login valid HEAD DEPT', function () {
        cy.get('[name = "email"]')
            .type('th@p33.org')

        cy.get('[name = "password"]')
            .type('1111')

        cy.get('button')
            .click()

        cy.get('.bg_black_exit_a')
            .click()
    })

    it('Login missing "@" HEAD DEPT', function () {
        cy.get('[name = "email"]')
            .type('thp33.org')

        cy.get('[name = "password"]')
            .type('1111')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login with Special symbols HEAD DEPT', function () {
        cy.get('[name = "email"]')
            .type('#@%^%#$@#$@#.com')

        cy.get('[name = "password"]')
            .type('1111')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login Multiple dots HEAD DEPT', function () {
        cy.get('[name = "email"]')
            .type('email..th@p33.org')

        cy.get('[name = "password"]')
            .type('1111')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login dot after domain HEAD DEPT', function () {
        cy.get('[name = "email"]')
            .type('th@.p33.org')

        cy.get('[name = "password"]')
            .type('1111')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Without login HEAD DEPT', function () {
        cy.get('[name = "password"]')
            .type('1111')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Without password HEAD DEPT', function () {
        cy.get('[name = "email"]')
            .type('th@p33.org')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Це поле є обов`язковим')
    })

    it('With false password HEAD DEPT', function () {
        cy.get('[name = "email"]')
            .type('th@p33.org')

        cy.get('[name = "password"]')
            .type('1121')

        cy.get('button')
            .click()

        cy.get('.alert.alert-danger')
            .contains('Невірний логін або пароль')
    })


    //   Authorization Employee
    it('Login valid EMPLOYEE', function () {
        cy.get('[name = "email"]')
            .type('autotest@mailforspam.com')

        cy.get('[name = "password"]')
            .type('12345678')

        cy.get('button')
            .click()

        cy.get('.bg_black_exit_a')
            .click()
    })

    it('Login missing "@" EMPLOYEE', function () {
        cy.get('[name = "email"]')
            .type('autotestmailforspam.com')

        cy.get('[name = "password"]')
            .type('12345678')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login with Special symbols EMPLOYEE', function () {
        cy.get('[name = "email"]')
            .type('#@%^%#$@#$@#.com')

        cy.get('[name = "password"]')
            .type('12345678')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login Multiple dots EMPLOYEE', function () {
        cy.get('[name = "email"]')
            .type('email..autotest@mailforspam.com')

        cy.get('[name = "password"]')
            .type('12345678')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Login dot before domain EMPLOYEE', function () {
        cy.get('[name = "email"]')
            .type('autotest@.mailforspam.com')

        cy.get('[name = "password"]')
            .type('12345678')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Without login EMPLOYEE', function () {
        cy.get('[name = "password"]')
            .type('12345678')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Введіть коректний Email')
    })

    it('Without password EMPLOYEE', function () {
        cy.get('[name = "email"]')
            .type('autotest@mailforspam.com')

        cy.get('button')
            .click()

        cy.get('.help-block')
            .contains('Це поле є обов`язковим')
    })

    it('With false password EMPLOYEE', function () {
        cy.get('[name = "email"]')
            .type('autotest@mailforspam.com')

        cy.get('[name = "password"]')
            .type('HfQEMjGhWmP4mM3o')

        cy.get('button')
            .click()

        cy.get('.alert.alert-danger')
            .contains('Невірний логін або пароль')
    })
})