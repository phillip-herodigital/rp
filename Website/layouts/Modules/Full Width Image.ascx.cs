using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Website.layouts.Modules
{
    public partial class Full_Width_Image : BaseLayout
    {
        protected string InlineStyles
        {
            get
            {
                var imageField = (Sitecore.Data.Fields.ImageField)CurrentContextItem.Fields["Image"];
                if (imageField == null || imageField.MediaItem == null)
                {
                    return "display: none;";
                }

                return string.Format("background-image:url('{0}');", Sitecore.Resources.Media.MediaManager.GetMediaUrl(imageField.MediaItem));
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Sitecore.Context.PageMode.IsPageEditorEditing)
            {
                divEditMode.Visible = true;
            }
        }
    }
}