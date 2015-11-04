using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Web.UI.Sheer;
using System.Web.UI.HtmlControls;
using Sitecore.Web.UI.HtmlControls;
using Sitecore;
using Sitecore.Diagnostics;
using Sitecore.Text;
using System.Web.UI;
using Newtonsoft.Json;

namespace StreamEnergy.MyStream.Fields
{
    public class ReorderableListField: Input
    {
        /// <summary>
		/// Name html control style
		/// </summary>
		protected virtual string NameStyle
		{
			get
			{
				return "width:150px";
			}
		}

		/// <summary>
		/// Is control vertical
		/// </summary>
		protected virtual bool IsVertical
		{
			get
			{
				return false;
			}
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="T:Sitecore.Shell.Applications.ContentEditor.NameValue" /> class.
		/// </summary>
        public ReorderableListField()
		{
			base.Activation = true;
		}

		/// <summary>
		/// Sends server control content to a provided <see cref="T:System.Web.UI.HtmlTextWriter"></see> object, which writes the content to be rendered on the client.
		/// </summary>
		/// <param name="output">
		/// The <see cref="T:System.Web.UI.HtmlTextWriter"></see> object that receives the server control content.
		/// </param>
		protected override void DoRender(HtmlTextWriter output)
		{
			Assert.ArgumentNotNull(output, "output");
			base.SetWidthAndHeightStyle();
			output.Write("<div" + base.ControlAttributes + ">");
			this.RenderChildren(output);
			output.Write("</div>");
		}

		/// <summary>
		/// Raises the <see cref="E:System.Web.UI.Control.Load"></see> event.
		/// </summary>
		/// <param name="e">
		/// The <see cref="T:System.EventArgs"></see> object that contains the event data.
		/// </param>
		protected override void OnLoad(System.EventArgs e)
		{
			Assert.ArgumentNotNull(e, "e");
			base.OnLoad(e);
			if (Sitecore.Context.ClientPage.IsEvent)
			{
				this.LoadValue();
				return;
			}
			this.BuildControl();
		}

		/// <summary>
		/// Parameters the change.
		/// </summary>
		[UsedImplicitly]
		protected void ParameterChange()
		{
			ClientPage clientPage = Sitecore.Context.ClientPage;
			if (clientPage.ClientRequest.Source == StringUtil.GetString(clientPage.ServerProperties[this.ID + "_LastParameterID"]))
			{
				string value = clientPage.ClientRequest.Form[clientPage.ClientRequest.Source];
				if (!string.IsNullOrEmpty(value))
				{
					string value2 = this.BuildParameterKeyValue(string.Empty, string.Empty);
					clientPage.ClientResponse.Insert(this.ID, "beforeEnd", value2);
				}
			}
			System.Collections.Specialized.NameValueCollection nameValueCollection = null;
			System.Web.UI.Page page = HttpContext.Current.Handler as System.Web.UI.Page;
			if (page != null)
			{
				nameValueCollection = page.Request.Form;
			}
			if (nameValueCollection == null)
			{
				return;
			}
			if (this.Validate(nameValueCollection))
			{
				clientPage.ClientResponse.SetReturnValue(true);
			}
		}

		/// <summary>
		/// Sets the modified flag.
		/// </summary>
		protected override void SetModified()
		{
			base.SetModified();
			if (base.TrackModified)
			{
				Sitecore.Context.ClientPage.Modified = true;
			}
		}

		/// <summary>
		/// Builds the control.
		/// </summary>
		private void BuildControl()
		{
            var store = JsonConvert.DeserializeObject<List<KeyValuePair<string, string>>>(this.Value);
			foreach (var keyValuePair in store)
			{
                if (!string.IsNullOrEmpty(keyValuePair.Key) && !string.IsNullOrEmpty(keyValuePair.Value))
                {
                    this.Controls.Add(new LiteralControl(this.BuildParameterKeyValue(keyValuePair.Key, keyValuePair.Value)));
                }
			}
			this.Controls.Add(new LiteralControl(this.BuildParameterKeyValue(string.Empty, string.Empty)));
            this.Controls.Add(new LiteralControl("<style type=\"text/css\">table.scAdditionalParameters:first-of-type tr td a.up,table.scAdditionalParameters:last-of-type tr td a.up {visibility: hidden;}table.scAdditionalParameters:last-of-type tr td a.down,table.scAdditionalParameters:nth-last-of-type(2) tr td a.down {visibility: hidden;}</style>"));
		}

		/// <summary>
		/// Builds the parameter key value.
		/// </summary>
		/// <param name="key">
		/// The parameter key.
		/// </param>
		/// <param name="value">
		/// The value.
		/// </param>
		/// <returns>
		/// The parameter key value.
		/// </returns>
		/// <contract><requires name="key" condition="not null" /><requires name="value" condition="not null" /><ensures condition="not null" /></contract>
		private string BuildParameterKeyValue(string key, string value)
		{
			Assert.ArgumentNotNull(key, "key");
			Assert.ArgumentNotNull(value, "value");
			string uniqueID = Sitecore.Web.UI.HtmlControls.Control.GetUniqueID(this.ID + "_Param");
			Sitecore.Context.ClientPage.ServerProperties[this.ID + "_LastParameterID"] = uniqueID;
			string clientEvent = Sitecore.Context.ClientPage.GetClientEvent(this.ID + ".ParameterChange");
			string text = this.ReadOnly ? " readonly=\"readonly\"" : string.Empty;
			string text2 = this.Disabled ? " disabled=\"disabled\"" : string.Empty;
			string arg = this.IsVertical ? "</tr><tr>" : string.Empty;
			string arg2 = string.Format("<input id=\"{0}\" name=\"{1}\" type=\"text\"{2}{3} style=\"{6}\" value=\"{4}\" onchange=\"{5}\"/>", new object[]
			{
				uniqueID,
				uniqueID,
				text,
				text2,
				StringUtil.EscapeQuote(key),
				clientEvent,
				this.NameStyle
			});
			string valueHtmlControl = this.GetValueHtmlControl(uniqueID, StringUtil.EscapeQuote(HttpUtility.UrlDecode(value)));
            return string.Format("<table width=\"100%\" class='scAdditionalParameters'><tr><td><a class=\"up\" href=\"javascript:void(0);\" onclick=\"(function(ele) {{var tab = $(ele).closest('table'); tab.up().insertBefore(tab, tab.previous())}})(this)\">Move&nbsp;Up</a><br /><a class=\"down\" href=\"javascript:void(0);\" onclick=\"(function(ele) {{var tab = $(ele).closest('table'); tab.up().insertBefore(tab, tab.next().next())}})(this)\">Move&nbsp;Down</a></td><td>{0}</td>{2}<td width=\"100%\">{1}</td></tr></table>", arg2, valueHtmlControl, arg);
		}

		/// <summary>
		/// Loads the post data.
		/// </summary>
		private void LoadValue()
		{
			if (this.ReadOnly || this.Disabled)
			{
				return;
			}
			System.Web.UI.Page page = HttpContext.Current.Handler as System.Web.UI.Page;
			System.Collections.Specialized.NameValueCollection nameValueCollection;
			if (page != null)
			{
				nameValueCollection = page.Request.Form;
			}
			else
			{
				nameValueCollection = new System.Collections.Specialized.NameValueCollection();
			}
            var store = new List<KeyValuePair<string, string>>();
			UrlString urlString = new UrlString();
			foreach (string text in nameValueCollection.Keys)
			{
				if (!string.IsNullOrEmpty(text) && text.StartsWith(this.ID + "_Param", System.StringComparison.InvariantCulture) && !text.EndsWith("_value", System.StringComparison.InvariantCulture))
				{
                    store.Add(new KeyValuePair<string, string>(nameValueCollection[text], nameValueCollection[text + "_value"]));
				}
			}
            string text2 = JsonConvert.SerializeObject(store);
            if (this.Value == text2)
			{
				return;
			}
            this.Value = text2;
			this.SetModified();
		}

		/// <summary>
		/// Validates the specified client page.
		/// </summary>
		/// <param name="form">The form.</param>
		/// <returns>The result of the validation.</returns>
		private bool Validate(System.Collections.Specialized.NameValueCollection form)
		{
			/*Assert.ArgumentNotNull(form, "form");
			foreach (string text in form.Keys)
			{
				if (text != null && text.StartsWith(this.ID + "_Param", System.StringComparison.InvariantCulture) && !text.EndsWith("_value", System.StringComparison.InvariantCulture))
				{
					string text2 = form[text];
					if (!string.IsNullOrEmpty(text2) && !System.Text.RegularExpressions.Regex.IsMatch(text2, "^\\w*$"))
					{
						SheerResponse.Alert(string.Format("The key \"{0}\" is invalid.\n\nA key may only contain letters and numbers.", text2), new string[0]);
						SheerResponse.SetReturnValue(false);
						return false;
					}
				}
			}*/
			return true;
		}

		/// <summary>
		/// Gets value html control.
		/// </summary>
		/// <param name="id">The id.</param>
		/// <param name="value">The value.</param>
		/// <returns>The formatted value html control.</returns>
		protected virtual string GetValueHtmlControl(string id, string value)
		{
			string text = this.ReadOnly ? " readonly=\"readonly\"" : string.Empty;
			string text2 = this.Disabled ? " disabled=\"disabled\"" : string.Empty;
			return string.Format("<input id=\"{0}_value\" name=\"{0}_value\" type=\"text\" style=\"width:100%\" value=\"{1}\"{2}{3}/>", new object[]
			{
				id,
				value,
				text,
				text2
			});
		}
    }
}