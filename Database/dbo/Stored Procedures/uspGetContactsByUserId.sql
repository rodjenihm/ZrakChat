CREATE PROCEDURE [dbo].[uspGetContactsByUserId]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON
	
	SELECT [Created], [ContactId] AS Id, [ContactUsername] AS Username, [ContactDisplayName] AS DisplayName
	FROM [dbo].[vUserContacts] WHERE [UserId] = @UserId

	SET NOCOUNT OFF
END