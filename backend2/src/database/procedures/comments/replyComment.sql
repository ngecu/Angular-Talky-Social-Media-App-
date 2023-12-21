CREATE OR ALTER PROCEDURE createReplyComment
(   @postID varchar(255) ,
	@comment varchar(255) ,	
	@commentID varchar(255),
    @userID VARCHAR (255),
    @parentCommentID VARCHAR (255)    
)
    
AS

BEGIN
    set nocount on;

    INSERT INTO Comments (postID, comment, commentID, userID, parentCommentID)
    VALUES (@postID, @comment, @commentID, @userID, @parentCommentID)
END

DROP PROCEDURE createReplyComment