CREATE VIEW [dbo].[vUserContacts]
	AS 
		(
			SELECT
			c.[Created], c.[UserId], u.[Id] AS ContactId, u.[Username] AS ContactUsername, u.[DisplayName] AS ContactDisplayName
			FROM [dbo].[Contacts] c
			INNER JOIN [dbo].[Users] u ON u.Id = c.ContactId
		)
