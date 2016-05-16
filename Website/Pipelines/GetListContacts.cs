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
        private IEnumerable<DatabaseContact> GetAllContacts(bool useTestList, string[] ranks, string[] homesites, string[] associates, string[] langPrefs)
        {
            var contacts = new List<DatabaseContact>();
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

            var whereList = new List<string>();
            var parametersList = new List<SqlParameter>();
            whereList.Add("1=1");
            if (ranks.Any())
            {
                var values = new List<string>();
                for (var i=0; i<ranks.Length; i++)
                {
                    parametersList.Add(new SqlParameter("Rank" + i, ranks[i]));
                    values.Add("@Rank" + i);
                }
                whereList.Add("am.[IA Level] IN (" + string.Join(",", values) + ")");
            }
            if (homesites.Any())
            {
                var values = new List<string>();
                for (var i = 0; i < homesites.Length; i++)
                {
                    parametersList.Add(new SqlParameter("Homesite" + i, homesites[i]));
                    values.Add("@Homesite" + i);
                }
                whereList.Add("am.[HomeSite] IN (" + string.Join(",", values) + ")");
            }
            if (associates.Any())
            {
                var values = new List<string>();
                for (var i = 0; i < associates.Length; i++)
                {
                    parametersList.Add(new SqlParameter("Associates" + i, associates[i]));
                    values.Add("@Associates" + i);
                }
                whereList.Add("am.[Type] IN (" + string.Join(",", values) + ")");
            }
            if (langPrefs.Any())
            {
                var values = new List<string>();
                for (var i = 0; i < langPrefs.Length; i++)
                {
                    parametersList.Add(new SqlParameter("LangPref" + i, langPrefs[i]));
                    values.Add("@LangPref" + i);
                }
                whereList.Add("am.[LangPref] IN (" + string.Join(",", values) + ")");
            }

            var cmd = string.Format(@"
SELECT
    COALESCE(NULLIF(MAX(am.[Name_First]), ''), '_'), 
	MAX(am.[Name_Last]),
	am.[Primary Email],
	MAX(am.[Billing State]),
	MAX(am.[IA Level]),
	MAX(am.[LangPref])
FROM
	[Eagle].[dbo].[tblAssociatesAndHomesites] am
WHERE
	am.[Email Address Status] = 'V' AND
    am.[DStatusDesc] = 'Active' AND
    {0}
GROUP BY
    am.[Primary Email]",
    string.Join(" AND ", whereList)
    );

            using (var connection = new SqlConnection(dependencies.connectionString))
            {
                connection.Open();
                using (var sql_cmd = new SqlCommand(cmd, connection))
                {
                    sql_cmd.Parameters.AddRange(parametersList.ToArray());
                    
                    using (var reader = sql_cmd.ExecuteReader())
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

		public new  virtual void Process(GetAssociatedContactsArgs args)
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
                var ranks = (from level in ((Sitecore.Data.Fields.MultilistField)listItem.Fields["IA Level"]).GetItems()
                             select level.Fields["Database Value"].Value).ToArray();
                var homesites = (from level in ((Sitecore.Data.Fields.MultilistField)listItem.Fields["Has Homesite"]).GetItems()
                                 select level.Fields["Database Value"].Value).ToArray();
                var associates = (from level in ((Sitecore.Data.Fields.MultilistField)listItem.Fields["Associate Type"]).GetItems()
                                  select level.Fields["Database Value"].Value).ToArray();
                var langPrefs = (from level in ((Sitecore.Data.Fields.MultilistField)listItem.Fields["Language Preference"]).GetItems()
                                 select level.Fields["Database Value"].Value).ToArray();
                var key = "ContactList-" + args.ContactList.Id + string.Join("-", ranks) + string.Join("-", homesites) + string.Join("-",associates) + string.Join("-", langPrefs);
                List<Sitecore.ListManagement.ContentSearch.Model.ContactData> contactDatas = null;
                try
                {
                    contactDatas = RedisCacheExtensions.CacheGet<List<Sitecore.ListManagement.ContentSearch.Model.ContactData>>(dependencies.redis, key);
                }
                catch (Exception) { };

                if (contactDatas == null)
                {
                    var contacts = GetAllContacts(listItem.Fields["Use Test List"] != null && !string.IsNullOrEmpty(listItem.Fields["Use Test List"].Value), ranks, homesites, associates, langPrefs);

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

                    RedisCacheExtensions.CacheSet(dependencies.redis, key, contactDatas);
                    dependencies.redis.KeyExpire(key, TimeSpan.FromDays(3));
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