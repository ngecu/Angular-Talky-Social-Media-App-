describe('Login Test Suite', () => {
    beforeEach(() => {
   
      cy.visit('http://localhost:4200/login');
    });
  
    it('should perform the login action successfully', () => {
      
    
      cy.get('[data-cy="email"]').type('caleb');
      cy.get('[data-cy="password"]').type('12345678');  
      
      cy.get('[data-cy="login-btn"]').click();
      cy.wait(2000);
      cy.location('pathname').should('eq', '/')
  
    });
})
