CREATE OR ALTER  PROCEDURE forgotPassword
	(@userID varchar(100))
as

set nocount on;

begin
	UPDATE Users
	SET 
	resetPassword = 1
	WHERE userID = @userID AND resetPassword = 0;
end;