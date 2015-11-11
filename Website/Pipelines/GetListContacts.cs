using Microsoft.Practices.Unity;
using MongoDB.Bson;
using Sitecore.Analytics.Data;
using Sitecore.Analytics.DataAccess;
using Sitecore.Analytics.Model;
using Sitecore.Analytics.Rules.SegmentBuilder;
using Sitecore.Analytics.Tracking;
using Sitecore.Configuration;
using Sitecore.ContentSearch;
using Sitecore.Data;
using Sitecore.Diagnostics;
using Sitecore.ListManagement.Configuration;
using Sitecore.ListManagement.ContentSearch;
using Sitecore.ListManagement.ContentSearch.Model;
using Sitecore.ListManagement.ContentSearch.Pipelines;
using Sitecore.SecurityModel;
using StackExchange.Redis;
using StreamEnergy.Caching;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;

namespace StreamEnergy.MyStream.Pipelines
{
    public class GetListContacts : Sitecore.ListManagement.ContentSearch.Pipelines.GetAssociatedContacts.GetContactAssociations
	{
        private readonly Injection dependencies;

        public class Injection
        {
            [Dependency]
            public IDatabase redis { get; set; }

            [Dependency("Eagle.ConnectionString")]
            public string connectionString { get; set; }
        }
        public GetListContacts()
            : base()
		{
            dependencies = StreamEnergy.Unity.Container.Instance.Unity.Resolve<Injection>();
		}

