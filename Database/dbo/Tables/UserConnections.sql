CREATE TABLE [dbo].[UserConnections]
(
	[Created] DATETIME2(7) NOT NULL DEFAULT GETDATE(),
	[Id] INT NOT NULL IDENTITY, 
	[UserId] INT NOT NULL,
	[Username] NVARCHAR(30) NOT NULL,
	[ConnectionId] NVARCHAR(38) NOT NULL,
	CONSTRAINT [PK_UserConnections] PRIMARY KEY ([Id]), 
	CONSTRAINT [FK_UserConnections_Users] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]),
)
