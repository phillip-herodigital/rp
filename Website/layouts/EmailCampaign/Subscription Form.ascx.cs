// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Subscription Form.ascx.cs" company="Sitecore A/S">
//   Copyright (c) Sitecore A/S. All rights reserved.
// </copyright>
// <summary>
//   Defines the SubscriptionForm type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Sitecore.Modules.EmailCampaign.Layouts
{
  using System;
  using System.Collections.Generic;
  using System.Collections.Specialized;
  using System.Configuration.Provider;
  using System.Linq;
  using System.Web;
  using System.Web.UI;
  using System.Web.UI.HtmlControls;
  using System.Web.UI.WebControls;

  using Sitecore.Diagnostics;
  using Sitecore.Modules.EmailCampaign.Core;
  using Sitecore.Modules.EmailCampaign.Exceptions;
  using Sitecore.Resources;
  using Sitecore.StringExtensions;
  using Sitecore.Web;
  using Sitecore.Web.UI.WebControls;

  public class SubscriptionForm : UserControl
  {
    protected HtmlGenericControl ListsArea;
    protected HtmlGenericControl ListsHeader;
    protected HtmlGenericControl EmailArea;
    protected Label EmailLabel;
    protected TextBox Email;

    protected HtmlGenericControl Warning;

    protected Button SubscribeBtn;
    protected ImageButton SubscribeImg;
    protected Button Confirm;

    protected HtmlGenericControl SrcList;

    protected bool confirmSubscription = true;

    protected string sublayoutID = "{7266CF74-731A-4CE4-9E9F-2D9983F62F62}";

    protected string rawTargetAudienceList;
    protected bool requireAuthentication;
    protected bool showList;

    private Contact contextContact;
    private TargetAudienceInfo[] targetAudiencesInfo;
    private string rootID;

    /// <summary> Gets the context contact. </summary>
    /// <exception cref="EmailCampaignException"> <c>EmailCampaignException</c>. </exception>
    protected virtual Contact ContextContact
    {
      get
      {
        if (this.contextContact == null)
        {
          if (this.requireAuthentication)
          {
            this.contextContact = Factory.GetContactFromName(Sitecore.Context.User.Name);
          }
          else
          {
            if (!string.IsNullOrEmpty(this.RootID))
            {
              this.contextContact = this.GetContactFromEmail(this.RootID);
            }

            if (this.contextContact == null)
            {
              throw new EmailCampaignException(Util.GetFrontEndText("cannot create anonymous"));
            }
          }
        }

        return this.contextContact;
      }
    }

    protected virtual TargetAudienceInfo[] TargetAudiencesInfo
    {
      get
      {
        if (this.targetAudiencesInfo == null)
        {
          string contactName = string.Empty;
          if (this.requireAuthentication)
          {
            contactName = this.ContextContact.Name;
          }

          this.targetAudiencesInfo = ClientApi.GetTargetAudiences(this.rawTargetAudienceList, contactName, out this.rootID);
        }

        return this.targetAudiencesInfo;
      }
    }

    protected virtual string RootID
    {
      get
      {
        if (this.rootID == null)
        {
          string contactName = string.Empty;
          if (this.requireAuthentication)
          {
            contactName = this.ContextContact.Name;
          }

          this.targetAudiencesInfo = ClientApi.GetTargetAudiences(this.rawTargetAudienceList, contactName, out this.rootID);
        }

        return this.rootID;
      }
    }

    protected override void OnInit(EventArgs e)
    {
      base.OnInit(e);

      NameValueCollection parameters = this.GetSublayoutParams();

      string val = parameters["Require Authentication"];
      this.requireAuthentication = (val != null) ? val == "1" : false;

      val = parameters["Show List"];
      this.showList = (val != null) ? val == "1" : false;

      val = parameters["Recipient Lists"];
      this.rawTargetAudienceList = val ?? string.Empty;

      if (this.RootID != null && this.TargetAudiencesInfo != null && this.showList)
      {
        foreach (var info in this.TargetAudiencesInfo)
        {
          if (!string.IsNullOrEmpty(info.CustomData))
          {
            this.AddSrcComboBox(info);
          }
        }
      }
    }

    protected override void OnLoad(EventArgs e)
    {
      base.OnLoad(e);

      this.Warning.InnerText = string.Empty;

      if (!this.IsPostBack)
      {
        if (!this.requireAuthentication || (Sitecore.Context.IsLoggedIn && this.ContextContact != null))
        {
          this.EmailLabel.Text = Util.GetFrontEndText("email address");
          this.SubscribeBtn.Text = Util.GetFrontEndText("subscribe");
          this.ListsHeader.InnerText = Util.GetFrontEndText("newsletters");

          bool isMailSource = false;

          if (this.RootID != null && this.TargetAudiencesInfo != null)
          {
            foreach (var info in this.TargetAudiencesInfo)
            {
              if (!string.IsNullOrEmpty(info.CustomData))
              {
                isMailSource = true;

                if (!this.showList)
                {
                  this.ListsArea.Visible = false;
                  this.EmailArea.Attributes["class"] = "area";
                  this.EmailLabel.CssClass = "title";
                  this.EmailLabel.Text = Util.GetFrontEndText("simple title");
                  break;
                }
              }
            }
          }

          if (isMailSource)
          {
            if (this.requireAuthentication)
            {
              this.Email.Text = this.ContextContact.Profile.Email;
            }

            this.InitializeTextBox(this.Email, "enter email");
          }
          else
          {
            this.ListsArea.Visible = false;
            this.Warning.InnerText = Util.GetFrontEndText("no newsletters");
          }
        }
        else
        {
          this.ListsArea.Visible = false;
          this.Warning.InnerText = Util.GetFrontEndText("please login");
        }

        this.SubscribeImg.ImageUrl = Images.GetThemedImageSource(this.SubscribeImg.ImageUrl);

        this.EmailLabel.Visible = this.Email.Visible;
        this.SubscribeBtn.Visible = this.showList && this.Email.Visible;
        this.SubscribeImg.Visible = !this.showList && this.Email.Visible;
      }
    }

    protected override void OnPreRender(EventArgs e)
    {
      base.OnPreRender(e);

      string key = "emailcampaign_js";
      ScriptManager.RegisterClientScriptInclude(this, typeof(Page), key, ResolveUrl("~") + "EmailCampaign.js");

      key = "emailcampaign_css";
      if (Sitecore.Context.Page.Page != null && Sitecore.Context.Page.Page.Header != null)
      {
        if (Sitecore.Context.Page.Page.Header.FindControl(key) == null)
        {
          HtmlGenericControl cssLink = new HtmlGenericControl("link") { ID = key };
          cssLink.Attributes["href"] = ResolveUrl("~") + "emailcampaign.css";
          cssLink.Attributes["rel"] = "stylesheet";
          cssLink.Attributes["type"] = "text/css";
          Sitecore.Context.Page.Page.Header.Controls.Add(cssLink);
        }
      }
      else
      {
        string script = "<link href='" + ResolveUrl("~") + "emailcampaign.css' rel='stylesheet' type='text/css' />";
        if (ScriptManager.GetCurrent(Page) == null || !IsPostBack)
        {
          ScriptManager.RegisterClientScriptBlock(this, typeof(Page), key, script, false);
        }
      }
    }

    protected virtual void InitializeTextBox(TextBox control, string helpText)
    {
      control.Visible = true;

      helpText = Util.GetFrontEndText(helpText);

      if (string.IsNullOrEmpty(control.Text))
      {
        control.Text = helpText;
      }

      control.Attributes.Add("onkeydown", "if (event.keyCode == 13) {document.getElementById('" + this.SubscribeBtn.ClientID + "').click();} return (event.keyCode != 13);");
      control.Attributes.Add("onfocus", "textbox_onfocus('{0}', '{1}')".FormatWith(control.ClientID, helpText));
      control.Attributes.Add("onblur", "textbox_onblur('{0}', '{1}')".FormatWith(control.ClientID, helpText));
    }

    protected void AddConfirmationDlg(string text)
    {
      string script = "<script type=\"text/javascript\">var text='" + text + "'; setTimeout(\"if(confirm(text)) document.getElementById('" + this.Confirm.ClientID + "').click();\", 0);</" + "script>";
      this.SubscribeBtn.Parent.Controls.Add(new LiteralControl(script));
    }

    protected virtual void Confirm_click(object sender, EventArgs args)
    {
      try
      {
        string email = this.Email.Text;

        if (this.Email.Visible && !email.Equals(this.ContextContact.Profile.Email, StringComparison.OrdinalIgnoreCase))
        {
          this.ContextContact.Profile.Email = email;
          this.ContextContact.Profile.Save();
        }

        this.Subscribe_click(this.SubscribeBtn, new EventArgs());
      }
      catch (EmailCampaignException e)
      {
        this.Warning.InnerText = e.LocalizedMessage;
      }
      catch (ProviderException e)
      {
        this.Warning.InnerText = Util.GetFrontEndText("email in use - " + e.Message);
      }
      catch (Exception e)
      {
        this.Warning.InnerText = e.Message;
      }
    }

    protected virtual NameValueCollection GetSublayoutParams()
    {
      NameValueCollection parameters = new NameValueCollection();

      if (!(Parent is Sublayout))
      {
        return parameters;
      }

      string paramsStr = HttpUtility.UrlDecode((Parent as Sublayout).Parameters);

      foreach (string param in paramsStr.Split('&'))
      {
        string[] parts = param.Split('=');
        parameters.Add(parts[0], (parts.Length == 1) ? string.Empty : parts[1]);
      }

      return parameters;
    }

    /// <exception cref="EmailCampaignException"><c>EmailCampaignException</c>.</exception>
    protected virtual void Subscribe_click(object sender, EventArgs args)
    {
      try
      {
        if (this.RootID == null && this.ContextContact == null)
        {
          return;
        }

        if (this.requireAuthentication && (this.Email.Text != this.ContextContact.Profile.Email || string.IsNullOrEmpty(this.ContextContact.Profile.Email)))
        {
          if (!Util.IsValidEmail(this.Email.Text))
          {
            throw new EmailCampaignException(Util.GetFrontEndText("email not valid"));
          }

          string text = Util.GetFrontEndText("address changed confirmation");
          this.AddConfirmationDlg(string.Format(text, Util.GetFrontEndText("an email")));
          return;
        }

        TargetAudienceInfo[] infoArray;

        if (this.showList)
        {
          List<CheckBox> items = this.GetSrcListItems();

          infoArray = new TargetAudienceInfo[items.Count];
          for (int i = 0; i < infoArray.Length; i++)
          {
            CheckBox checkBox = items[i];
            infoArray[i] = new TargetAudienceInfo
              {
                ID = checkBox.Attributes["value"],
                CustomData = checkBox.Checked ? "1" : "0",
                Name = string.Empty,
                Description = string.Empty
              };
          }
        }
        else
        {
          for (int i = 0; i < this.TargetAudiencesInfo.Length; i++)
          {
            this.TargetAudiencesInfo[i].CustomData = "1";
            this.TargetAudiencesInfo[i].Name = string.Empty;
            this.TargetAudiencesInfo[i].Description = string.Empty;
          }

          infoArray = this.TargetAudiencesInfo;
        }

        string itemIDToRedirect = ClientApi.UpdateSubscriptions(this.ContextContact.Name, infoArray, this.confirmSubscription);

        if (!string.IsNullOrEmpty(itemIDToRedirect))
        {
          string url = ItemUtilExt.GetContentItemPageUrl(itemIDToRedirect);
          if (!string.IsNullOrEmpty(url))
          {
            Response.Redirect(url, false);
            Context.ApplicationInstance.CompleteRequest();
          }
        }
      }
      catch (EmailCampaignException e)
      {
        this.Warning.InnerText = e.LocalizedMessage;
      }
      catch (Exception e)
      {
        this.Warning.InnerText = Util.GetFrontEndText(e.Message);
        Logging.LogError(e);
      }
    }

    /// <summary>Gets a contact from the email.</summary>
    /// <exception cref="EmailCampaignException"><c>EmailCampaignException</c>.</exception>
    protected Contact GetContactFromEmail(string managerRootID)
    {
      Assert.ArgumentNotNullOrEmpty(managerRootID, "managerRootID");

      Contact contact = null;

      if (this.Email.Visible)
      {
        string email = this.Email.Text;
        if (string.IsNullOrEmpty(email) || !Util.IsValidEmail(email))
        {
          throw new EmailCampaignException(Util.GetFrontEndText("email not valid"));
        }

        string userName = ClientApi.GetAnonymousFromEmail(email, this.rootID);

        if (!string.IsNullOrEmpty(userName))
        {
          contact = Factory.GetContactFromName(userName);

          var settings = Factory.Instance.GetGlobalSettings();

          if (!string.IsNullOrEmpty(settings.LanguageFieldName))
          {
            contact.Profile[settings.LanguageFieldName] = Sitecore.Context.Language.ToString();
          }
          else
          {
            contact.Profile.ContentLanguage = Sitecore.Context.Language.ToString();
          }
          contact.Profile.Save();
        }
      }

      return contact;
    }

    private void AddSrcComboBox(TargetAudienceInfo info)
    {
      var checkBox = new CheckBox();
      checkBox.CheckedChanged += this.CheckBoxCheckedChanged;

      checkBox.Attributes["value"] = info.ID;
      checkBox.AutoPostBack = true;
      checkBox.CssClass = "msCheckBox";
      if (this.requireAuthentication)
      {
        checkBox.Checked = info.CustomData == "1";
      }
      else
      {
        checkBox.Checked = true;
      }
      checkBox.Text = info.Name;

      this.SrcList.Controls.Add(checkBox);

      if (!string.IsNullOrEmpty(info.Description))
      {
        this.SrcList.Controls.Add(new Literal { Text = "<div class=\"msDescription\">" + info.Description + "</div>" });
      }
    }

    private void CheckBoxCheckedChanged(object sender, EventArgs args)
    {
      this.SubscribeBtn.Enabled = this.GetSrcListItems().Any(checkBox => checkBox.Checked);
    }

    private List<CheckBox> GetSrcListItems()
    {
      return this.SrcList.Controls.OfType<CheckBox>().ToList();
    }
  }
}