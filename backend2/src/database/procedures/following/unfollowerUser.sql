CREATE OR ALTER PROCEDURE unfollowUser(
    @following_userID VARCHAR(255),
    @followed_userID VARCHAR(255)
)
AS
BEGIN
    DELETE FROM Followers
    WHERE following_userID = @following_userID
    AND followed_userID = @followed_userID;
END