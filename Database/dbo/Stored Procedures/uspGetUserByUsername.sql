CREATE PROCEDURE [dbo].[uspGetUserByUsername]
	@Username NVARCHAR(30)
AS
BEGIN
	SET NOCOUNT ON
	
	SELECT * FROM [dbo].[Users] WHERE [Username] = @Username

	SET NOCOUNT OFF
END
