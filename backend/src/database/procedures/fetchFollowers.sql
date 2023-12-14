CREATE OR ALTER PROCEDURE fetchFollowers
    @followed_user_id VARCHAR(255)
AS
BEGIN
    SELECT *
    FROM follower
    WHERE followed_user_id = @followed_user_id;
END
