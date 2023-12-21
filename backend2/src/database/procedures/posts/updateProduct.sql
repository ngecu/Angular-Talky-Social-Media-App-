CREATE OR ALTER PROCEDURE updatePost
	(
    @postID VARCHAR(255),
    @userID VARCHAR (255),
    @postContent VARCHAR(4000),
    @imageUrl VARCHAR(255)
	)
as

SET NOCOUNT ON;

BEGIN
	UPDATE Posts
	SET 
	
      postContent = @postContent,
      imageUrl = @imageUrl
	
	WHERE postID= @postID AND userID = @userID ;
END;