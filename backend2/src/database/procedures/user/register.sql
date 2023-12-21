-- SELECT * from Users

CREATE OR ALTER PROCEDURE registerUser(
    @userID varchar(100),
    @username varchar(200),
    @fullname varchar(200),
    @email VARCHAR(300),
    @password VARCHAR(200)
)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Users WHERE email = @email)
        BEGIN
            INSERT INTO Users (userID, username, fullname, email, password)
            VALUES (@userID, @userName, @fullname, @email, @password)
        END
    ELSE
        BEGIN
            PRINT 'Email already exists. User not registered.'
        END
END

DROP PROCEDURE registerUser