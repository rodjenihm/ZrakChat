CREATE TABLE [dbo].[Messages]
(
	[Created] DATETIME2(7) NOT NULL DEFAULT GETDATE(),
	[Id] INT NOT NULL IDENTITY, 
	[UserId] INT NOT NULL, 
	[RoomId] INT NOT NULL,
	CONSTRAINT [PK_Messages] PRIMARY KEY ([Id]), 
	CONSTRAINT [FK_Messages_Users] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]),
	CONSTRAINT [FK_Messages_Rooms] FOREIGN KEY ([RoomId]) REFERENCES [Rooms]([Id]),
)
