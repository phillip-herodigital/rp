using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using StreamEnergy.MyStream.Models.Account;

namespace StreamEnergy.MyStream.Models.Tests
{
    [TestClass]
    public class KubraLoginHelperTest
    {
        [TestMethod]
        public void KubraLogin()
        {
            // Arrange
            var kubraLogin = new KubraLoginHelper();

            // Act
            var loginSuccess = kubraLogin.Login(new MyStream.Models.Authentication.LoginRequest { Username = "chrishayden", Password = "G4e3s2G6" }).Result;

            // Assert
            //Assert.IsTrue(loginSuccess);
            Assert.Inconclusive("Didn't want to check in Chris's production password.");
        }
    }
}
