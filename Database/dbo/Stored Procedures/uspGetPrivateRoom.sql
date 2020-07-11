CREATE PROCEDURE [dbo].[uspGetPrivateRoom]
	@UserId1 INT,
	@UserId2 INT
AS
BEGIN
	SET NOCOUNT ON

	IF NOT EXISTS (SELECT TOP 1 [Id] FROM [dbo].[Users] WHERE [Id] = @UserId2)
	BEGIN
		SET NOCOUNT OFF;
		THROW 50404, 'UserId2 doesn''t belong to an existing user.', 1;
	END

	DECLARE @Username1 NVARCHAR(30) = (SELECT [Username] FROM [dbo].[Users] WHERE [Id] = @UserId1)
	DECLARE @Username2 NVARCHAR(30) = (SELECT [Username] FROM [dbo].[Users] WHERE [Id] = @UserId2)

	DECLARE @roomId INT = (SELECT [RoomId] FROM [dbo].[UserRooms] WHERE [UserId] = @UserId1 AND [DisplayName] = @Username2)
	
	UPDATE [dbo].[UserRooms]
	SET [Active] = 1
	WHERE [UserId] = @UserId1 AND [DisplayName] = @Username2

	SELECT [Created], [RoomId] AS Id, [DisplayName]
			FROM [dbo].[vUserRooms]
			WHERE [UserId] = @UserId1 AND [RoomId] = @roomId

	SET NOCOUNT OFF
END
