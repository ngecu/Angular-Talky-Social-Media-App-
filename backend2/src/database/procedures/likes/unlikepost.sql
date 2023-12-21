CREATE OR ALTER PROCEDURE unLikePost
    @userID VARCHAR(255),
    @postID VARCHAR(255)
AS
BEGIN
    DELETE FROM likes
    WHERE userID = @userID AND postID = @postID ;
END;