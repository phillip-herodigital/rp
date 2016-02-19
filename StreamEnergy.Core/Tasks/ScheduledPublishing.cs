﻿using Sitecore;
using Sitecore.Configuration;
using Sitecore.Data;
using Sitecore.Diagnostics;
using Sitecore.Diagnostics.PerformanceCounters;
using Sitecore.Globalization;
using Sitecore.StringExtensions;
using Sitecore.Publishing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Rules.Conditions;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace StreamEnergy.Tasks
{
    public class ScheduledPublishing
    {
        private readonly List<Language> _languages;
        private readonly PublishMode _mode;
        private readonly string _sourceDatabase;
        private readonly string _targetDatabase;
        private readonly Injection _dependencies;
        public List<Language> Languages
        {
            get
            {
                return this._languages;
            }
        }

        public PublishMode Mode
        {
            get
            {
                return this._mode;
            }
        }

        public string SourceDatabase
        {
            get
            {
                return this._sourceDatabase;
            }
        }

        public string TargetDatabase
        {
            get
            {
                return this._targetDatabase;
            }
        }
        public DateTime LastPublishTime { get; set; }

        public class Injection
        {
            [Dependency]
            public ISettings Settings { get; set; }
        }

        // Methods
        public ScheduledPublishing()
        {
            this._dependencies = StreamEnergy.Unity.Container.Instance.Resolve<Injection>();
        }

        public ScheduledPublishing(Injection injectedValue)
        {
            this._dependencies = injectedValue;
        }

        public ScheduledPublishing(string sourceDatabase, string targetDatabase, string mode, string languages)
        {
            Assert.ArgumentNotNullOrEmpty(sourceDatabase, "sourceDatabase");
            Assert.ArgumentNotNullOrEmpty(targetDatabase, "targetDatabase");
            Assert.ArgumentNotNullOrEmpty(mode, "mode");
            Assert.ArgumentNotNullOrEmpty(languages, "languages");
            this._dependencies = StreamEnergy.Unity.Container.Instance.Unity.Resolve<Injection>();
            this._sourceDatabase = sourceDatabase;
            this._targetDatabase = targetDatabase;
            this._languages = ParseLanguages(languages);
            this._mode = ParseMode(mode);
            this.LastPublishTime = DateTime.Now;
            Assert.IsTrue(this._languages.Any(), "No languages specified in PublishAgent constructor.");
        }

        public ScheduledPublishing(string sourceDatabase, string targetDatabase, string mode, string languages, Injection injectedValue)
        {
            Assert.ArgumentNotNullOrEmpty(sourceDatabase, "sourceDatabase");
            Assert.ArgumentNotNullOrEmpty(targetDatabase, "targetDatabase");
            Assert.ArgumentNotNullOrEmpty(mode, "mode");
            Assert.ArgumentNotNullOrEmpty(languages, "languages");
            this._dependencies = injectedValue;
            this._sourceDatabase = sourceDatabase;
            this._targetDatabase = targetDatabase;
            this._languages = ParseLanguages(languages);
            this._mode = ParseMode(mode);
            this.LastPublishTime = DateTime.Now;
            Assert.IsTrue(this._languages.Any(), "No languages specified in PublishAgent constructor.");
        }

        private static List<Language> ParseLanguages(string languages)
        {
            List<Language> list = new List<Language>();
            foreach (string str in languages.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                if (str.Any())
                {
                    list.Add(Language.Parse(str.Trim()));
                }
            }
            return list;
        }

        private static PublishMode ParseMode(string mode)
        {
            if (mode.Equals("Full", StringComparison.InvariantCultureIgnoreCase))
                return PublishMode.Full;
            if (mode.Equals("Incremental", StringComparison.InvariantCultureIgnoreCase))
                return PublishMode.Incremental;
            if (mode.Equals("Smart", StringComparison.InvariantCultureIgnoreCase))
                return PublishMode.Smart;
            return PublishMode.Unknown;
        }


        public void Run()
        {
            if (this.IsPublishingTime() && this.IsPublishingEnabled())
            {
                foreach (Language language in this._languages)
                {
                    this.StartPublish(language);
                }
            }
        }
        private bool IsPublishingTime()
        {
            TimeSpan timeDiff = DateTime.Now - LastPublishTime;
            if ((DateTime.Now.Minute == 1 || DateTime.Now.Minute == 31) && LastPublishTime.AddMinutes(5) < DateTime.Now)
            {
                LastPublishTime = DateTime.Now;
                return true;
            }
            return false;
        }
        private bool IsPublishingEnabled()
        {
            var AutoPublishValue = _dependencies.Settings.GetSettingsValue("AutoPublish", "AutoPublish", "master");
            return !string.IsNullOrEmpty(AutoPublishValue);
        }
        private void StartPublish(Language language)
        {
            Assert.ArgumentNotNull(language, "language");
            Log.Info("PublishAgent started (source: {0}, target: {1}, mode: {2})".FormatWith(new object[] { this._sourceDatabase, this._targetDatabase, this._mode }), this);
            Database database = Factory.GetDatabase(this._sourceDatabase);
            Database database2 = Factory.GetDatabase(this._targetDatabase);
            Assert.IsNotNull(database, "Unknown database: {0}", new object[] { this._sourceDatabase });
            Assert.IsNotNull(database2, "Unknown database: {0}", new object[] { this._targetDatabase });

            PublishOptions options = new PublishOptions(database, database2, this.Mode, language, DateTime.Now)
            {
                Deep = true
            };
            Publisher publisher = new Publisher(options);
            bool willBeQueued = publisher.WillBeQueued;
            publisher.PublishAsync();
            Log.Info("Asynchronous publishing {0}. Job name: {1}".FormatWith(new object[] { willBeQueued ? "queued" : "started", publisher.GetJobName() }), this);
#pragma warning disable 0618
            TaskCounters.Publishings.Increment();
#pragma warning restore 0618
        }
    }
}
