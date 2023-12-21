CREATE OR ALTER PROCEDURE createPost
(   @postID varchar(255) ,
	@postContent varchar(4000) ,	
	@imageUrl varchar(255),
    @userID VARCHAR (255)   
)
    
AS

BEGIN
    set nocount on;

    INSERT INTO Posts (postID, postContent, imageUrl, userID)
    VALUES (@postID, @postContent, @imageUrl, @userID)
END

DROP PROCEDURE createPost