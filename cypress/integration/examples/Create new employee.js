import { createRandomString } from '../../utils';
const newUserFirstName = `ТЕСТ${createRandomString(4, 'ru')}`;
const newUserLastName = `ТЕСТ${createRandomString(4, 'ru')}`;
const autoAdmin = "";
// Authorization ADMIN --> Create EMPLOYEE --> Authorization EMPLOYEE --> Track time --> Authorization ADMIN --> 
// --> Ckeck time Employee --> Delete time Employee --> Authorization EMPLOYEE --> Check time --> Authorization ADMIN -->
// --> Delete EMPLOYE
describe('Create new employee', function () {
    before(() => {
        cy.clearCookies()
    })
    const data = Cypress.env('default');
    data.email = `test${Date.now()}@mailforspam.com`;

    it('Create employee Политика/Медиа-аналитика/Analyst', function () {
        cy.authorizationAdmin(autoAdmin)

        cy.contains('Додати')
            .click()

        cy.get('[name = "f_name"]')
            .type(newUserFirstName)

        cy.get('[name = "l_name"]')
            .type(newUserLastName)
        // направление
        cy.get(':nth-child(4) > .Select > .Select-control > .Select-arrow-zone')
            .click()

        cy.get('#react-select-2--option-1')
            .click()
        // Отдел
        cy.get(':nth-child(5) > .Select > .Select-control > .Select-arrow-zone')
            .click()

        cy.get('#react-select-3--option-6')
            .click()
        // Посада
        cy.get(':nth-child(6) > .Select > .Select-control > .Select-arrow-zone')
            .click()

        cy.get('#react-select-4--option-2')
            .click()
        // Роль
        cy.get(':nth-child(7) > .Select > .Select-control > .Select-arrow-zone')
            .click()

        cy.get('#react-select-5--option-3')
            .click()
        // Клиенты
        cy.get(':nth-child(8) > .Select > .Select-control > .Select-arrow-zone')
            .click()

        cy.get('#react-select-6--option-30')
            .click()
        // Проекты
        cy.get(':nth-child(11) > .Select > .Select-control > .Select-arrow-zone')
            .click()

        cy.get('#react-select-7--option-0')
            .click()

        cy.get('[type = "checkbox"]')
            .get('#5a745d3dcaf99bea9bc410755a2ff15f1cd34f1a4ee3c3c9')
            .check()
            .get('#5a745d3dcaf99bea9bc410755a2ff23c1cd34f1a4ee3c3ce')
            .check()
            .get('#5a745d3dcaf99bea9bc410755a3004af1cd34f1a4ee3c41e')
            .check()
            .get('#5a745d3dcaf99bea9bc410755a5776370afd1073fa837de2')
            .check()
            .get('#5a745d3dcaf99bea9bc410755a5779aa0afd1073fa837e03')
            .check()
            .get('#5a745d3dcaf99bea9bc410755a577a4a0afd1073fa837e0d')
            .check()
            .get('#5a745d3dcaf99bea9bc410755a577de90afd1073fa837e24')
            .check()
            .get('#5a745d3dcaf99bea9bc410755a58c0430afd1073fa837ee2')
            .check()

        cy.get('[type = "number"]')
            .clear()
            .type('1000')

        cy.get('[name = "startDate"]')
            .type('2019-05-19')


        cy.get('[name = "email"]')
            .type(data.email)

        cy.get('#save')
            .focus()
            .click()
            .wait(2000)
            .reload()

        cy.get('td')
            .contains(newUserFirstName)

        cy.request(`https://www.mailforspam.co/mail/${data.email.replace('@mailforspam.com', '')}/1`)
            .then((resp) => {
                let password = resp.body.match(/Your new password for CRM: (.*?)<br \/>/)[1]
                console.log(password)

                cy.get('.bg_black_exit_a')
                    .click()

                cy.get('[name = "email"]')
                    .type(data.email)

                cy.get('[name = "password"]')
                    .type(password)

                cy.get('button')
                    .click()

                cy.get(':nth-child(3) > :nth-child(21) > .track_time')
                    .type('7.5')

                cy.get(':nth-child(2) > :nth-child(22) > .track_time')
                    .type('7')

                cy.get(':nth-child(7) > :nth-child(23) > .track_time')
                    .type('7.5')

                cy.get(':nth-child(6) > :nth-child(22) > .track_time')
                    .click()

                cy.get(':nth-child(16) > [style="width: 74px;"]')
                    .contains('22')

                cy.get('.bg_black_exit_a')
                    .click()

                cy.authorizationAdmin(autoAdmin)

                cy.get('td')
                    .contains(newUserFirstName)
                    .parent()
                    .parent()
                    .contains('ІЛ')
                    .click()

                cy.get(':nth-child(16) > [style="width: 74px;"]')
                    .contains('22')

                cy.get(':nth-child(2) > :nth-child(22) > .track_time')
                    .clear()

                cy.get(':nth-child(3) > :nth-child(21) > .track_time')
                    .clear()

                cy.get(':nth-child(7) > :nth-child(23) > .track_time')
                    .clear()

                cy.get('.bg_black_exit_a')
                    .click()

                cy.get('[name = "email"]')
                    .type(data.email)

                cy.get('[name = "password"]')
                    .type(password)

                cy.get('button')
                    .click()

                cy.get(':nth-child(16) > [style="width: 74px;"]')
                    .contains('0')

                cy.get('.bg_black_exit_a')
                    .click()

                cy.authorizationAdmin(autoAdmin)

                cy.get('td')
                    .contains(newUserFirstName)
                    .parent()
                    .parent()
                    .find('.btn-delete')
                    .click()

                cy.get('.popover_wrap')
                    .find('.btn-danger')
                    .click()

                cy.get('.check-label > span')
                    .click()

                cy.get('td')
                    .contains(newUserFirstName)
                    .parent()
                    .parent()
                    .find('.btn-delete')
                    .click()

                cy.get('.popover_wrap')
                    .find('.btn-danger')
                    .click()

            })
    })



})
