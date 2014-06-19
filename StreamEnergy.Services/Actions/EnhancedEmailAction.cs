using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.Workflows.Simple;
using StreamEnergy.Services.Clients;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Actions
{
    public class EnhancedEmailAction
    {
        private static IEmailService emailService = StreamEnergy.Unity.Container.Instance.Resolve<IEmailService>();
        public void Process(WorkflowPipelineArgs args)
        {
            Assert.ArgumentNotNull(args, "args");
            ProcessorItem processorItem = args.ProcessorItem;
            if (processorItem != null)
            {
                Item innerItem = processorItem.InnerItem;
                string fullPath = innerItem.Paths.FullPath;
                string from = GetText(innerItem, "from", args);
                string to = GetText(innerItem, "to", args);
                string host = GetText(innerItem, "mail server", args);
                string subject = GetText(innerItem, "subject", args);
                string body = GetText(innerItem, "message", args);
                Error.Assert(to.Length > 0, "The 'To' field is not specified in the mail action item: " + fullPath);
                Error.Assert(from.Length > 0, "The 'From' field is not specified in the mail action item: " + fullPath);
                Error.Assert(subject.Length > 0, "The 'Subject' field is not specified in the mail action item: " + fullPath);
                Error.Assert(host.Length > 0, "The 'Mail server' field is not specified in the mail action item: " + fullPath);

                // Send the email
                MailMessage Message = new MailMessage();
                Message.From = new MailAddress(from);
                Message.To.Add(to);
                Message.Subject = subject;
                Message.IsBodyHtml = false;
                Message.Body = body;

                emailService.SendEmail(Message);
            }
        }

        private string GetText(Item commandItem, string field, WorkflowPipelineArgs args)
        {
            string text = commandItem[field];
            if (text.Length <= 0) return String.Empty;

            return ReplaceVariables(text, args);
        }

        private string ReplaceVariables(string text, WorkflowPipelineArgs args)
        {
            Item workflowItem = args.DataItem;

            text = text.Replace("$itemPath$", workflowItem.Paths.FullPath);
            text = text.Replace("$itemLanguage$", workflowItem.Language.ToString());
            text = text.Replace("$itemAuthor$", Sitecore.Context.User.GetLocalName());
            text = text.Replace("$itemVersion$", workflowItem.Version.ToString());

            return text;
        }
    }
}
