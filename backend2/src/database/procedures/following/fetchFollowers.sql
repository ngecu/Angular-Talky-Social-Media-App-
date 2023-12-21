CREATE OR ALTER PROCEDURE fetchFollowers
    @followed_userID VARCHAR(255)
AS
BEGIN
    -- SELECT followerID
    -- FROM Followers
    -- WHERE followed_userID = @followed_userID
    SELECT followers.following_userID,
    Users.fullname, Users.profileUrl
    FROM Followers
    LEFT JOIN Users 
    ON followers.following_userID = Users.userID
   
    WHERE followed_userID = @followed_userID
END