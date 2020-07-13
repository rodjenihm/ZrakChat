CREATE TABLE [dbo].[UserConnections]
(
	[Created] DATETIME2(7) NOT NULL DEFAULT GETDATE(),
	[Id] INT NOT NULL IDENTITY, 
	[UserId] INT NOT NULL,
	[ConnectionId] NVARCHAR(38) NULL,
	CONSTRAINT [PK_UserConnections] PRIMARY KEY ([Id]), 
	CONSTRAINT [FK_UserConnections_Users] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]),
)
