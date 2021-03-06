﻿CREATE PROCEDURE [dbo].[uspCreateConnection]
	@UserId INT,
	@Username NVARCHAR(30),
	@ConnectionId NVARCHAR(38),
	@Created DATETIME2(7)
AS
BEGIN
	SET NOCOUNT ON

	IF NOT EXISTS (SELECT TOP 1 [Id] FROM [dbo].[Users] WHERE [Id] = @UserId)
	BEGIN
		SET NOCOUNT OFF;
		THROW 50404, 'UserId doesn''t belong to an existing user.', 1;
	END

	INSERT INTO [dbo].[UserConnections] 
	([UserId], [Username], [ConnectionId], [Created])
	VALUES
	(@UserId, @Username, @ConnectionId, @Created)

	SET NOCOUNT OFF;
END