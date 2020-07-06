CREATE TABLE [dbo].[Contacts]
(
	[Created] DATETIME2(7) NOT NULL DEFAULT GETDATE(),
	[UserId] INT NOT NULL,
	[ContactId] INT NOT NULL, 
	CONSTRAINT [PK_Contacts] PRIMARY KEY ([UserId], [ContactId]), 
	CONSTRAINT [FK_Contacts_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]),
	CONSTRAINT [FK_Contacts_Users_ContactId] FOREIGN KEY ([ContactId]) REFERENCES [Users]([Id]) ON DELETE CASCADE,
)
