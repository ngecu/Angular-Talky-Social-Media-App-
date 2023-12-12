CREATE OR ALTER PROCEDURE loginUser(@email VARCHAR(255), @password VARCHAR(255))
AS
BEGIN

    SELECT * FROM user WHERE name= @email OR email=@email OR username = @email OR phone_no = @email

END