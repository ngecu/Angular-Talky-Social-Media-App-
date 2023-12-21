CREATE OR ALTER PROCEDURE likePost
    @likeID VARCHAR(255),
    @userID VARCHAR(255),
    @postID VARCHAR(255)
AS
BEGIN
    INSERT INTO likes (likeID, userID, postID)
    VALUES (@likeID, @userID, @postID);
END;