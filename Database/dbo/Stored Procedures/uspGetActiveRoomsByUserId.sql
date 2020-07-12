CREATE PROCEDURE [dbo].[uspGetActiveRoomsByUserId]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON
	
	SELECT aur.[Created], aur.[RoomId] AS Id, aur.[DisplayName], m.[Created] AS Sent, m.[Id], m.[Text], u.[Username]
			FROM [dbo].[vActiveUserRooms] aur
			INNER JOIN [dbo].[Rooms] r ON r.Id = aur.RoomId
			LEFT JOIN [dbo].[Messages] m ON m.Id = r.MessageId
			LEFT JOIN [dbo].[Users] u ON u.Id = m.UserId
			WHERE aur.[UserId] = @UserId
			ORDER BY m.[Created] DESC

	SET NOCOUNT OFF
END
