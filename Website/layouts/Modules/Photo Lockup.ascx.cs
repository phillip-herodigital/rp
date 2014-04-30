using Sitecore.Data.Items;
using Sitecore.Web.UI.WebControls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Website.layouts.Modules
{
    public partial class Photo_Lockup : BaseLayout
    {
        protected string BackgroundImageURL
        {
            get
            {
                var imageField = (Sitecore.Data.Fields.ImageField)CurrentContextItem.Fields["Background Image"];
                if (imageField == null || imageField.MediaItem == null)
                {
                    return "";
                }

                return Sitecore.Resources.Media.MediaManager.GetMediaUrl(imageField.MediaItem);
            }
        }
        protected string ModuleCssClasses
        {
            get
            {
                var classes = new List<string>();

                var imageOnRightField = (Sitecore.Data.Fields.CheckboxField)CurrentContextItem.Fields["Image on Right"];
                var backgroundColorField = CurrentContextItem.Fields["Background Color"];
                var accentColorField = CurrentContextItem.Fields["Accent Color"];
                var borderColorField = CurrentContextItem.Fields["Border Color"];
                var backgroundImagePositionField = CurrentContextItem.Fields["Background Image Position"];
                var customCssClassField = CurrentContextItem.Fields["Custom CSS Class"];

                if (imageOnRightField != null && imageOnRightField.Checked)
                {
                    classes.Add("right-img");
                }

                var colors = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Colors").Children;

                if (colors.Any(c => c.Name == backgroundColorField.Value))
                {
                    classes.Add("bg-" + colors.First(c => c.Name == backgroundColorField.Value).Fields["CSS Class"].Value);
                }

                if (colors.Any(c => c.Name == accentColorField.Value))
                {
                    classes.Add("accent-" + colors.First(c => c.Name == accentColorField.Value).Fields["CSS Class"].Value);
                }

                if (colors.Any(c => c.Name == borderColorField.Value))
                {
                    classes.Add("border border-" + colors.First(c => c.Name == borderColorField.Value).Fields["CSS Class"].Value);
                }
                if (customCssClassField != null && !string.IsNullOrEmpty(customCssClassField.Value))
                {
                    classes.Add(customCssClassField.Value);
                }

                var backgroundImagePositions = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Background Image Positions").Children;
                if (backgroundImagePositions.Any(c => c.Name == backgroundImagePositionField.Value))
                {
                    classes.Add(backgroundImagePositions.First(c => c.Name == backgroundImagePositionField.Value).Fields["CSS Class"].Value);
                }

                return string.Join(" ", classes);
            }
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Sitecore.Context.PageMode.IsPageEditorEditing)
            {
                divEditMode.Visible = true;
            }

            var controlMapping = new Dictionary<string, string>()
            {
                {"h2Header", "Header"},
                {"h3Header", "Sub Header"},
                {"blkQuote", "Quote"},
                {"pCite", "Citation"},
                {"pContent", "Content"},
            };
            foreach (var key in controlMapping.Keys)
            {
                var control = this.FindControl(key);
                if (control != null)
                {
                    control.Visible = !string.IsNullOrEmpty(FieldRenderer.Render(CurrentContextItem, controlMapping[key]));
                }
            }
        }
    }
}