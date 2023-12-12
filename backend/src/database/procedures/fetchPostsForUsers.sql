CREATE TYPE dbo.UserIdsTableType AS TABLE
(
    UserId VARCHAR(500)
);

CREATE OR ALTER PROCEDURE fetchPostsForUsers
    @UserIds dbo.UserIdsTableType READONLY
AS
BEGIN
    SELECT p.*
    FROM Posts p
    INNER JOIN @UserIds u ON p.created_by_user_id = u.UserId;
END;
