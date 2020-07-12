CREATE PROCEDURE [dbo].[uspGetMessagesByRoomIdForUserId]
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

	IF NOT EXISTS (SELECT TOP 1 [UserId] FROM [dbo].[UserRooms] WHERE [UserId] = @UserId AND [RoomId] = @RoomId)
	BEGIN
		SET NOCOUNT OFF;
		THROW 50001, 'UserId is not member of RoomId.', 1;
	END

	SELECT
	m.[Created] AS Sent, m.[Id], m.[Text], u.[Username]
	FROM [dbo].[Messages] m
	INNER JOIN [dbo].[Users] u ON u.Id = m.UserId
	WHERE m.[RoomId] = @RoomId
	ORDER BY m.[Created]

	SET NOCOUNT OFF
END