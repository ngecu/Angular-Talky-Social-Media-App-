CREATE or alter PROCEDURE getPosts
	
as

set nocount on;

begin
	SELECT 
        *
    FROM Posts
    WHERE isDeleted = 0
   
end;









-- CREATE or alter PROCEDURE getPosts
	
-- as

-- set nocount on;

-- begin
-- 	SELECT 
--         Posts.postId, Posts.imageUrl,
--         Posts.postContent, Posts.userID,
--         Posts.isDeleted, Posts.created_at,
--         Users.fullname
--     FROM Posts
--     LEFT JOIN Users 
--     ON Posts.userID = Users.userID
--     WHERE Posts.isDeleted = 0
   
-- end;