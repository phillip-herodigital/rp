/****** Object:  Table [dbo].[DispatchQueue]******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[DispatchQueue](
	[ID] [uniqueidentifier] NOT NULL,
	[MessageID] [uniqueidentifier] NOT NULL,
	[RecipientID] [nvarchar](256) NOT NULL,
	[ContactID] [uniqueidentifier] NOT NULL,
	[RecipientQueue] [tinyint] NOT NULL,
	[DispatchType] [tinyint] NOT NULL,
	[LastModified] [datetime] NOT NULL,
	[MessageType] [tinyint] NOT NULL,
	[CustomPersonTokens] [nvarchar](MAX) NULL,
	[InProgress] [bit] NOT NULL,
 CONSTRAINT [PK_DispatchQueueItem] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

CREATE INDEX [ix_messagequeue_updates_by_message_id] ON [dbo].[DispatchQueue]
(
	[MessageID] ASC,
	[RecipientQueue] ASC,
	[InProgress] ASC
)
INCLUDE
(
       [LastModified]
);
GO

/****** Object:  Table [dbo].[Campaigns] ******/
CREATE TABLE [dbo].[Campaigns](
	[ID] [uniqueidentifier] NOT NULL,
	[MessageID] [uniqueidentifier] NOT NULL,
	[ManagerRootID] [uniqueidentifier] NOT NULL,
	[StartDate] [datetime] NULL,
	[EndDate] [datetime] NULL,
	[TotalRecipients] [int] NOT NULL,
 CONSTRAINT [PK_Campaigns] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[Campaigns] ADD  CONSTRAINT [DF_Campaigns_TotalRecipients]  DEFAULT ((0)) FOR [TotalRecipients]
GO