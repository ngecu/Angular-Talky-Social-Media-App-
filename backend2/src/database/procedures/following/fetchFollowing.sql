CREATE OR ALTER PROCEDURE fetchFollowings
    @following_userID VARCHAR(255)
AS
BEGIN
    SELECT followers.followed_userID,
    Users.fullname, Users.profileUrl
    FROM Followers
    LEFT JOIN Users 
    ON followers.followed_userID = Users.userID
   
    WHERE following_userID = @following_userID
    
END