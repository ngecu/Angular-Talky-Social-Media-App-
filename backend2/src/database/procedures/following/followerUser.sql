CREATE OR ALTER PROCEDURE followUser(
    @followerID VARCHAR(255),
    @following_userID VARCHAR(255),
    @followed_userID VARCHAR(255)
)
AS
BEGIN
    INSERT INTO Followers (followerID, following_userID, followed_userID)
    VALUES (@followerID, @following_userID,@followed_userID)
END