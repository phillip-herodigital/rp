using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Sitecore;
using Sitecore.Data.Items;
using Sitecore.SecurityModel;

namespace StreamEnergy.MyStream.Tests.Sitecore
{
    [TestClass]
    public class SettingsTest
    {
        private const string automatedTestItemPath = "/sitecore/content/data/Settings/AutomatedTest";
        private Unity.Container container;
        private static Item automatedTestItem;
        private static Item automatedTestDevItem;

        [ClassInitialize]
        public static void InitializeDummySetting(TestContext testContext)
        {
            var container = ContainerSetup.Create();
            using (new SecurityDisabler())
            {
                var template = Context.Database.GetTemplate(new global::Sitecore.Data.ID(new Guid("{ACDE682B-A8C7-4E5C-B8BA-78FDE04651A4}")));

                // Delete the test item if it already existed - we don't need to get confusion in our tests
                automatedTestItem = Context.Database.GetItem(automatedTestItemPath);
                if (automatedTestItem != null)
                    automatedTestItem.Delete();

                // Create the test item
                automatedTestItem = Context.Database.CreateItemPath(automatedTestItemPath, template);
                automatedTestItem.Editing.BeginEdit();
                automatedTestItem.Fields["Icon"].Value = "Default Value";
                automatedTestItem.Fields["Title"].Value = "Default Value";
                automatedTestItem.Editing.AcceptChanges();
                automatedTestItem.Editing.EndEdit();

                // Create a child item based on a different template
                template = Context.Database.GetTemplate(new global::Sitecore.Data.ID(new Guid("{8961DA70-F922-4917-8AAE-695E621A6775}")));
                automatedTestDevItem = automatedTestItem.Add(EnvironmentCategory.Development.ToString(), template);
                automatedTestDevItem.Editing.BeginEdit();
                automatedTestDevItem.Fields["Icon"].Value = "Dev Value";
                automatedTestDevItem.Editing.AcceptChanges();
                automatedTestDevItem.Editing.EndEdit();
            }
        }

        [ClassCleanup]
        public static void CleanupDummySetting()
        {
            if (automatedTestItem != null)
            {
                using (new SecurityDisabler())
                {
                    automatedTestItem.DeleteChildren();
                    automatedTestItem.Delete();
                }
            }
        }

        [TestInitialize]
        public void InitializeTest()
        {
            container = ContainerSetup.Create();
        }

        [TestMethod]
        public void EnvironmentTest()
        {
            // our configs come from the developer's default check-out copy - they should always be development environments
            Assert.AreEqual(EnvironmentCategory.Development, container.Resolve<EnvironmentCategory>());
        }

        [TestMethod]
        public void GetSettingsItemTest()
        {
            var settingResolver = container.Resolve<ISettings>();
            var item = settingResolver.GetSettingsItem("AutomatedTest");

            Assert.IsNotNull(item);
            Assert.AreEqual(SettingsTest.automatedTestDevItem.ID, item.ID);
        }

        [TestMethod]
        public void GetSettingsValueTest()
        {
            var settingResolver = container.Resolve<ISettings>();
            var value = settingResolver.GetSettingsValue("AutomatedTest", "Icon");

            Assert.IsNotNull(value);
            Assert.AreEqual("Dev Value", value);
        }

        [TestMethod]
        public void GetSettingsFieldTest()
        {
            var settingResolver = container.Resolve<ISettings>();
            var field = settingResolver.GetSettingsField("AutomatedTest", "Icon");

            Assert.IsNotNull(field);
            Assert.AreEqual(SettingsTest.automatedTestDevItem.ID, field.Item.ID);
            Assert.AreEqual("Dev Value", field.Value);
        }

        [TestMethod]
        public void DefaultingValueTest()
        {
            var settingResolver = container.Resolve<ISettings>();
            var value = settingResolver.GetSettingsValue("AutomatedTest", "Title");

            Assert.IsNotNull(value);
            Assert.AreEqual("Default Value", value);
        }

        [TestMethod]
        public void DefaultingFieldTest()
        {
            var settingResolver = container.Resolve<ISettings>();
            var field = settingResolver.GetSettingsField("AutomatedTest", "Title");

            Assert.IsNotNull(field);
            Assert.AreEqual(SettingsTest.automatedTestItem.ID, field.Item.ID);
            Assert.AreEqual("Default Value", field.Value);
        }


    }
}
