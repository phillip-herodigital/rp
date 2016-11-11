﻿using System;
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

        public SitecoreProductInfo GetTexasElectricityProductData(string productCode, string providerName)
        {

            if (taxonomy != null)
            {
                var item = taxonomy.Axes.GetItem("Products/*/" + productCode);

                if (item != null)
                {
                    Sitecore.Data.Items.Item providerData = providerName != null ? item.Axes.GetChild(providerName.ToString()) : null;

                    if (providerData != null)
                    {
                        return new SitecoreProductInfo
                        {
                            Fields = new NameValueCollection
                            {
                                { "Includes Thermostat", item["Includes Thermostat"]},
                                { "Thermostat Description", item["Thermostat Description"]},
                                { "Includes Skydrop", item["Includes Skydrop"]},
                                { "Skydrop Description", item["Skydrop Description"]},
                                { "Includes Promo", item["Includes Promo"]},
                                { "Promo Icon", item["Promo Icon"]},
                                { "Promo Description", item["Promo Description"]},
                                { "Includes Skybell", item["Includes Skybell"]},
                                { "Skybell Description", item["Skybell Description"]},
                                { "Associated PlanID", item["Associated PlanID"]},
                                { "Skybell Color", item["Skybell Color"]},
                                { "Hide Plan", item["Hide Plan"]},
                                { "Is Disabled", item["Is Disabled"]},
                                { "Name", item["Product Name"] },
                                { "Description", LoadProductDescription(providerName, item) },
                                { "Minimum Usage Fee", item["Minimum Usage Fee"] },
                                { "TDU Charges", item["TDU Charges"] },
                                { "Energy Facts Label", (providerData != null) ? ((Sitecore.Data.Fields.FileField)providerData.Fields["Energy Facts Label"]).Src : null },
                                { "Terms Of Service", (providerData != null) ? ((Sitecore.Data.Fields.FileField)providerData.Fields["Terms Of Service"]).Src : null },
                                { "Your Rights As A Customer", (providerData != null) ? ((Sitecore.Data.Fields.FileField)providerData.Fields["Your Rights As A Customer"]).Src : null },
                                { "Disclaimer", (providerData != null) ? ((Sitecore.Data.Fields.FileField)providerData.Fields["Disclaimer"]).Src : null },
                            },
                            Footnotes = LoadFootnotes(new[] { item, providerData }, new[] { "Rate Footnote", "Term Footnote", "Early Termination Fee Footnote" }).ToArray()
                        };
                    }
                }
            }

            return null;
        }

        private string LoadProductDescription(string providerName, Sitecore.Data.Items.Item item)
        {
            var desc = item["Product Description"];
            var tdu = providerName.Replace(" ", "");
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

        public SitecoreProductInfo GetGeorgiaGasProductData(string productCode)
        {

            if (taxonomy != null && !string.IsNullOrEmpty(productCode))
            {
                var item = taxonomy.Axes.GetItem("Products/*/" + productCode);

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
                            { "Includes Promo", item["Includes Promo"]},
                            { "Promo Icon", item["Promo Icon"]},
                            { "Promo Description", item["Promo Description"]},
                            { "Includes Skybell", item["Includes Skybell"]},
                            { "Skybell Description", item["Skybell Description"]},
                            { "Associated PlanID", item["Associated PlanID"]},
                            { "Skybell Color", item["Skybell Color"]},
                            { "Hide Plan", item["Hide Plan"]},
                            { "Letter of Agency", ((Sitecore.Data.Fields.FileField)item.Fields["Letter of Agency"]).Src },
                            { "Terms and Disclosures", ((Sitecore.Data.Fields.FileField)item.Fields["Terms and Disclosures"]).Src },
                            { "Disclaimer", ((Sitecore.Data.Fields.FileField)item.Fields["Disclaimer"]).Src },
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

        public SitecoreProductInfo GetProtectiveProductData(string productId)
        {
            if (taxonomy != null && !string.IsNullOrEmpty(productId))
            {
                var item = taxonomy.Axes.GetItem("Modules/Protective/Protective Plans/" + productId);

                if (item != null)
                {
                    return new SitecoreProductInfo
                    {
                        Fields = new NameValueCollection
                        {
                            { "Name", item["Product Name"] },
                            { "Sort Order", item["Sort Order"] },
                        },
                        Footnotes = new KeyValuePair<string, string>[0]
                    };
                }
            }

            return null;
        }

        public SitecoreProductInfo GetMobileProductData(string productId)
        {
            if (taxonomy != null && !string.IsNullOrEmpty(productId))
            {
                var item = taxonomy.Axes.GetItem("Modules/Mobile/Mobile Data Plans/" + productId);

                if (item != null)
                {
                    return new SitecoreProductInfo
                    {
                        Fields = new NameValueCollection
                        {
                            { "Name", item["Product Name"] },
                            { "Data", item["Data"] },
                            { "Recommended", item["Recommended"] },
                            { "Special Offer", item["Special Offer"] },
                            { "Special Offer Text", item["Special Offer Text"] },
                            { "Special Offer Original Price", item["Special Offer Original Price"] },
                            { "Hide Plan", item["Hide Plan"] },
                            { "Includes International", item["Includes International"] },
                            { "Non-AutoPay ID", item["Non-AutoPay ID"] },
                            { "With-AutoPay ID", item["With-AutoPay ID"] },
                            { "Display Plan", item["Display Plan"] },
                            { "Sort Order", item["Sort Order"] },
                        },
                        Footnotes = new KeyValuePair<string, string>[0]
                    };
                }
            }

            return null;

        }

        public SitecoreProductInfo GetMobileInventoryData(string inventoryId)
        {
            if (taxonomy != null && !string.IsNullOrEmpty(inventoryId))
            {
                var item = taxonomy.Axes.GetItem("Modules/Mobile/Mobile Pricing/*/" + inventoryId);

                if (item != null)
                {
                    var installmentChild = item.Children.FirstOrDefault();
                    return new SitecoreProductInfo
                    {
                        Fields = new NameValueCollection
                        {
                            { "SKU", item["SKU"] },
                            { "Installment Months", installmentChild == null ? null : installmentChild.Fields["Number of Months"].Value },
                            { "A Group SKU", installmentChild == null ? null : installmentChild.Fields["A Group SKU"].Value },
                            { "B Group SKU", installmentChild == null ? null : installmentChild.Fields["B Group SKU"].Value },
                            { "C Group SKU", installmentChild == null ? null : installmentChild.Fields["C Group SKU"].Value },
                        },
                        Footnotes = new KeyValuePair<string, string>[0]
                    };
                }
            }

            return null;
            
        }

    }
}
