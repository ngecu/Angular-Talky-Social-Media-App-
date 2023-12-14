CREATE OR ALTER PROCEDURE likePost
    @reaction_id VARCHAR(500),
    @user_id VARCHAR(500),
    @post_id VARCHAR(500),
    @created_at DATETIME
AS
BEGIN
    INSERT INTO reaction (reaction_id, user_id, post_id, created_at)
    VALUES (@reaction_id, @user_id, @post_id,  @created_at);
END;
