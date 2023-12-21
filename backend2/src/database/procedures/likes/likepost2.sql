CREATE OR ALTER PROCEDURE likePost2
    @likeID VARCHAR(255),
    @userID VARCHAR(255),
    @postID VARCHAR(255)
AS
BEGIN
    BEGIN TRY
        -- Check if the like already exists
        IF NOT EXISTS (SELECT 1 FROM likes WHERE userID = @userID AND postID = @postID)
        BEGIN
            -- Insert new like
            INSERT INTO likes (likeID, userID, postID, likeCount, created_at)
            VALUES (@likeID, @userID, @postID, 1, CURRENT_TIMESTAMP);
            
            -- Return success
            SELECT 1 AS Success;
        END
        ELSE
        BEGIN
            -- Like already exists, return failure
            SELECT 0 AS Success;
        END
    END TRY
    BEGIN CATCH
        -- Return failure on error
        SELECT 0 AS Success;
    END CATCH
END;