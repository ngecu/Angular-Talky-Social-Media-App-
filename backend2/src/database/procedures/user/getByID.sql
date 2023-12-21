CREATE OR ALTER PROCEDURE getById
	(@userID varchar(255))
as

set nocount on;

begin
	SELECT * FROM Users WHERE userID = @userID AND isDeleted  = 0						
end;
