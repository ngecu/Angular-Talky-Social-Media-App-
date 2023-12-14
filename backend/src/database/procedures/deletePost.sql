CREATE OR ALTER PROCEDURE deletePost
    @post_id VARCHAR(500)
AS
BEGIN
    DELETE FROM comment WHERE post_id = @post_id;
    DELETE FROM post_user_tag WHERE post_id = @post_id;
    DELETE FROM post_media WHERE post_id = @post_id;
    DELETE FROM post WHERE post_id = @post_id;
END;
