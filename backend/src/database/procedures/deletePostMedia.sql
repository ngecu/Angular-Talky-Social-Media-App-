CREATE OR ALTER PROCEDURE deletePostMedia
    @post_id VARCHAR(500)
AS
BEGIN
    DELETE FROM post_media
    WHERE post_id = @post_id;
END;
