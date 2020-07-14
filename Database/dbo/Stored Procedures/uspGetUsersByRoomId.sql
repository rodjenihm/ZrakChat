CREATE PROCEDURE [dbo].[uspGetUsersByRoomId]
	@RoomId INT
AS
BEGIN
	SET NOCOUNT ON

	SELECT
	u.[Id], u.[Username], u.[DisplayName]
	FROM [dbo].[vUsers] u
	INNER JOIN [dbo].[UserRooms] ur ON ur.UserId = u.Id
	WHERE ur.[RoomId] = @RoomId

	SET NOCOUNT OFF
END