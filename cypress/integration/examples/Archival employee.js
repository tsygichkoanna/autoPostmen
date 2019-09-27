import { createRandomString } from '../../utils';
const newUserFirstName = `ТЕСТ${createRandomString(2, 'num')}`;
const newUserLastName = `ТЕСТ${createRandomString(2, 'num')}`;
const autoAdmin = "";

// Создание сотрудника ==> Запись в переменную общего времени из Результирующего листа за Март месяц ==> Запись времени сотруднику ==> 
// ==> Проверка времени в результирующем листе ==> Архивация сотрудника ==> Проверка наличия времени у заархивированного сотрудника ==>
//==>  Удаление архивного сотрудника ==> Проверка наличия времени и сотрудника, который был удален

describe('Archival employee', function () {
    const data = Cypress.env('default');
    data.email = `test${Date.now()}@mailforspam.com`;

    it('Archival employee', function () {
        cy.authorizationAdmin(autoAdmin)

        // Создание сотрудника
        cy.log('СОЗДАНИЕ СОТРУДНИКА')
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

        // Запись в переменную общего времени из Результирующего листа за Март месяц
        cy.log('ЗАПИСЬ В ПЕРЕМЕННУЮ (num) ОБЩЕГО ВРЕМЕНИ ИЗ "РЛ" ЗА МАРТ МЕСЯЦ')
        cy.get('.main-sidebar')
            .contains('Результуючі листи')
            .click()
            .wait(2000)

        let num = 0;
        cy.get('td')
            .parent()
            .contains('Назагал')
            .parent()
            .find('td')
            .last()
            .then(($span) => {
                num = parseFloat($span.text())
                cy.log('Total sum: ' + num)
            })

        // Запись времени сотруднику
        cy.log('ЗАПИСЬ ВРЕМЕНИ СОТРУДНИКУ')
        cy.get('.main-sidebar')
            .contains('Cпівробітники')
            .click()

        cy.get('td')
            .contains(newUserFirstName)
            .parent()
            .parent()
            .contains('ІЛ')
            .click()

        cy.get(':nth-child(4) > :nth-child(21) > .track_time')
            .type('7.5')
            .get(':nth-child(3) > :nth-child(23) > .track_time')
            .type('7.5')
            .get(':nth-child(2) > :nth-child(21) > .track_time')
            .type('7.5')

        let numEmp = 0;
        cy.get(':nth-child(16) > [style="width: 74px;"]').then(($span) => {
            numEmp = parseFloat($span.text())
            cy.log('Total sum: ' + numEmp)
        })

        // Проверка времени в результирующем листе
        cy.log('ПРОВЕРКА ВРЕМЕНИ В "РЛ"')
        cy.get('.main-sidebar')
            .contains('Результуючі листи')
            .click()
            .wait(2000)

        let sumTime = 0;
        cy.get('td')
            .parent()
            .contains('Назагал')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumTime += +el.text() || 0;
                cy.log('Total sum:' + sumTime);
            })
            .should(() => {
                expect(sumTime).to.be.within(num + numEmp - 0.5, num + numEmp + 0.5)
            })

        // Архивация сотрудника
        cy.log('АРХИВАЦИЯ СОТРУДНИКА')
        cy.get('.main-sidebar')
            .contains('Cпівробітники')
            .click()
            .wait(2000)

        cy.get('td')
            .contains(newUserFirstName)
            .parent()
            .parent()
            .find('.btn-delete')
            .click()
            .get('.popover_wrap')
            .find('.btn-danger')
            .click()

        // Проверка наличия времени у заархивированного сотрудника
        cy.log('ПРОВЕРКА НАЛИЧИЯ ВРЕМЕНИ У ЗААРХИВИРОВАННОГО СОТРУДНИКА')
        cy.get('.main-sidebar')
            .contains('Результуючі листи')
            .click()
            .wait(2000)

        let sumArc = 0;
        cy.get('td')
            .parent()
            .contains('Назагал')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumArc += +el.text() || 0;
                cy.log('Total sum:' + sumArc);
            })
            .should(() => {
                expect(sumArc).to.be.within(num + numEmp - 0.5, num + numEmp + 0.5)
            })

        // Удаление архивного сотрудника
        cy.log('УДАЛЕНИЕ АРХИВНОГО СОТРУДНИКА')
        cy.get('.main-sidebar')
            .contains('Cпівробітники')
            .click()
            .reload()
            .wait(2000)

        cy.get('.check-label > span')
            .click()

        cy.get('td')
            .contains(newUserFirstName)
            .parent()
            .parent()
            .find('.btn-delete')
            .click()
            .get('.popover_wrap')
            .find('.btn-danger')
            .click()

        // Проверка наличия времени и сотрудника, который был удален
        cy.log('ПРОВЕРКА "РЛ" НА НАЛИЧИЕ ВРЕМЕНИ СОТРУДНИКА, КОТОРЫЙ БЫЛ УДАЛЕН')
        cy.get('.main-sidebar')
            .contains('Результуючі листи')
            .click()
            .wait(2000)

        let sumDel = 0;
        cy.get('td')
            .parent()
            .contains('Назагал')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumDel += +el.text() || 0;
                cy.log('Total sum:' + sumDel);
            })
            .should(() => {
                expect(sumDel).to.be.within(num - 1, num + 1)
            })
    })
})