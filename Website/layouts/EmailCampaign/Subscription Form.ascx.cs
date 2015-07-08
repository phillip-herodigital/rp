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
  using Sitecore.Analytics;
  using Sitecore.Data;
  using Sitecore.Modules.EmailCampaign.Core;
  using Sitecore.Modules.EmailCampaign.Exceptions;
  using Sitecore.Modules.EmailCampaign.Factories;
  using Sitecore.Modules.EmailCampaign.Recipients;
  using Sitecore.Modules.EmailCampaign.Xdb;
  using Sitecore.Resources;
  using Sitecore.StringExtensions;
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

    protected string rawIncludeRecipientLists;
    protected bool showList;

    private RecipientRepository recipientRepository;

    private Contact contextContact;
    private SubscriptionInfo[] subscriptionInfos;
    private string rootId;
    private ID[] excludeRecipientLists = { };

    protected virtual string RecipientEmail
    {
      get
      {
        var recipient = this.recipientRepository.GetRecipientSpecific(this.RecipientId, typeof(Email));

        if (recipient == null)
        {
          return null;
        }

        var email = recipient.GetProperties<Email>().DefaultProperty;

        if (email == null)
        {
          return null;
        }

        return email.EmailAddress;
      }
    }

    protected virtual RecipientId RecipientId
    {
      get
      {
        RecipientId recipientId = null;

        ID contactId = this.ContactId;

        if (contactId != (ID)null)
        {
          recipientId = new XdbContactId(contactId);
        }

        return recipientId;
      }
    }

    protected virtual ID ContactId
    {
      get
      {
        if (this.Email.Visible && !string.IsNullOrEmpty(this.Email.Text))
        {
          var anonymousId = ClientApi.GetAnonymousIdFromEmail(this.Email.Text);

          if (anonymousId.HasValue)
          {
            return new ID(anonymousId.Value);
          }
        }

        return new ID(Tracker.Current.Contact.ContactId);
      }
    }

    protected virtual SubscriptionInfo[] SubscriptionInfos
    {
      get
      {
        if (this.subscriptionInfos == null && !string.IsNullOrEmpty(this.rawIncludeRecipientLists))
        {
          var listsIds = Data.ID.ParseArray(this.rawIncludeRecipientLists);

          this.subscriptionInfos = ClientApi.GetSubscriptionInfo(this.RecipientId, listsIds.Select(l => l.ToString()).ToArray());
        }

        return this.subscriptionInfos;
      }
    }

    protected override void OnInit(EventArgs e)
    {
      base.OnInit(e);

      this.recipientRepository = EcmFactory.GetDefaultFactory().Bl.RecipientRepository;

      NameValueCollection parameters = this.GetSublayoutParams();

      var val = parameters["Show List"];
      this.showList = (val != null) && val == "1";

      val = parameters["Recipient Lists"];
      this.rawIncludeRecipientLists = val ?? string.Empty;

      val = parameters["Exclude Lists"];
      if (!string.IsNullOrEmpty(val))
      {
        this.excludeRecipientLists = Data.ID.ParseArray(val);
      }

      val = parameters["Manager root"];
      this.rootId = val ?? string.Empty;

      if (this.SubscriptionInfos != null && this.showList)
      {
        foreach (var info in this.SubscriptionInfos)
        {
          this.AddSrcComboBox(info);
        }
      }
    }

    protected override void OnLoad(EventArgs e)
    {
      base.OnLoad(e);

      this.Warning.InnerText = string.Empty;

      if (!this.IsPostBack)
      {

        this.EmailLabel.Text = Util.GetFrontEndText("email address");
        this.SubscribeBtn.Text = Util.GetFrontEndText("subscribe");
        this.ListsHeader.InnerText = Util.GetFrontEndText("newsletters");

        if (this.SubscriptionInfos != null && this.SubscriptionInfos.Any())
        {
          this.Email.Text = this.RecipientEmail ?? string.Empty;

          this.InitializeTextBox(this.Email, "enter email");

          if (!this.showList)
          {
            this.ListsArea.Visible = false;
            this.EmailArea.Attributes["class"] = "area";
            this.EmailLabel.CssClass = "title";
            this.EmailLabel.Text = Util.GetFrontEndText("simple title");
          }
        }
        else
        {
          this.ListsArea.Visible = false;
          this.Warning.InnerText = Util.GetFrontEndText("no newsletters");
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
      ScriptManager.RegisterClientScriptInclude(this, typeof(Page), key, this.ResolveUrl("~") + "EmailCampaign.js");

      key = "emailcampaign_css";
      if (Sitecore.Context.Page.Page != null && Sitecore.Context.Page.Page.Header != null)
      {
        if (Sitecore.Context.Page.Page.Header.FindControl(key) == null)
        {
          HtmlGenericControl cssLink = new HtmlGenericControl("link") { ID = key };
          cssLink.Attributes["href"] = this.ResolveUrl("~") + "emailcampaign.css";
          cssLink.Attributes["rel"] = "stylesheet";
          cssLink.Attributes["type"] = "text/css";
          Sitecore.Context.Page.Page.Header.Controls.Add(cssLink);
        }
      }
      else
      {
        string script = "<link href='" + ResolveUrl("~") + "emailcampaign.css' rel='stylesheet' type='text/css' />";
        if (ScriptManager.GetCurrent(this.Page) == null || !this.IsPostBack)
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

        if (!string.IsNullOrEmpty(this.RecipientEmail) && !email.Equals(this.RecipientEmail, StringComparison.OrdinalIgnoreCase))
        {
          this.UpdateEmailInXDB();
        }

        this.Subscribe_click(this.SubscribeBtn, new EventArgs());
      }
      catch (EmailCampaignException e)
      {
        this.Warning.InnerText = e.LocalizedMessage;
      }
      catch (ProviderException)
      {
        this.Warning.InnerText = Util.GetFrontEndText("email in use");
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
        if (!string.IsNullOrEmpty(this.RecipientEmail) && !this.Email.Text.Equals(this.RecipientEmail, StringComparison.OrdinalIgnoreCase))
        {
          if (!Util.IsValidEmail(this.Email.Text))
          {
            throw new EmailCampaignException(Util.GetFrontEndText("email not valid"));
          }

          string text = Util.GetFrontEndText("address changed confirmation");
          this.AddConfirmationDlg(string.Format(text, Util.GetFrontEndText("an email")));
          return;
        }

        if (string.IsNullOrEmpty(this.RecipientEmail))
        {
          this.UpdateEmailInXDB();
        }

        List<string> listsToSubscribe = new List<string>();
        List<string> listsToUnsubscribe = new List<string>();

        if (this.showList)
        {
          List<CheckBox> items = this.GetSrcListItems();

          for (int i = 0; i < items.Count; i++)
          {
            CheckBox checkBox = items[i];
            Guid recipientListId;
            if (!Guid.TryParse(checkBox.Attributes["value"], out recipientListId))
            {
              continue;
            }

            if (checkBox.Checked)
            {
              listsToSubscribe.Add(recipientListId.ToString());
            }
            else
            {
              listsToUnsubscribe.Add(this.excludeRecipientLists[i].Guid.ToString());
            }
          }
        }
        else
        {
          for (int i = 0; i < this.SubscriptionInfos.Length; i++)
          {
            listsToSubscribe.Add(this.SubscriptionInfos[i].ContactListId);
          }
        }

        string itemIdToRedirect = ClientApi.UpdateSubscriptions(this.RecipientId, listsToSubscribe.ToArray(), listsToUnsubscribe.ToArray(), this.rootId, this.confirmSubscription);

        if (!string.IsNullOrEmpty(itemIdToRedirect))
        {
          string url = ItemUtilExt.GetContentItemPageUrl(itemIdToRedirect);
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

    protected virtual void UpdateEmailInXDB()
    {
      this.recipientRepository.UpdateRecipientEmail(this.RecipientId, this.Email.Text);
    }

    private void AddSrcComboBox(SubscriptionInfo info)
    {
      var checkBox = new CheckBox();

      checkBox.Attributes["value"] = info.ContactListId;
      checkBox.AutoPostBack = true;
      checkBox.CssClass = "msCheckBox";
      checkBox.Checked = info.UserSubscribed;

      checkBox.Text = info.Name;

      this.SrcList.Controls.Add(checkBox);

      if (!String.IsNullOrEmpty(info.Description))
      {
        this.SrcList.Controls.Add(new Literal { Text = "<div class=\"msDescription\">" + info.Description + "</div>" });
      }
    }

    private List<CheckBox> GetSrcListItems()
    {
      return this.SrcList.Controls.OfType<CheckBox>().ToList();
    }
  }
}