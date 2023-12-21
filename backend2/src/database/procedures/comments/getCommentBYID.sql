CREATE OR ALTER PROCEDURE getAllComments
(
    @postID VARCHAR(255)
)
AS
SET NOCOUNT ON;
BEGIN
	SELECT 
    Comments.commentID, Comments.comment, 
    Comments.postID, Comments.userID, 
    Comments.isDeleted, Comments.created_at,
    Comments.parentCommentID,
    Users.fullname
    FROM Comments
    LEFT JOIN Users 
    ON Comments.userID = Users.userID 

    WHERE postID = @postID and Comments.isDeleted = 0
END
