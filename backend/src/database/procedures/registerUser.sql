CREATE OR ALTER PROCEDURE registerUser(
    @user_id VARCHAR(500),
    @profileImage VARCHAR(500),
    @fullName VARCHAR(255),
    @email VARCHAR(255),
    @password VARCHAR(255),
    @username VARCHAR(255),
    @phone_no VARCHAR(20)
)
AS
BEGIN
    INSERT INTO users (user_id, profileImage, fullName, email, password, username, phone_no )
    VALUES (@user_id, @profileImage, @fullName, @email, @password, @username, @phone_no)
END
