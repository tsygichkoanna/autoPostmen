import { createRandomString } from '../utils';
const newUserFirstName = `ТЕСТ${createRandomString(4, 'ru')}`;
const newUserLastName = `ТЕСТ${createRandomString(4, 'ru')}`;
const autoAdmin = "";
const data = Cypress.env('default');
data.email = `test${Date.now()}@mailforspam.com`;

// Удаление сотрудника
Cypress.Commands.add('deleteUser', (newUserLastName) => {
    cy.get('td')
        .contains(newUserLastName)
        .parent()
        .parent()
        .find('.btn-delete')
        .click()
        .get('[type = "submit"]')
        .click()
        .reload()

    cy.get('.check-label')
        .contains('Показати Архівних співробітників:')
        .click()

    cy.get('td')
        .contains(newUserLastName)
        .parent()
        .parent()
        .find('.btn-delete')
        .click()
        .get('[type = "submit"]')
        .click()
        .reload()
})

// Авторизация в роли Админа
Cypress.Commands.add('authorizationAdmin', (autoAdmin) => {
    cy.viewport(1440, 900)
    cy.visit('http://test/login')
    cy.get('[name = "email"]')
        .type('admin@test.com')

    cy.get('[name = "password"]')
        .type('test')

    cy.get('button')
        .click()
})

// Авторизация в роли Сотрудника
Cypress.Commands.add('authorizationEmployee', (autoEmployee) => {
    cy.viewport(1440, 900)
    cy.visit('http://test/login')
    cy.get('[name = "email"]')
        .type('autotest@mailforspam.com')

    cy.get('[name = "password"]')
        .type('12345678')

    cy.get('button')
        .click()
})

// Авторизация в роли Главы отдела
Cypress.Commands.add('authorizationHead', (autoHead) => {
    cy.viewport(1440, 900)
    cy.visit('http://test/login')
    cy.get('[name = "email"]')
        .type('mail@test.com')

    cy.get('[name = "password"]')
        .type('test')

    cy.get('button')
        .click()
})

// Результирующий лист - Отдел --> Деньги
Cypress.Commands.add('deptmoney', (deptMoney) => {
    cy.get(':nth-child(3) > .Select > .Select-control > .Select-arrow-zone')
        .click()
        .get('#react-select-3--option-1')
        .click()
        .wait(2000)

        cy.get(':nth-child(4) > .Select > .Select-control > .Select-arrow-zone')
        .click()
        .get('#react-select-4--option-1')
        .click()
        .wait(2000)

        cy.get(':nth-child(5) > .Select > .Select-control > .Select-arrow-zone')
        .click()
        .get('#react-select-5--option-0')
        .click()
        .wait(2000)
})

// Результирующий лист - Отдел --> Время
Cypress.Commands.add('depttime', (deptTime) => {
    cy.get(':nth-child(3) > .Select > .Select-control > .Select-arrow-zone')
        .click()
        .get('#react-select-3--option-1')
        .click()
        .wait(2000)

        cy.get(':nth-child(5) > .Select > .Select-control > .Select-arrow-zone')
        .click()
        .get('#react-select-5--option-0')
        .click()
        .wait(2000)
})

// Результирующий лист - Выбор месяца --> Январь
Cypress.Commands.add('monthJanuary', (january) => {
    cy.get('.month-picker')
            .click()
            .find('[data-id = "0:1"]')
            .click()
})

// Результирующий лист - Выбор месяца --> Февраль
Cypress.Commands.add('monthFebraury', (febraury) => {
    cy.get('.month-picker')
            .click()
            .find('[data-id = "0:2"]')
            .click()
})

// Результирующий лист - Выбор месяца --> Март
Cypress.Commands.add('monthMarch', (march) => {
    cy.get('.month-picker')
            .click()
            .find('[data-id = "0:3"]')
            .click()
})


// const COMMAND_DELAY = 2000;

// for (const command of ['visit', 'click', 'trigger', 'type', 'clear', 'reload', 'contains']) {
//     Cypress.Commands.overwrite(command, (originalFn, ...args) => {
//         const origVal = originalFn(...args);

//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 resolve(origVal);
//             }, COMMAND_DELAY);
//         })
//     })
// }