<%@ Page Language="C#" %>
<%@ Import Namespace="Sitecore.ListManagement" %>
<%@ Import Namespace="Sitecore.ListManagement.ContentSearch" %>
<%@ Import Namespace="Sitecore.ListManagement.ContentSearch.Model" %>
<%@ Import Namespace="Sitecore.Analytics.Model.Entities" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <p>Number of Contacts: <asp:Literal ID="litNumContacts" runat="server" /></p>

        <p>Saved Contacts: <asp:Literal ID="litNumSaved" runat="server" /></p>

        <div id="divReload" runat="server">
            <script>
                setTimeout(function () {
                    window.location.reload();
                }, 1000*5);
            </script>
        </div>

        <script language="c#" runat="server">
            public void Page_Load(object sender, EventArgs e)
            {
                litNumSaved.Text = Sitecore.Context.User.DisplayName;
                return;
                var driver = Sitecore.Analytics.Data.DataAccess.MongoDb.MongoDbDriver.FromConnectionString("analytics");
                litNumContacts.Text = driver.Contacts.Count().ToString();

                var listId = "{96CB49BD-3CF7-46F5-903E-BA215C27F2F7}";
                //listId = "{77F30B51-99E5-44A9-B77E-859F2C0F0E50}";
                listId = "{70483A81-C31D-4BFA-8708-ACE5547F48DA}";

                var contactRepo = new Sitecore.Analytics.Data.ContactRepository();
                var store = new ContactListStore();
                var listManager = new ListManager<ContactList, ContactData>(store);
                var contactList = listManager.FindById(listId);

                //#region Add Email
                //var email = "adam@rpath.us";
                //var guid = Sitecore.Data.ID.NewID;
                //var newContact = contactRepo.CreateContact(guid);
                //newContact.Identifiers.Identifier = email;

                //// Email Facet
                //var emailFacetNew = newContact.GetFacet<IContactEmailAddresses>("Emails");
                //emailFacetNew.Entries.Create("Preferred").SmtpAddress = email;
                //emailFacetNew.Preferred = "Preferred";
                
                //// Name Facet
                //var nameFacetNew = newContact.GetFacet<IContactPersonalInfo>("Personal");
                //nameFacetNew.FirstName = "Adam";
                //nameFacetNew.Surname = "Brill";
                
                //listManager.AssociateContacts(contactList, new List<ContactData>()
                //    {
                //        new ContactData()
                //        {
                //            Identifier = newContact.Identifiers.Identifier,
                //        },
                //    });
                ////listManager.RemoveContactAssociations(contactList, new List<ContactData>()
                ////    {

                ////   });
                //#endregion

                var contactsInList = listManager.GetContacts(contactList).ToArray();

                var item = Sitecore.Modules.EmailCampaign.Factory.GetMessage("{7ed7f001-65f6-4a2a-93f9-2543072b737e}");
                
                var page = 0;
                if (Request["UpdateContacts"] == "true")
                {
                    int.TryParse(Request["page"], out page);
                    var contacts = driver.Contacts.FindAllAs<Sitecore.Analytics.Model.ContactData>();
                    var contactRepository = new Sitecore.Analytics.Data.ContactRepository();
                    var leaseOwner = new Sitecore.Analytics.Model.LeaseOwner("UpdateContact-" + Guid.NewGuid().ToString(), Sitecore.Analytics.Model.LeaseOwnerType.OutOfRequestWorker);
                    var loopContacts = contacts.Skip(page*50000).Take(50000).ToArray();
                    var i = 0;

                    //listManager.AssociateContacts(contactList, from contact in loopContacts
                    //                                           select new ContactData()
                    //                                           {
                    //                                               ContactId = contact.ContactId,
                    //                                           });
                    foreach (var contact in loopContacts)
                    {
                        if (contactsInList.Any(cl => cl.ContactId == contact.ContactId))
                        {
                            continue;
                        }
                        var c = contactRepository.TryLoadContact(contact.ContactId, leaseOwner, TimeSpan.FromSeconds(30));
                        if (c != null || c.Object != null)
                        {
                            continue;
                        }
                        c.Object.ContactSaveMode = Sitecore.Analytics.Model.ContactSaveMode.AlwaysSave;
                        contactRepository.SaveContact(c.Object, new Sitecore.Analytics.DataAccess.ContactSaveOptions(true, leaseOwner));
                        contactRepository.ReleaseContact(contact.ContactId, leaseOwner);
                        i++;
                    }
                    
                    divReload.Visible = (i > 0);
                    litNumSaved.Text = i.ToString();
                }
            }
        </script>
    </div>
    </form>
</body>
</html>
