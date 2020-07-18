CREATE PROCEDURE [dbo].[uspCreatePrivateRoom]
	@UserId1 INT,
	@UserId2 INT,
	@Created DATETIME2(7)
AS
BEGIN
	SET NOCOUNT ON

	IF NOT EXISTS (SELECT TOP 1 [Id] FROM [dbo].[Users] WHERE [Id] = @UserId2)
	BEGIN
		SET NOCOUNT OFF;
		THROW 50404, 'UserId2 doesn''t belong to an existing user.', 1;
	END

	DECLARE @Username1 NVARCHAR(30) = (SELECT [Username] FROM [dbo].[Users] WHERE [Id] = @UserId1)
	DECLARE @Username2 NVARCHAR(30) = (SELECT [Username] FROM [dbo].[Users] WHERE [Id] = @UserId2)

	BEGIN TRANSACTION [Tran1]
		BEGIN TRY
			INSERT INTO [dbo].[Rooms] ([Created]) VALUES (@Created)
			DECLARE @roomId INT = SCOPE_IDENTITY()

			INSERT INTO [dbo].[UserRooms] 
			([UserId], [RoomId], [DisplayName], [Active])
			VALUES
			(@UserId1, @roomId, @Username2, 1),
			(@UserId2, @roomId, @Username1, 0)

			COMMIT TRANSACTION [Tran1]

			SELECT [Created], [RoomId] AS Id, [DisplayName]
			FROM [dbo].[vUserRooms]
			WHERE [UserId] = @UserId1 AND [RoomId] = @roomId

		END TRY
		BEGIN CATCH
			ROLLBACK TRANSACTION [Tran1]
			SET NOCOUNT OFF;
			THROW 50000, 'Error creating private room.', 1;
		END CATCH
	SET NOCOUNT OFF
END