CREATE OR ALTER PROCEDURE registerToken(
    @user_id VARCHAR(500),
    @token_id VARCHAR(500),
    @token VARCHAR(500),
)
AS
BEGIN
    DECLARE @existing_token_count INT;

    -- Check if the user already has a token
    SELECT @existing_token_count = COUNT(*)
    FROM token
    WHERE user_id = @user_id;

    IF @existing_token_count = 0
    BEGIN
        -- If no token exists, insert a new record
        INSERT INTO token (token_id, user_id, token)
        VALUES (@token_id, @user_id, @token);
    END
END;
