CREATE VIEW [dbo].[vUsers]
	AS SELECT [Created], [Id], [Username], [DisplayName], [LastSeen] FROM [dbo].[Users]