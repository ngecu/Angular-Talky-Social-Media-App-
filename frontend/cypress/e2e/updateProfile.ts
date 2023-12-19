describe('Update Profile Test Suite', () => {
    beforeEach(() => {
   
      cy.visit('http://localhost:4200/login');
    });
  
    it('should perform the update profile action successfully', () => {
      
    
      cy.get('[data-cy="email"]').type('wanjirubecky.rw@gmail.com');
      cy.get('[data-cy="password"]').type('3W!W.:srzc4r^!P');  
      
      cy.get('[data-cy="login-btn"]').click();
      cy.wait(2000);
      cy.location('pathname').should('eq', '/')

      cy.get('[data-cy="update-router-link"]').click();

      cy.location('pathname').should('eq', '/profile')
      
      cy.get('[data-cy="edit-profile-btn"]').click();

      cy.get('[data-cy="fullName"]').type('Rebecca Kariuki Test');
      cy.get('[data-cy="password"]').type('3W!W.:srzc4r^!P');  

  
    });

  });