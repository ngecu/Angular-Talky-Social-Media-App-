CREATE OR ALTER PROCEDURE fetchCommentsByPostId
    @post_id VARCHAR(500)
AS
BEGIN
    -- Fetch top-level comments
    SELECT
        comment_id,
        created_by_user_id AS comment_created_by_user_id,
        post_id AS comment_post_id,
        comment,
        comment_replied_to_id,
        created_at AS comment_created_at
    FROM
        comment
    WHERE
        post_id = @post_id AND comment_replied_to_id IS NULL;

    -- Fetch sub-comments
    SELECT
        comment_id,
        created_by_user_id AS comment_created_by_user_id,
        post_id AS comment_post_id,
        comment,
        comment_replied_to_id,
        created_at AS comment_created_at
    FROM
        comment
    WHERE
        post_id = @post_id AND comment_replied_to_id IS NOT NULL;
END
