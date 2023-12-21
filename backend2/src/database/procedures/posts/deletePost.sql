CREATE OR ALTER  PROCEDURE deletePost
	@postID varchar(255)
AS

SET NOCOUNT ON

BEGIN
	UPDATE Posts
	SET isDeleted = 1
	
	WHERE postID = @postID AND isDeleted = 0;
END;
