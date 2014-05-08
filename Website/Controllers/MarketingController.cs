using StreamEnergy.MyStream.Models.Marketing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers
{
    public class MarketingController : Controller
    {
        public ActionResult HomeLifeServices(string hash, string mock)
        {
            HomeLifeServices model = null;

            var hashValues = new Dictionary<string, string>();
            var parts = Encoding.UTF8.GetString(Convert.FromBase64String(hash)).Split(new string[] {"|"}, StringSplitOptions.RemoveEmptyEntries);
            foreach (var part in parts)
            {
                var pair = part.Split(new string[] {"="}, StringSplitOptions.RemoveEmptyEntries);
                hashValues[pair[0]] = pair[1];
            }

            if (hashValues["RefSite"] == "PowerCenter")
            {
				/*$client = new SoapClient($WSDL_URLs["DPI"]);
				$soap_response = $client->Stream_RetrieveIaContactInfo(array(
					"Auth_ID" => "Ignite",
					"Auth_PW" => "3t8sh8f3sg",
					"IA_Number" => $hashValues["IgniteAssociate"],
				));
				
				$response = $soap_response->Stream_RetrieveIaContactInfoResult->RetrieveIaContactInfo;
				
				//$formValues["campaignName"] = $response->;
				//$formValues["customerNumber"] = $response->;
				$formValues["firstName"] = $response->Name_First;
				$formValues["lastName"] = $response->Name_Last;
				$formValues["address1"] = $response->Street;
				$formValues["address2"] = $response->Street2;
				$formValues["city"] = $response->City;
				$formValues["state"] = $response->State;
				$formValues["zipCode"] = $response->Zip;
				$formValues["phone1"] = $response->Phone_Primary;
				$formValues["phone2"] = $response->Phone_Work;
				$formValues["phone3"] = $response->Phone_Cell;
				$formValues["repId"] = $hashValues["IgniteAssociate"];
				//$formValues["repFirstName"] = $response->;
				//$formValues["repLastName"] = $response->;
				//$formValues["repEmail"] = $response->;
				
				// Unused from WSDL:
				// Name_Company
                // Title
                // Phone_Fax
                // Email
                // Website*/
            }
            else if (new string[] {"MyStreamEnroll", "MyIgniteEnroll"}.Contains(hashValues["RefSite"]))
            {
				/*$client = new SoapClient($WSDL_URLs["STREAM_COMMONS"]);
				$soap_response = $client->GetCisAccountsByUtilityAccountNumber(array(
					"GetCisAccountsByUtilityAccountNumberRequest" => array(
						"utilityAccountNumber" => $hashValues["CamelotAccountNumber"],
						"customerPin" => $hashValues["Last4Ssn"],
						"cisOfRecord" => "",
					),
				));
				
				$response = $soap_response->GetCisAccountsByUtilityAccountNumberResponse->customerAccount;
				
				//$formValues["campaignName"] = $response->;
				$formValues["customerNumber"] = $response->cisAccountNumber;
				$formValues["firstName"] = $response->firstName;
				$formValues["lastName"] = $response->lastName;
				$formValues["address1"] = $response->billingAddress->street;
				$formValues["address2"] = $response->billingAddress->street2;
				$formValues["city"] = $response->billingAddress->city;
				$formValues["state"] = $response->billingAddress->state;
				$formValues["zipCode"] = $response->billingAddress->zipcode;
				$formValues["phone1"] = $response->primaryPhone;
				//$formValues["phone2"] = $response->;
				//$formValues["phone3"] = $response->;
				//$formValues["repId"] = $response->; // should populate from an additional call
				//$formValues["repFirstName"] = $response->;
				//$formValues["repLastName"] = $response->;
				//$formValues["repEmail"] = $response->;
				
				// Unused from WSDL:
	            // cisOfRecord
	            // camelotAccountNumber
	            // commodity
	            // emailAddress*/
            }
            else if (new string[] {"MyStreamRenew", "MyIgniteRenew", "IstaNetEnroll", "NEWelcomeEmail", "KubraMyAccount"}.Contains(hashValues["RefSite"]))
            {
				/*$client = new SoapClient($WSDL_URLs["STREAM_COMMONS"]);
				$soap_response = $client->GetCisAccountsByCisAccountNumber(array(
					"GetCisAccountsByCisAccountNumberRequest" => array(
						"cisAccountNumber" => $hashValues["CisCustomerNumber"],
						"customerPin" => $hashValues["Last4Ssn"],
						"cisOfRecord" => "",
					),
				));
				
				$response = $soap_response->GetCisAccountsByCisAccountNumberResponse->customerAccount;
				
				//$formValues["campaignName"] = $response->;
				$formValues["customerNumber"] = $response->cisAccountNumber;
				$formValues["firstName"] = $response->firstName;
				$formValues["lastName"] = $response->lastName;
				$formValues["address1"] = $response->billingAddress->street;
				$formValues["address2"] = $response->billingAddress->street2;
				$formValues["city"] = $response->billingAddress->city;
				$formValues["state"] = $response->billingAddress->state;
				$formValues["zipCode"] = $response->billingAddress->zipcode;
				$formValues["phone1"] = $response->primaryPhone;
				//$formValues["phone2"] = $response->;
				//$formValues["phone3"] = $response->;
				//$formValues["repId"] = $response->; // should populate from an additional call
				//$formValues["repFirstName"] = $response->;
				//$formValues["repLastName"] = $response->;
				//$formValues["repEmail"] = $response->;
				
				// Unused from WSDL:
	            // cisOfRecord
	            // camelotAccountNumber
	            // commodity
	            // emailAddress
				break;*/
		    }
		
		    if (string.IsNullOrEmpty(model.RepId) && !string.IsNullOrEmpty(model.CustomerNumber))
            {
			    /*$client = new SoapClient($WSDL_URLs["DPI"]);
			    $soap_response = $client->Stream_RetrieveIaContactInfo("", "", $formValues["customerNumber"]);
			
			    if ($soap_response->Stream_GetSponsorResult->ResultCode == "0") {
				    $formValues["repId"] = $soap_response->Stream_GetSponsorResult->SponsorNumber;
			    }*/
		    }

            if (mock == "test")
            {
                model = new HomeLifeServices()
                {
                    PostUrl = "/",
                    ClientID = "ClientID",
                    CampaignName = "CampaignName",
                    CustomerNumber = "CustomerNumber",
                    FirstName = "FirstName",
                    LastName = "LastName",
                    Address1 = "Address1",
                    Address2 = "Address2",
                    City = "City",
                    State = "State",
                    ZipCode = "ZipCode",
                    Phone1 = "Phone1",
                    Phone2 = "Phone2",
                    Phone3 = "Phone3",
                    RepId = "RepId",
                    RepFirstName = "RepFirstName",
                    RepLastName = "RepLastName",
                    RepEmail = "RepEmail",
                };
            }

            return View("~/Views/Pages/Marketing/Services/HomeLife Services.cshtml", model);
        }
	}
}