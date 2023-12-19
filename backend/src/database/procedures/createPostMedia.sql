
CREATE OR ALTER PROCEDURE createPostMedia(
    @post_media_id VARCHAR(500),
    @post_id VARCHAR(500),
    @media_file VARCHAR(500)
)
AS
BEGIN
    INSERT INTO post_media (post_media_id,post_id, media_file)
    VALUES (@post_media_id,@post_id, @media_file )
END