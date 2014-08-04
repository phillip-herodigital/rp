using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Accounts
{
    /// <summary>
    /// This class is intended to act as a proper Domain Model of an account in the Stream Energy system.  Because all of our information about
    /// accounts comes from a service, we cannot guarantee that any particular piece of information is loaded at any given time; these properties 
    /// will be null.  This means that users must be prepared to null-check often and request more information from an IAccountService as needed.
    /// 
    /// As such, there is also a <seealso cref="Account<TSubAccount>"/> that handles typed account data, such as sub accounts and possibly other 
    /// specific account-type things.
    /// </summary>
    public class Account
    {
        public Account()
        {
            Capabilities = new List<IAccountCapability>();
        }

        public string AccountNumber { get; set; }
        public string AccountType { get; set; }

        public decimal AccountBalance { get; set; }
        public DateTime DueDate { get; set; }

        public Invoice CurrentInvoice { get; set; }

        public IEnumerable<Invoice> Invoices { get; set; }

        public IEnumerable<ISubAccount> SubAccounts { get; set; }

        /// <summary>
        /// Capabilities on accounts, since they might not be loaded, do not indicate anything simply by presence; the absence would simply mean
        /// they are not loaded. As such, account capabilities need to be either present or not, and not listed multiple times.
        /// </summary>
        public List<IAccountCapability> Capabilities { get; private set; }

        /// <summary>
        /// Gets the capability of the specified type, or throws an exception if it is not found.
        /// </summary>
        /// <typeparam name="T">The type of the capability to locate</typeparam>
        /// <returns>The output capability.</returns>
        /// <exception cref="InvalidOperationException">The capability type was not found.</exception>
        public T GetCapability<T>()
            where T : IAccountCapability
        {
            if (Capabilities == null)
            {
                throw new InvalidOperationException();
            }
            return Capabilities.OfType<T>().First();
        }

        /// <summary>
        /// Gets the capability of the specified type, if it is loaded.
        /// </summary>
        /// <typeparam name="T">The type of the capability to locate</typeparam>
        /// <param name="capability">The output capability if successful.</param>
        /// <returns>True if at least one capability of the given type existed in the Capabilities.</returns>
        public bool TryGetCapability<T>(out T capability)
            where T : IAccountCapability
        {
            if (Capabilities == null)
            {
                capability = default(T);
                return false;
            }
            var temp = Capabilities.OfType<T>().Take(1).ToArray();
            capability = temp.FirstOrDefault();
            return temp.Any();
        }
    }
}
