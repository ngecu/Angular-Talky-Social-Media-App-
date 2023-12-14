CREATE OR ALTER PROCEDURE editComment
    @comment_id VARCHAR(500),
    @comment NVARCHAR(MAX),
    @comment_replied_to_id VARCHAR(500)
AS
BEGIN
    UPDATE comment
    SET
        comment = @comment,
        comment_replied_to_id = @comment_replied_to_id
    WHERE
        comment_id = @comment_id;
END;
