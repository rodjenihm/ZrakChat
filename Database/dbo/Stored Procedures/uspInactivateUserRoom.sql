CREATE PROCEDURE [dbo].[uspInactivateUserRoom]
	@UserId INT,
	@RoomId INT
AS
BEGIN
	SET NOCOUNT ON

	IF NOT EXISTS (SELECT TOP 1 [Id] FROM [dbo].[Rooms] WHERE [Id] = @RoomId)
	BEGIN
		SET NOCOUNT OFF;
		THROW 50404, 'RoomId doesn''t exist.', 1;
	END

	UPDATE [dbo].[UserRooms]
	SET [Active] = 0
	WHERE [UserId] = @UserId AND @RoomId = @RoomId

	SET NOCOUNT OFF
END