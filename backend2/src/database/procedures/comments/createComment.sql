CREATE OR ALTER PROCEDURE createComment
(   @postID varchar(255) ,
	@comment varchar(255) ,	
	@commentID varchar(255),
    @userID VARCHAR (255)   
)
    
AS

BEGIN
    set nocount on;

    INSERT INTO Comments (postID, comment, commentID, userID)
    VALUES (@postID, @comment, @commentID, @userID)
END

DROP PROCEDURE createComment