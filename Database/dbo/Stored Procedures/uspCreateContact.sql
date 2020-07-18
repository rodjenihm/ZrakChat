CREATE PROCEDURE [dbo].[uspCreateContact]
	@UserId INT,
	@ContactId INT,
	@Created DATETIME2(7)
AS
BEGIN
	SET NOCOUNT ON

	IF NOT EXISTS (SELECT TOP 1 [Id] FROM [dbo].[Users] WHERE [Id] = @ContactId)
	BEGIN
		SET NOCOUNT OFF;
		THROW 50404, 'ContactId doesn''t belong to an existing user.', 1;
	END

	IF EXISTS (SELECT TOP 1 [UserId], [ContactId] FROM [dbo].[Contacts] WHERE [UserId] = @UserId AND [ContactId] = @ContactId)
	BEGIN
		SET NOCOUNT OFF;
		THROW 50000, 'Contact already exists.', 1;
	END

	INSERT INTO [dbo].[Contacts] 
	([UserId], [ContactId], [Created])
	VALUES
	(@UserId, @ContactId, @Created)

	SELECT [Created], [ContactId] AS Id, [ContactUsername] AS Username, [ContactDisplayName] AS DisplayName
	FROM [dbo].[vUserContacts] WHERE [UserId] = @UserId AND [ContactId] = @ContactId

	SET NOCOUNT OFF
END