CREATE PROCEDURE [dbo].[uspRegisterUser]
	@Username NVARCHAR(30),
	@DisplayName NVARCHAR(30),
	@PasswordHash CHAR(48)
AS
BEGIN
	SET NOCOUNT ON

	INSERT INTO [dbo].[Users]
	([Username], [DisplayName], [PasswordHash])
	VALUES
	(@Username, @DisplayName, @PasswordHash)

	SET NOCOUNT OFF
END