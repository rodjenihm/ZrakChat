CREATE PROCEDURE [dbo].[uspUpdateUserLastSeen]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON

	IF NOT EXISTS (SELECT TOP 1 [Id] FROM [dbo].[Users] WHERE [Id] = @UserId)
	BEGIN
		SET NOCOUNT OFF;
		THROW 50404, 'UserId doesn''t belong to an existing user.', 1;
	END

	UPDATE [dbo].[Users]
	SET [LastSeen] = GETDATE()
	WHERE [Id] = @UserId

	SET NOCOUNT OFF
END