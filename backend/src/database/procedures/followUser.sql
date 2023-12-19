CREATE OR ALTER PROCEDURE followUser(
    @follower_id VARCHAR(500),
    @following_user_id VARCHAR(500),
    @followed_user_id VARCHAR(255)
)
AS
BEGIN
    INSERT INTO follower (follower_id, following_user_id,followed_user_id)
    VALUES (@follower_id, @following_user_id,@followed_user_id)
END
