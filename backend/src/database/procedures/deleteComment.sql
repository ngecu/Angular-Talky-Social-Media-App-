CREATE OR ALTER PROCEDURE deleteComment
    @comment_id VARCHAR(500)
AS
BEGIN
    BEGIN TRY
        -- Delete replies to the specified comment
        DELETE FROM comment
        WHERE comment_replied_to_id = @comment_id;

        -- Delete the specified comment
        DELETE FROM comment
        WHERE comment_id = @comment_id;

        -- Return success
        SELECT 1 AS success;
    END TRY
    BEGIN CATCH
        -- Return error message
        SELECT ERROR_MESSAGE() AS errorMessage;
    END CATCH
END;
