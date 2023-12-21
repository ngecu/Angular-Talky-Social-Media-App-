CREATE OR ALTER PROCEDURE unLikePost2
    @userID VARCHAR(255),
    @postID VARCHAR(255)
AS
BEGIN
    BEGIN TRY
        -- Check if the like exists
        IF EXISTS (SELECT 1 FROM likes WHERE userID = @userID AND postID = @postID)
        BEGIN
            -- Delete the like
            DELETE FROM likes WHERE userID = @userID AND postID = @postID;

            -- Decrement the likeCount by 1
            UPDATE likes
            SET likeCount = ISNULL(likeCount, 0) - 1
            WHERE userID = @userID AND postID = @postID;

            -- Return success
            SELECT 1 AS Success;
        END
        ELSE
        BEGIN
            -- Like doesn't exist, return failure
            SELECT 0 AS Success;
        END
    END TRY
    BEGIN CATCH
        -- Return failure on error
        SELECT 0 AS Success;
    END CATCH
END;
