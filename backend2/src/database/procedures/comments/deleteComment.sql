CREATE OR ALTER  PROCEDURE deleteComment
	@commentID varchar(255)
AS

SET NOCOUNT ON

BEGIN
	UPDATE Comments
	SET isDeleted = 1
	
	WHERE commentID = @commentID AND isDeleted = 0
END;
