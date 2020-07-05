CREATE TABLE [dbo].[Users]
(
	[Created] DATETIME2(7) NOT NULL DEFAULT GETDATE(),
	[Id] INT NOT NULL IDENTITY,
	[Username] NVARCHAR(30) NOT NULL,
	[DisplayName] NVARCHAR(30) NOT NULL,
	[PasswordHash] CHAR(48) NOT NULL, 
	CONSTRAINT [PK_Users] PRIMARY KEY ([Id]), 
	CONSTRAINT [CK_Users_Username] CHECK (DATALENGTH([Username]) > 4),
	CONSTRAINT [CK_Users_DisplayName] CHECK (DATALENGTH([DisplayName]) > 4),
)

GO

CREATE UNIQUE INDEX [IX_User_Username] ON [dbo].[Users] ([Username])
