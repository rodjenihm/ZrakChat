CREATE PROCEDURE [dbo].[uspDeleteContact]
	@UserId INT,
	@ContactId INT
AS
BEGIN
	SET NOCOUNT ON

	IF NOT EXISTS (SELECT TOP 1 [UserId], [ContactId] FROM [dbo].[Contacts] WHERE [UserId] = @UserId AND [ContactId] = @ContactId)
	BEGIN
		SET NOCOUNT OFF;
		THROW 50404, 'Contact doesn''t exist.', 1;
	END

	DELETE FROM [dbo].[Contacts] WHERE [UserId] = @UserId AND [ContactId] = @ContactId

	SET NOCOUNT OFF
END