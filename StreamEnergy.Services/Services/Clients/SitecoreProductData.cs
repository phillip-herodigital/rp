using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace StreamEnergy.Services.Clients
{
    class SitecoreProductData : ISitecoreProductData
    {
        private Sitecore.Data.Items.Item taxonomy;

        public SitecoreProductData([Dependency("Taxonomy")] Sitecore.Data.Items.Item taxonomy)
        {
            this.taxonomy = taxonomy;
        }



        public SitecoreProductInfo GetTexasElectricityProductData(StreamConnect.Product product)
        {

            if (taxonomy != null)
            {
                var item = taxonomy.Axes.GetItem("Products/*/" + product.ProductCode);

                if (item != null)
                {
                    var providerData = item.Axes.GetChild(product.Provider["Name"].ToString());

                    if (providerData != null)
                    {
                        return new SitecoreProductInfo
                        {
                            Fields = new NameValueCollection
                            {
                                { "Name", item["Product Name"] },
                                { "Description", LoadProductDescription(product, item) },
                                { "Minimum Usage Fee", item["Minimum Usage Fee"] },
                                { "TDU Charges", item["TDU Charges"] },
                                { "Energy Facts Label", ((Sitecore.Data.Fields.FileField)providerData.Fields["Energy Facts Label"]).Src },
                                { "Terms Of Service", ((Sitecore.Data.Fields.FileField)providerData.Fields["Terms Of Service"]).Src },
                                { "Your Rights As A Customer", ((Sitecore.Data.Fields.FileField)providerData.Fields["Your Rights As A Customer"]).Src },
                            },
                            Footnotes = LoadFootnotes(new[] { item, providerData }, new[] { "Rate Footnote", "Term Footnote", "Early Termination Fee Footnote" }).ToArray()
                        };
                    }
                }
            }

            return null;
        }

        private string LoadProductDescription(StreamConnect.Product product, Sitecore.Data.Items.Item item)
        {
            var desc = item["Product Description"];
            var tdu = product.Provider["Name"].ToString().Replace(" ", "");
            var rateTiers = Sitecore.Web.WebUtil.ParseUrlParameters(item["Rate Tiers"]);

            foreach(var key in rateTiers.AllKeys)
            {
                if (key.StartsWith(tdu))
                {
                    desc = desc.Replace("{" + key.Replace(tdu, "") + "}", rateTiers[key]);
                }
            }
            return desc;
        }

        public SitecoreProductInfo GetGeorgiaGasProductData(StreamConnect.Product product)
        {

            if (taxonomy != null)
            {
                var item = taxonomy.Axes.GetItem("Products/*/" + product.ProductCode);

                if (item != null)
                {
                    return new SitecoreProductInfo
                    {
                        Fields = new NameValueCollection
                        {
                            { "Name", item["Product Name"] },
                            { "Description", item["Product Description"] },
                            { "Monthly Service Charge", item["Monthly Service Charge"] },
                            { "Early Termination Fee", item["Early Termination Fee"] },
                            { "Energy Facts Label", ((Sitecore.Data.Fields.FileField)item.Fields["Energy Facts Label"]).Src },
                            { "Terms Of Service", ((Sitecore.Data.Fields.FileField)item.Fields["Terms Of Service"]).Src },
                            { "Your Rights As A Customer", ((Sitecore.Data.Fields.FileField)item.Fields["Your Rights As A Customer"]).Src },
                        },
                        Footnotes = LoadFootnotes(new[] { item }, new[] { "Rate Footnote", "Term Footnote", "Early Termination Fee Footnote" }).ToArray()
                    };
                }
            }

            return null;
        }

        private IEnumerable<KeyValuePair<string, string>> LoadFootnotes(Sitecore.Data.Items.Item[] items, string[] fieldNames)
        {
            foreach (var fieldName in fieldNames)
            {
                foreach (var item in items.Reverse())
                {
                    var value = item[fieldName];
                    if (!string.IsNullOrEmpty(value))
                    {
                        yield return new KeyValuePair<string, string>(fieldName, value);
                        break;
                    }
                }
            }
        }
    }
}
