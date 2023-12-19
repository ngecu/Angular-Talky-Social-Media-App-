CREATE OR ALTER PROCEDURE loginUser(@email VARCHAR(255), @password VARCHAR(255))
AS
BEGIN

    SELECT * FROM users WHERE fullName= @email OR email=@email OR username = @email OR phone_no = @email AND active = 1
 
END