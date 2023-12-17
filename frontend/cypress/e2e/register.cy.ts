describe('Registration Test Suites', () => {
  beforeEach(() => {
 
    cy.visit('http://localhost:4200/signup');
  });

  it('should perform the registration actions', () => {
    

    const imagePath = 'GBg3GykWEAAHPjW.jpg';


    cy.fixture(imagePath).then((fileContent) => {
      cy.get('[data-cy="profilepic"]').attachFile(
        { fileContent, fileName: 'image.jpg', mimeType: 'image/jpeg' },
        { subjectType: 'drag-n-drop' }
      );
    });

    
    cy.get('[data-cy="phone_no"]').type('0707583092');
    cy.get('[data-cy="fullName"]').type('Robinson Ngecu');
    cy.get('[data-cy="username"]').type('devngecu');
    cy.get('[data-cy="email"]').type('devngecu@gmail.com');
    cy.get('[data-cy="password"]').type('your_password');
    cy.get('[data-cy="confirmPassword"]').type('your_password');

    
    cy.get('[data-cy="reg-btn"]').click();

    

    // Add any assertions if needed
  });
});