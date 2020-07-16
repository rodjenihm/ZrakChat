CREATE PROCEDURE [dbo].[uspCreateGroupRoom]
	@UserId INT,
	@DisplayName NVARCHAR(30),
	@MemberKeys [dbo].[PRIMARYKEYS] READONLY
AS
BEGIN
	SET NOCOUNT ON

	BEGIN TRANSACTION [Tran1]
		BEGIN TRY
			INSERT INTO [dbo].[Rooms] ([Created]) VALUES (DEFAULT)
			DECLARE @roomId INT = SCOPE_IDENTITY()

			INSERT INTO [dbo].[UserRooms] ([UserId], [RoomId], [DisplayName], [Active])
			SELECT
			[Id] AS UserId, @roomId, @DisplayName, 0
			FROM @MemberKeys

			UPDATE [dbo].[UserRooms]
			SET [Active] = 1
			WHERE [UserId] = @UserId

			COMMIT TRANSACTION [Tran1]

			SELECT [Created], [RoomId] AS Id, [DisplayName]
			FROM [dbo].[vUserRooms]
			WHERE [UserId] = @UserId AND [RoomId] = @roomId
		END TRY
		BEGIN CATCH
			ROLLBACK TRANSACTION [Tran1];
			THROW 50000, 'Unexpected error while creating group. Please try again later', 1
		END CATCH
END