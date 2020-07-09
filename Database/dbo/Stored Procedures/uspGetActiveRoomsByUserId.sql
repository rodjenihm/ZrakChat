CREATE PROCEDURE [dbo].[uspGetActiveRoomsByUserId]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON
	
	SELECT [Created], [RoomId] AS Id, [DisplayName]
			FROM [dbo].[vActiveUserRooms]
			WHERE [UserId] = @UserId

	SET NOCOUNT OFF
END
