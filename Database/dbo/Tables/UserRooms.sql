﻿CREATE TABLE [dbo].[UserRooms]
(
	[Created] DATETIME2(7) NOT NULL DEFAULT GETDATE(),
	[UserId] INT NOT NULL, 
	[RoomId] INT NOT NULL, 
	[DisplayName] NVARCHAR(30) NOT NULL,
	[Active] BIT NOT NULL DEFAULT 0, 
	[LastMessageSeenId] INT NULL,
	CONSTRAINT [FK_UserRooms_Users] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]) ON DELETE CASCADE,
	CONSTRAINT [FK_UserRooms_Rooms] FOREIGN KEY ([RoomId]) REFERENCES [Rooms]([Id]) ON DELETE CASCADE, 
	CONSTRAINT [FK_UserRooms_Messages] FOREIGN KEY ([LastMessageSeenId]) REFERENCES [Messages]([Id]),
)
