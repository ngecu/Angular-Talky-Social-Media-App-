CREATE OR ALTER PROCEDURE fetchFollowings
    @following_user_id VARCHAR(255)
AS
BEGIN
    SELECT *
    FROM follower
    WHERE following_user_id = @following_user_id;
END
