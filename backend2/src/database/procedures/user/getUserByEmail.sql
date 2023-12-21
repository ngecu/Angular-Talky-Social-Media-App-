CREATE OR ALTER PROCEDURE getUserByEmail
	(@email varchar(250))
as

begin
	select	
        userID ,
        username,
        fullname,
        email,
        password
	FROM Users  WHERE email = @email AND isDeleted = 0;
end;