CREATE OR ALTER PROCEDURE getUserById
	(@userID varchar(250))
as

set nocount on;

begin
	select	
    userID,
	email,
	fullname						
		
	from Users  where userID= @userID and isDeleted = 0;
end;
