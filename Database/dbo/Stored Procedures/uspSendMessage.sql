CREATE PROCEDURE [dbo].[uspSendMessage]
	@UserId INT,
	@RoomId INT,
	@Text NVARCHAR(255)
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

	BEGIN TRANSACTION [Tran1]
		BEGIN TRY
			INSERT INTO [dbo].[Messages]
			([UserId], [RoomId], [Text])
			VALUES
			(@UserId, @RoomId, @Text)

			DECLARE @messageId INT = SCOPE_IDENTITY()

			UPDATE [dbo].[Rooms]	
			SET [MessageId] = @messageId
			WHERE [Id] = @RoomId

			UPDATE [dbo].[UserRooms]
			SET [Active] = 1
			WHERE [RoomId] = @RoomId AND [Active] = 0

			COMMIT TRANSACTION [Tran1]
		END TRY
		BEGIN CATCH
			ROLLBACK TRANSACTION [Tran1]
			SET NOCOUNT OFF;
			THROW 50000, 'Error sending message.', 1;
		END CATCH

	SET NOCOUNT OFF
END