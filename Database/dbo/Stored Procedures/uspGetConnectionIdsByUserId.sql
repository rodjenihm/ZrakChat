CREATE PROCEDURE [dbo].[uspGetConnectionIdsByUserId]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON

	IF NOT EXISTS (SELECT TOP 1 [Id] FROM [dbo].[Users] WHERE [Id] = @UserId)
	BEGIN
		SET NOCOUNT OFF;
		THROW 50404, 'UserId doesn''t belong to an existing user.', 1;
	END

	SELECT [ConnectionId] FROM [dbo].[UserConnections]
	WHERE [UserId] = @UserId

	SET NOCOUNT OFF;
END
