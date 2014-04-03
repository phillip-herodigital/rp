<%@Page Language="C#" %>
<%@Import Namespace="Sitecore.Analytics"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
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
