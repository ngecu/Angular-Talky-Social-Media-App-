CREATE OR ALTER PROCEDURE getPostsByUser
    @user_id VARCHAR(500)
AS
BEGIN
    -- Check if the user_id is not empty
    IF @user_id IS NOT NULL AND LTRIM(RTRIM(@user_id)) <> ''
    BEGIN
        SELECT * FROM post
        WHERE created_by_user_id = @user_id;
    END
    ELSE
    BEGIN
        -- Return an empty result set if user_id is empty
        SELECT TOP 0 * FROM posts;
    END
END;
