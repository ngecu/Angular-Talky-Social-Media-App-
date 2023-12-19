CREATE OR ALTER PROCEDURE createPost(
    @post_id VARCHAR(500),
    @created_by_user_id VARCHAR(500),
    @caption VARCHAR(255),
    @postType VARCHAR(255)
)
AS
BEGIN
    INSERT INTO post (post_id, created_by_user_id, caption, postType)
    VALUES (@post_id, @created_by_user_id, @caption, @postType)
END
