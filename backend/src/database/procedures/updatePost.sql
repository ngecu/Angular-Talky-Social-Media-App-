CREATE OR ALTER PROCEDURE updatePost
    @post_id VARCHAR(500),
    @caption VARCHAR(MAX)
AS
BEGIN
    UPDATE post
    SET
        caption = @caption
    WHERE post_id = @post_id;
END;