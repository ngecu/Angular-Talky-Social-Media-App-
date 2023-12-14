CREATE OR ALTER PROCEDURE toggleSoftDeleteUser
    @user_id VARCHAR(500),
    @active INT
AS
BEGIN
    UPDATE users
    SET active = @active
    WHERE user_id = @user_id;
END;
