CREATE OR ALTER PROCEDURE fetchAllPosts
AS
BEGIN
    SELECT
        p.post_id,
        p.created_by_user_id,
        u.username AS creator_username, -- Assuming there's a 'username' column in the 'users' table
		 u.profileImage ,
        p.caption,
        p.postType,
        p.created_at
    FROM
        post p
    INNER JOIN
        users u ON p.created_by_user_id = u.user_id;
END
