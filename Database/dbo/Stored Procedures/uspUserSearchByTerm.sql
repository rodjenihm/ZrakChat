CREATE PROCEDURE [dbo].[uspUserSearchByTerm]
	@Term NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON

	SELECT * FROM [dbo].[vUsers]
	WHERE [Username] LIKE @Term OR [DisplayName] LIKE @Term

	SET NOCOUNT OFF
END