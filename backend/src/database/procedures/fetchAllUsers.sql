CREATE OR ALTER PROCEDURE fetchAllUsers
AS
BEGIN
    SELECT * FROM user WHERE active != 0
END