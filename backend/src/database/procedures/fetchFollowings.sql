CREATE OR ALTER PROCEDURE fetchFollowings
    @following_user_id VARCHAR(255)
AS
BEGIN
    SELECT followed_user_id, created_at
    FROM follower
    WHERE follower_id = @following_user_id;
END
