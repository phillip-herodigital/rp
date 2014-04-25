<%@ Page language="c#" Inherits="System.Web.UI.Page" Codepage="65001" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<script runat="server" language="C#">
  void Page_Load() {
    Response.Redirect("/default.aspx?sc_debug=1&sc_trace=1&sc_prof=1&sc_ri=1");
  }
</script>