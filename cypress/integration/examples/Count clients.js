const autoAdmin = "";
const deptMoney = "";
const deptTime = "";
const january = "";
const febraury = "";
const march = "";

describe('Check the time in the result sheet', function () {

    beforeEach(() => {
        cy.authorizationAdmin(autoAdmin)

        cy.get('.main-sidebar')
            .contains('Результуючі листи')
            .click()
    })
    // Sum money
    it('January - Money - 1+1', function () {
        cy.monthJanuary(january)
        cy.deptmoney(deptMoney)

        let general = 0;
        cy.get('td')
            .parent()
            .contains('1+1')
            .parent()
            .find('td')
            .last()
            .then(($span) => {
                general = parseFloat($span.text())
                cy.log('Total sum: ' + general)
            })

        let sumCells = 0;
        cy.get('td')
            .parent()
            .contains('1+1')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumCells += +el.text() || 0;
                cy.log('Total sum:' + sumCells);
            })
            .should(() => {
                expect(sumCells).to.be.within(general - 0.5, general + 0.5)
            })
    })

    it('January - Money - Intertop', function () {
        cy.monthJanuary(january)
        cy.deptmoney(deptMoney)

        let general = 0;
        cy.get('td')
            .parent()
            .contains('1+1')
            .parent()
            .find('td')
            .last()
            .then(($span) => {
                general = parseFloat($span.text())
                cy.log('Total sum: ' + general)
            })

        let sumCells = 0;
        cy.get('td')
            .parent()
            .contains('1+1')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumCells += +el.text() || 0;
                cy.log('Total sum:' + sumCells);
            })
            .should(() => {
                expect(sumCells).to.be.within(general - 0.5, general + 0.5)
            })
    })

    // Sum time
    it('January - Time - Біофарма П', function () {
        cy.monthJanuary(january)
        cy.depttime(deptTime)

        let general = 0;
        cy.get('td')
            .parent()
            .contains('1+1')
            .parent()
            .find('td')
            .last()
            .then(($span) => {
                general = parseFloat($span.text())
                cy.log('Total sum: ' + general)
            })

        let sumCells = 0;
        cy.get('td')
            .parent()
            .contains('1+1')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumCells += +el.text() || 0;
                cy.log('Total sum:' + sumCells);
            })
            .should(() => {
                expect(sumCells).to.be.within(general - 0.5, general + 0.5)
            })
    })

    it('January - Time - ВОЛЯ', function () {
        cy.monthJanuary(january)
        cy.depttime(deptTime)

        let general = 0;
        cy.get('td')
            .parent()
            .contains('1+1')
            .parent()
            .find('td')
            .last()
            .then(($span) => {
                general = parseFloat($span.text())
                cy.log('Total sum: ' + general)
            })

        let sumCells = 0;
        cy.get('td')
            .parent()
            .contains('1+1')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumCells += +el.text() || 0;
                cy.log('Total sum:' + sumCells);
            })
            .should(() => {
                expect(sumCells).to.be.within(general - 0.5, general + 0.5)
            })
    })

    it('Febraury - Money - Електролюкс', function () {
        cy.monthFebraury(febraury)
        cy.deptmoney(deptMoney)

        let general = 0;
        cy.get('td')
            .parent()
            .contains('Електролюкс')
            .parent()
            .find('td')
            .last()
            .then(($span) => {
                general = parseFloat($span.text())
                cy.log('General sum: ' + general)
            })

        let sumCells = 0;
        cy.get('td')
            .parent()
            .contains('Електролюкс')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumCells += +el.text() || 0;
                cy.log('Sum Cells: ' + sumCells);
            })
            .should(() => {
                expect(sumCells).to.be.within(general - 0.5, general + 0.5)
            })
    })

    it('Febraury - Money - Українська Академія Лідерства', function () {
        cy.monthFebraury(febraury)
        cy.deptmoney(deptMoney)

        let general = 0;
        cy.get('td')
            .parent()
            .contains('Українська Академія Лідерства')
            .parent()
            .find('td')
            .last()
            .then(($span) => {
                general = parseFloat($span.text())
                cy.log('General sum: ' + general)
            })

        let sumCells = 0;
        cy.get('td')
            .parent()
            .contains('Українська Академія Лідерства')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumCells += +el.text() || 0;
                cy.log('Sum Cells: ' + sumCells);
            })
            .should(() => {
                expect(sumCells).to.be.within(general - 0.5, general + 0.5)
            })
    })

    it('Febraury - Time - Нафтогаз', function () {
        cy.monthFebraury(febraury)
        cy.depttime(deptTime)

        let general = 0;
        cy.get('td')
            .parent()
            .contains('Нафтогаз')
            .parent()
            .find('td')
            .last()
            .then(($span) => {
                general = parseFloat($span.text())
                cy.log('General sum: ' + general)
            })

        let sumCells = 0;
        cy.get('td')
            .parent()
            .contains('Нафтогаз')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumCells += +el.text() || 0;
                cy.log('Sum Cells: ' + sumCells)
            })
            .should(() => {
                expect(sumCells).to.be.within(general - 0.5, general + 0.5)
            })
    })

    it('Febraury - Time - Сайт Л', function () {
        cy.monthFebraury(febraury)
        cy.depttime(deptTime)

        let general = 0;
        cy.get('td')
            .parent()
            .contains('Сайт Л')
            .parent()
            .find('td')
            .last()
            .then(($span) => {
                general = parseFloat($span.text())
                cy.log('General sum: ' + general)
            })

        let sumCells = 0;
        cy.get('td')
            .parent()
            .contains('Сайт Л')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumCells += +el.text() || 0;
                cy.log('Sum Cells: ' + sumCells)
            })
            .should(() => {
                expect(sumCells).to.be.within(general - 0.5, general + 0.5)
            })
    })

    it('March - Money - Китай', function () {
        cy.monthMarch(march)
        cy.deptmoney(deptMoney)

        let general = 0;
        cy.get('td')
            .parent()
            .contains('Китай')
            .parent()
            .find('td')
            .last()
            .then(($span) => {
                general = parseFloat($span.text())
                cy.log('General sum: ' + general)
            })

        let sumCells = 0;
        cy.get('td')
            .parent()
            .contains('Китай')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumCells += +el.text() || 0;
                cy.log('Sum Cells: ' + sumCells);
            })
            .should(() => {
                expect(sumCells).to.be.within(general - 0.5, general + 0.5)
            })
    })

    it('March - Money - ВОЛЯ', function () {
        cy.monthMarch(march)
        cy.deptmoney(deptMoney)

        let general = 0;
        cy.get('td')
            .parent()
            .contains('ВОЛЯ')
            .parent()
            .find('td')
            .last()
            .then(($span) => {
                general = parseFloat($span.text())
                cy.log('General sum: ' + general)
            })

        let sumCells = 0;
        cy.get('td')
            .parent()
            .contains('ВОЛЯ')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumCells += +el.text() || 0;
                cy.log('Sum Cells: ' + sumCells);
            })
            .should(() => {
                expect(sumCells).to.be.within(general - 0.5, general + 0.5)
            })
    })

    it('March - Time - Америка', function () {
        cy.monthMarch(march)
        cy.depttime(deptTime)

        let general = 0;
        cy.get('td')
            .parent()
            .contains('Америка')
            .parent()
            .find('td')
            .last()
            .then(($span) => {
                general = parseFloat($span.text())
                cy.log('General sum: ' + general)
            })

        let sumCells = 0;
        cy.get('td')
            .parent()
            .contains('Америка')
            .parent()
            .find('td')
            .not(':first')
            .not(':last')
            .each((el) => {
                sumCells += +el.text() || 0;
                cy.log('Sum Cells: ' + sumCells)
            })
            .should(() => {
                expect(sumCells).to.be.within(general - 0.5, general + 0.5)
            })
    })
})