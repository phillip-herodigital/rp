<%@ Page Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.Update.UpdateSocialProfiles" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
  <title>Sitecore Social Connected Update Tool</title>
  <link href="/sitecore/shell/themes/standard/default/WebFramework.css" rel="Stylesheet" />
  <style>
    #progressContainer {
      margin-top: 20px;
    }

    .wf-content {
      height: 100px;
    }

    #progress {
      height: 20px;
      width: 100%;
    }
  </style>

  <script type="text/javascript" src="/sitecore/shell/Controls/lib/jQuery/jquery.js"></script>
  <script type="text/javascript" src="/sitecore/shell/controls/webframework/webframework.js"></script>
</head>
<body>
  <form id="updateSocialProfilesForm" runat="server" class="wf-container">
    <div class="wf-content">
      <h1>Welcome to the Sitecore Social Connected update tool!</h1>
      <p class="wf-subtitle">
        You can use this tool to update social profiles data to be compliant with Social Connected in Sitecore 8.0 Update-1.
      </p>
      <div id="progressContainer" runat="server">
        <progress id="progress" value="0" max="1" visible="False"></progress>
        <div id="progressText"></div>
        <div id="errorsContainer"></div>
      </div>
    </div>
    <div class="wf-footer">
      <asp:Button ID="RunButton" Text="Run" runat="server" OnClick="RunButtonClick" />
    </div>
  </form>

  <% if (this.TrackProgress)
     { %>

  <script>
    $(function () {
      getProgress();
      var intervalId = setInterval(getProgress, 2000);
      function getProgress() {
        $.ajax({
          type: "POST",
          url: "UpdateSocialProfiles.aspx/GetProgress",
          data: "{}",
          contentType: "application/json",
          dataType: "json",
          success: function (data) {
            if (data.d) {
              if (data.d.JobFailed) {
                clearInterval(intervalId);
                $('#progressText').html("An error occurred during the update process. Please see the Sitecore logs for details.");
              } else {
                $('#progress').attr("max", data.d.Total);
                $('#progress').attr("value", data.d.Current);
                $('#progressText').html("Processed user profiles: " + data.d.Current + " of " + data.d.Total);

                if (data.d.Current === data.d.Total && data.d.Total !== 0) {
                  clearInterval(intervalId);
                  $('#progressText').html("Update is completed. Please see the Sitecore logs for details.");
                }
              }
            } else {
              $('#progressText').html("Update has been started...");
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            clearInterval(intervalId);
            $('#progressText').html("An error occurred during progress retrieval. Text status: " + textStatus + "; Error thrown: " + errorThrown + ". Please see the Sitecore logs for details.");
            $('#progress').hide();
          }
        });
      }
    });
  </script>

  <% } %>
</body>
</html>