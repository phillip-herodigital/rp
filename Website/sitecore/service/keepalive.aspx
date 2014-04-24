<%@Page Language="C#" %>
<%@Import Namespace="Sitecore.Analytics"%>
<!DOCTYPE html>
<html>
<head id="Head1" runat="server" enableviewstate="false">
  <title>Keep Alive</title>
  <script runat="server">

    protected override void OnLoad(EventArgs e)
    {
      if (Tracker.IsActive)
      {
        Tracker.CurrentPage.Cancel();
      }
    }

  </script>
</head>
<body>
  <form id="form1" runat="server" enableviewstate="false">
    Keep Alive Page
  </form>
</body>
</html>
