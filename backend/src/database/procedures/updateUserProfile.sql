CREATE OR ALTER PROCEDURE updateUserProfile
    @user_id VARCHAR(500),
    @profileImage VARCHAR(500),
    @fullName VARCHAR(255),
    @username VARCHAR(255),
    @phone_no VARCHAR(20)
AS
BEGIN
    UPDATE users
    SET
        profileImage = @profileImage,
        fullName = @fullName,
        username = @username,
        phone_no = @phone_no
    WHERE user_id = @user_id;
END;
