CREATE VIEW [dbo].[vActiveUserRooms]
	AS 
		(
			SELECT
			ur.[Created], ur.[RoomId], ur.[DisplayName], ur.[Active], ur.[UserId]
			FROM [dbo].[UserRooms] ur
			INNER JOIN [dbo].[Users] u ON u.Id = ur.UserId
			WHERE ur.[Active] = 1
		)