        class DatabaseContact
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public string State { get; set; }
            public string IA_Level { get; set; }
            public string LanguagePreference { get; set; }
        }
        private IEnumerable<DatabaseContact> GetAllContacts(bool useTestList, string rank, string homesite, string assosiates, string langPref)
        {
            var contacts = new List<DatabaseContact>();
            var cmd_start = "@SELECT COALESCE(NULLIF(MAX(am.[Name_First]), ''), '_'), MAX(am.[Name_Last]), am.[Primary Email], MAX(am.[Billing State]), MAX(am.[IA Level]), MAX(am.[LangPref]) FROM [Eagle].[dbo].[tblAssociatesAndHomesites] am WHERE am.[Email Address Status] = 'V'";
            var cmd_end = " AND am.[DStatusDesc] = 'Active' GROUP BY am.[Primary Email]";
            if (!string.IsNullOrEmpty(rank))
                {
                cmd_start += " AND am.[IA_Level] = " + rank;
            }
            if (!string.IsNullOrEmpty(homesite))
            {
                cmd_start += " AND am.[Homesite] = " + homesite;
            }
            if (!string.IsNullOrEmpty(assosiates))
            {
                cmd_start += " AND am.[Type] = " + assosiates;
            }
            if (!string.IsNullOrEmpty(langPref))
            {
                cmd_start += " AND am.[LangPref] = " + langPref;
            }
            if (useTestList)
            {
                contacts.Add(new DatabaseContact()
                    {
                        FirstName = "Adam",
                        LastName = "Brill",
                        Email = "adam@responsivepath.com",
                        State = "CA",
                        IA_Level = "A",
                        LanguagePreference = "English",
                    });
                contacts.Add(new DatabaseContact()
                {
                    FirstName = "Adam",
                    LastName = "Brill",
                    Email = "adam@rpath.us",
                    State = "CA",
                    IA_Level = "A",
                    LanguagePreference = "English",
                });
                contacts.Add(new DatabaseContact()
                {
                    FirstName = "Adam",
                    LastName = "Brill",
                    Email = "adambrill@gmail.com",
                    State = "CA",
                    IA_Level = "A",
                    LanguagePreference = "English",
                });
                return contacts;
            }


            using (var connection = new SqlConnection(dependencies.connectionString))
            {
                connection.Open();

                using (
                    var cmd = new SqlCommand(cmd_start+cmd_end, connection))
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                contacts.Add(new DatabaseContact()
                                    {
                                        FirstName = reader.GetFieldValue<string>(0),
                                        LastName = reader.GetFieldValue<string>(1),
                                        Email = reader.GetFieldValue<string>(2),
                                        State = reader.GetFieldValue<string>(3),
                                        IA_Level = reader.GetFieldValue<string>(4),
                                        LanguagePreference = reader.GetFieldValue<string>(5),
                                    });
                            }
                        }
                    }
                }
            }
            return contacts;
        }

		public virtual void Process(GetAssociatedContactsArgs args)
		{
            var database = Sitecore.Data.Database.GetDatabase("master");
            var listItem = database.GetItem(new ID(args.ContactList.Id));
            if (listItem.Fields["Use Currents List"] == null || string.IsNullOrEmpty(listItem.Fields["Use Currents List"].Value))
            {
                base.Process(args);
                return;
            }
            try
            {
                var key = "ContactList-" + args.ContactList.Id;
                List<Sitecore.ListManagement.ContentSearch.Model.ContactData> contactDatas = null;
                try
                {
                    contactDatas = RedisCacheExtensions.CacheGet<List<Sitecore.ListManagement.ContentSearch.Model.ContactData>>(dependencies.redis, key);
                }
                catch (Exception) { };

                if (contactDatas == null)
                {
                    var rank = listItem.Fields["IA_Level"].Value;
                    var homesite = listItem.Fields["Homesite"].Value;
                    var assosiates = listItem.Fields["Type"].Value;
                    var langPref = listItem.Fields["LangPref"].Value;
                    var contacts = GetAllContacts(listItem.Fields["Use Test List"] != null && !string.IsNullOrEmpty(listItem.Fields["Use Test List"].Value), rank, homesite, assosiates, langPref);

                    contactDatas = (from databaseContact in contacts
                                    let contact = GetOrCreateContact(databaseContact.Email)
                                    select new Sitecore.ListManagement.ContentSearch.Model.ContactData()
                                    {
                                        FirstName = databaseContact.FirstName,
                                        Surname = databaseContact.LastName,
                                        Emails = new List<string>()
                                        {
                                            databaseContact.Email
                                        },
                                        ContactId = contact.ContactId,
                                        Identifier = contact.Identifiers.Identifier,
                                        PreferredEmail = databaseContact.Email,
                                    }).ToList();

                    using (new SecurityDisabler())
                    {
                        listItem.Editing.BeginEdit();
                        listItem.Fields["Recipients"].Value = contactDatas.Count.ToString();
                        listItem.Editing.EndEdit();
                    }

                    RedisCacheExtensions.CacheSet(dependencies.redis, key, contactDatas, TimeSpan.FromDays(3));
                }
                args.Contacts = contactDatas.AsQueryable();

            } catch (Exception ex)
            {
                var message = ex.Message;
            }
		}

        public Contact GetOrCreateContact(string userName)
        {
            ContactRepository contactRepository = Factory.CreateObject("tracking/contactRepository", true) as ContactRepository;
            ContactManager contactManager = Factory.CreateObject("tracking/contactManager", true) as ContactManager;

            Assert.IsNotNull(contactRepository, "contactRepository");
            Assert.IsNotNull(contactManager, "contactManager");

            try
            {
                Contact contact = contactRepository.LoadContactReadOnly(userName);
                LockAttemptResult<Contact> lockAttempt;

                if (contact == null)
                    lockAttempt = new LockAttemptResult<Contact>(LockAttemptStatus.NotFound, null, null);
                else
                    lockAttempt = contactManager.TryLoadContact(contact.ContactId);

                return GetOrCreateContact(userName, lockAttempt, contactRepository, contactManager);
            }
            catch (Exception ex)
            {
                throw new Exception(this.GetType() + " Contact could not be loaded/created - " + userName, ex);
            }
        }

        public void ReleaseAndSaveContact(Contact contact)
        {
            ContactManager manager = Factory.CreateObject("tracking/contactManager", true) as ContactManager;
            if (manager == null)
                throw new Exception(this.GetType() + " Could not instantiate " + typeof(ContactManager));
            manager.SaveAndReleaseContact(contact);
        }

        private Contact GetOrCreateContact(string userName, LockAttemptResult<Contact> lockAttempt, ContactRepository contactRepository, ContactManager contactManager)
        {
            switch (lockAttempt.Status)
            {
                case LockAttemptStatus.Success:
                    Contact lockedContact = lockAttempt.Object;
                    lockedContact.ContactSaveMode = ContactSaveMode.AlwaysSave;
                    return lockedContact;

                case LockAttemptStatus.NotFound:
                    Contact createdContact = CreateContact(userName, contactRepository);
                    contactManager.FlushContactToXdb(createdContact);
                    return GetOrCreateContact(userName);

                default:
                    throw new Exception(this.GetType() + " Contact could not be locked - " + userName);
            }
        }

        private Contact CreateContact(string userName, ContactRepository contactRepository)
        {
            Contact contact = contactRepository.CreateContact(ID.NewID);
            contact.Identifiers.Identifier = userName;
            contact.System.Value = 0;
            contact.System.VisitCount = 0;
            contact.ContactSaveMode = ContactSaveMode.AlwaysSave;
            return contact;
        }

	}
}