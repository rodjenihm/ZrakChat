CREATE PROCEDURE [dbo].[uspSetLastSeenMessageByRoomIdForUserId]
	@UserId INT,
	@RoomId INT,
	@MessageId INT
AS
BEGIN
	SET NOCOUNT ON

	IF NOT EXISTS (SELECT TOP 1 [Id] FROM [dbo].[Rooms] WHERE [Id] = @RoomId)
	BEGIN
		SET NOCOUNT OFF;
		THROW 50404, 'RoomId doesn''t exist.', 1;
	END

	IF NOT EXISTS (SELECT TOP 1 [UserId] FROM [dbo].[UserRooms] WHERE [UserId] = @UserId AND [RoomId] = @RoomId)
	BEGIN
		SET NOCOUNT OFF;
		THROW 50001, 'UserId is not member of RoomId.', 1;
	END

	UPDATE [dbo].[UserRooms]
	SET [LastMessageSeenId] = @MessageId
	WHERE [UserId] = @UserId AND [RoomId] = @RoomId

	SET NOCOUNT OFF
END
