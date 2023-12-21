describe('Login Test Suite', () => {
    beforeEach(() => {
   
      cy.visit('http://localhost:4200/forgotpwd');
    });
  
    it('should send reset token', () => {
      
    
      cy.get('[data-cy="email"]').type('devngecu@gmail.com');
    
      
      cy.get('[data-cy="send-btn"]').click();
      cy.wait(5000);
    //   cy.location('pathname').should('eq', '/')
      cy.contains('Success')

  
    });

    it('should send reset token', () => {
      
    
        cy.get('[data-cy="email"]').type('wrongpassword@gmail.com');
      
        
        cy.get('[data-cy="send-btn"]').click();
        cy.wait(5000);
      //   cy.location('pathname').should('eq', '/')
        cy.contains('Error')
  
    
      });

  });