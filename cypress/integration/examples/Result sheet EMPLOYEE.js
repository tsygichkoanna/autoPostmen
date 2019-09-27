const autoAdmin = "";

describe('Count sum Money and Time EMPLOYEE', function () {

  beforeEach(() => {
    cy.authorizationAdmin(autoAdmin)

    cy.get('.main-sidebar')
      .contains('Результуючі листи')
      .click()

  })

  // Sum time

  it('Sum time January', function () {
    cy.get('.month-picker')
      .click()
      .find('[data-id = "0:1"]')
      .click()

    cy.get(':nth-child(5) > .Select > .Select-control > .Select-arrow-zone')
      .click()

    cy.get('#react-select-5--option-0')
      .click()
      .wait(2000)

    let sumTime = 0;

    cy.get(':nth-child(29) > [style="width: 66px;"]')
      .parent()
      .find('td')
      .not(':first')
      .not(':last')
      .each((el) => {
        sumTime += +el.text() || 0;
      })
      .should(() => {
        expect(sumTime).to.equal(5466.1)
      })
  })

  it('Sum time February', function () {
    cy.get('.month-picker')
      .click()
      .find('[data-id = "0:2"]')
      .click()

    cy.get(':nth-child(5) > .Select > .Select-control > .Select-arrow-zone')
      .click()

    cy.get('#react-select-5--option-0')
      .click()
      .wait(2000)

    let sumTime = 0;

    cy.get(':nth-child(34) > [style="width: 66px;"]')
      .parent()
      .find('td')
      .not(':first')
      .not(':last')
      .each((el) => {
        sumTime += +el.text() || 0;
      })
      .should(() => {
        expect(sumTime).to.equal(5106.6)
      })
  })

  it('Sum time March', function () {
    cy.get('.month-picker')
      .click()
      .find('[data-id = "0:3"]')
      .click()

    cy.get(':nth-child(5) > .Select > .Select-control > .Select-arrow-zone')
      .click()

    cy.get('#react-select-5--option-0')
      .click()
      .wait(2000)

    let sumTime = 0;

    cy.get(':nth-child(9) > [style="width: 66px;"]')
      .parent()
      .find('td')
      .not(':first')
      .not(':last')
      .each((el) => {
        sumTime += +el.text() || 0;
        cy.log('Total sum:' + sumTime);
      })
      .should(() => {
        expect(sumTime).to.equal(438)
      })
  })

  // Sum money

  it('Sum money January', function () {
    cy.get('.month-picker')
      .click()
      .find('[data-id = "0:1"]')
      .click()

    cy.get(':nth-child(4) > .Select > .Select-control > .Select-arrow-zone')
      .click()

    cy.get('#react-select-4--option-1')
      .click()
      .wait(2000)

    cy.get(':nth-child(5) > .Select > .Select-control > .Select-arrow-zone')
      .click()

    cy.get('#react-select-5--option-0')
      .click()
      .wait(2000)

    let sumMoney = 0;

    cy.get(':nth-child(27) > [style="width: 66px;"]')
      .parent()
      .find('td')
      .not(':first')
      .not(':last')
      .each((el) => {
        sumMoney += +el.text() || 0;
        cy.log('Total sum: ' + sumMoney);
      })
      .should(() => {
        expect(sumMoney).to.equal(1028563
          )
      })
  })

  it('Sum money February', function () {
    cy.get('.month-picker')
      .click()
      .find('[data-id = "0:2"]')
      .click()

    cy.get(':nth-child(4) > .Select > .Select-control > .Select-arrow-zone')
      .click()

    cy.get('#react-select-4--option-1')
      .click()
      .wait(2000)

    cy.get(':nth-child(5) > .Select > .Select-control > .Select-arrow-zone')
      .click()

    cy.get('#react-select-5--option-0')
      .click()
      .wait(2000)

    let sumMoney = 0;

    cy.get(':nth-child(32) > [style="width: 66px;"]')
      .parent()
      .find('td')
      .not(':first')
      .not(':last')
      .each((el) => {
        sumMoney += +el.text() || 0;
        cy.log('Total sum: ' + sumMoney);
      })
      .should(() => {
        expect(sumMoney).to.equal(1073570)
      })

  })

  it('Sum money March', function () {
    cy.get('.month-picker')
      .click()
      .find('[data-id = "0:3"]')
      .click()

    cy.get(':nth-child(4) > .Select > .Select-control > .Select-arrow-zone')
      .click()

    cy.get('#react-select-4--option-1')
      .click()
      .wait(2000)

    cy.get(':nth-child(5) > .Select > .Select-control > .Select-arrow-zone')
      .click()

    cy.get('#react-select-5--option-0')
      .click()
      .wait(2000)

    let sumMoney = 0;

    cy.get(':nth-child(7) > [style="width: 66px;"]')
      .parent()
      .find('td')
      .not(':first')
      .not(':last')
      .each((el) => {
        sumMoney += +el.text() || 0;
        cy.log('Total sum:' + sumMoney);
      })
      .should(() => {
        expect(sumMoney).to.equal(1073570)
      })
  })

})
