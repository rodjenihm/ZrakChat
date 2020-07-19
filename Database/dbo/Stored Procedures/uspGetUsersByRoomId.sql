CREATE PROCEDURE [dbo].[uspGetUsersByRoomId]
	@RoomId INT
AS
BEGIN
	SET NOCOUNT ON

	SELECT
	u.[Id], u.[Username], u.[DisplayName], u.[LastSeen], ur.[LastMessageSeenId],
	(
		SELECT CASE WHEN uc.[ConnectionId] IS NOT NULL
			THEN CAST(1 AS BIT)
			ELSE CAST(0 AS BIT)
		END
	) AS IsConnected
	FROM [dbo].[vUsers] u
	INNER JOIN [dbo].[UserRooms] ur ON ur.UserId = u.Id
	LEFT JOIN [dbo].[UserConnections] uc ON uc.UserId = u.Id
	WHERE ur.[RoomId] = @RoomId

	SET NOCOUNT OFF
END