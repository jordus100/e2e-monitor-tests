describe('Test Google social login on smartdust.me', () => {
  it('opens Wordpress login page', () => {
    cy.visit('https://smartdust.me/wp-login.php')
    cy.get('.login-button').click()
    cy.origin('https://accounts.google.com', () => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        // prevents Cypress from failing the test after a thrown exception
        return false
      })
      cy.get('input[type="email"]').type(Cypress.env('GOOGLE_LOGIN'))
      cy.contains('Next').click()
      cy.get('input[type="password"]').type(Cypress.env('GOOGLE_PASSWORD'))
      cy.contains('Next').click()
    })
    // wait for redirect back to the site
    cy.url().should('include', 'https://smartdust.me/')
    // check if the login was successful
    cy.visit('https://smartdust.me/shop/my-account/')
    // check if contains the user's name
    cy.contains(Cypress.env('WP_USERNAME'))
  })
})