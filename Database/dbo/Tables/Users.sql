CREATE TABLE [dbo].[Users]
(
	[Created] DATETIME2(7) NOT NULL DEFAULT GETDATE(),
	[Id] INT NOT NULL IDENTITY,
	[Username] NVARCHAR(30) NOT NULL,
	[DisplayName] NVARCHAR(30) NOT NULL,
	[Role] VARCHAR(10) NOT NULL DEFAULT 'Member',
	[PasswordHash] CHAR(48) NOT NULL, 
	[LastSeen] DATETIME2(7) NULL DEFAULT GETDATE(),
	CONSTRAINT [PK_Users] PRIMARY KEY ([Id]), 
	CONSTRAINT [CK_Users_Username] CHECK (DATALENGTH([Username]) > 4),
	CONSTRAINT [CK_Users_DisplayName] CHECK (DATALENGTH([DisplayName]) > 4),
	CONSTRAINT [CK_Users_Role] CHECK ([Role] IN ('Member', 'Moderator', 'Admin')),
)

GO

CREATE UNIQUE INDEX [IX_User_Username] ON [dbo].[Users] ([Username])
