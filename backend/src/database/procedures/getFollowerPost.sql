CREATE OR ALTER PROCEDURE getFollowerPost
    @user_id VARCHAR(500)
AS
BEGIN
    SELECT
        p.*,
        pm.post_media_id,
        pm.media_file
    FROM
        post p
    INNER JOIN
        post_media pm ON p.post_id = pm.post_id
    WHERE
        p.created_by_user_id = @user_id;
END;
