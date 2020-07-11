﻿CREATE TABLE [dbo].[Rooms]
(
	[Created] DATETIME2(7) NOT NULL DEFAULT GETDATE(),
	[Id] INT NOT NULL IDENTITY, 
	[MessageId] INT NULL,
	CONSTRAINT [PK_Rooms] PRIMARY KEY ([Id]), 
	CONSTRAINT [FK_Rooms_Messages] FOREIGN KEY ([MessageId]) REFERENCES [Messages]([Id]),
)
