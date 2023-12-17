CREATE OR ALTER PROCEDURE GetFollowSuggestions
    @user_id VARCHAR(500)
AS
BEGIN
    SELECT TOP 5 u.*
    FROM users u
    WHERE u.user_id NOT IN (
        SELECT f.followed_user_id
        FROM follower f
        WHERE f.following_user_id = @user_id
    )
    AND u.user_id != @user_id
    -- Add more conditions for suggestions based on common interests, etc.
    ORDER BY NEWID(); -- Random order to provide variety in suggestions
END;
