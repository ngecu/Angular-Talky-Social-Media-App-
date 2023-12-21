CREATE OR ALTER PROCEDURE updateComment
	(
    @postID VARCHAR(255),
    @userID VARCHAR (255),
    @comment VARCHAR(255),
    @commentID VARCHAR(255)
	)
as

SET NOCOUNT ON;

BEGIN
	UPDATE Comments
	SET 
      comment = @comment
	
	WHERE postID= @postID AND userID = @userID AND commentID = @commentID;
END;