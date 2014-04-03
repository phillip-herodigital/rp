
/****** Object:  UserDefinedTableType [dbo].[ItemsTableType]    Script Date: 12-10-2012 13:15:30 ******/
CREATE TYPE [dbo].[ItemsTableType] AS TABLE(
	[ID] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](256) NOT NULL,
	[TemplateID] [uniqueidentifier] NOT NULL,
	[MasterID] [uniqueidentifier] NOT NULL,
	[ParentID] [uniqueidentifier] NOT NULL,
	[Created] [datetime] NOT NULL,
	[Updated] [datetime] NOT NULL
)
GO



/****** Object:  StoredProcedure [dbo].[AppendItems]    Script Date: 12-10-2012 13:15:51 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[AppendItems](
  @items dbo.ItemsTableType READONLY
)
AS BEGIN
  INSERT INTO [Items] (
    [ID], [Name], [TemplateID], [MasterID], [ParentID], [Created], [Updated]
  )
  SELECT [ID], [Name], [TemplateID], [MasterID], [ParentID], [Created], [Updated]
  FROM @items
END

GO



/****** Object:  UserDefinedTableType [dbo].[VersionedFieldsTableType]    Script Date: 12-10-2012 13:15:35 ******/
CREATE TYPE [dbo].[VersionedFieldsTableType] AS TABLE(
	[Id] [uniqueidentifier] NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[Language] [nvarchar](50) NOT NULL,
	[Version] [int] NOT NULL,
	[FieldId] [uniqueidentifier] NOT NULL,
	[Value] [nvarchar](max) NOT NULL,
	[Created] [datetime] NOT NULL,
	[Updated] [datetime] NOT NULL
)
GO



/****** Object:  StoredProcedure [dbo].[AppendVersionedFields]    Script Date: 12-10-2012 13:15:55 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[AppendVersionedFields](
  @versionedFields dbo.VersionedFieldsTableType READONLY
)
AS BEGIN
  INSERT INTO [VersionedFields] (
    [Id], [ItemId], [Language], [Version], [FieldId], [Value], [Created], [Updated]
  )
  SELECT [Id], [ItemId], [Language], [Version], [FieldId], [Value], [Created], [Updated]
  FROM @versionedFields
END


GO


