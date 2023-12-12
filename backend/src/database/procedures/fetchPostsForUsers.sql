CREATE TYPE dbo.UserIdsTableType AS TABLE
(
    UserId VARCHAR(500)
);


CREATE OR ALTER PROCEDURE fetchPostsForUsers
    @UserIds dbo.UserIdsTableType READONLY
AS
BEGIN
    SELECT
        p.*,
        pm.post_media_id,
        pm.media_file
    FROM
        Posts p
    INNER JOIN
        @UserIds u ON p.created_by_user_id = u.UserId
    LEFT JOIN
        post_media pm ON p.post_id = pm.post_id;
END;
