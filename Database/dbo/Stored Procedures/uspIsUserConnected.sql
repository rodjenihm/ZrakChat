﻿CREATE PROCEDURE [dbo].[uspIsUserConnected]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON
	
	SELECT CASE WHEN EXISTS (SELECT TOP 1 [UserId] FROM [dbo].[UserConnections] WHERE [UserId] = @UserId)
		THEN CAST(1 AS BIT)
		ELSE CAST(0 AS BIT)
	END

	SET NOCOUNT OFF
END