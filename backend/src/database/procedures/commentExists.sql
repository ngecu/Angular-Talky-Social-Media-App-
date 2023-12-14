CREATE OR ALTER PROCEDURE commentExists(@comment_replied_to_id VARCHAR(500))
AS
BEGIN

    SELECT * FROM comment WHERE comment_replied_to_id= @comment_replied_to_id

END