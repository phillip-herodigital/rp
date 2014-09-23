FSR.surveydefs = [{
    name: 'browse',
    invite: {
        when: 'onentry'
    },
    pop: {
        when: 'later',
		what: 'qualifier'
    },
    criteria: {
        sp: 70,
        lf: 2
    },
    include: {
        urls: ['.']
    }
}];
FSR.properties = {
    repeatdays : 90,

    repeatoverride : false,

    altcookie : {
    },

    language : {
        locale : 'en'
    },

    exclude : {
    },

    zIndexPopup : 10000,

    ignoreWindowTopCheck : false,

    ipexclude : 'fsr$ip',

    mobileHeartbeat : {
        delay : 60, /*mobile on exit heartbeat delay seconds*/
        max : 3600  /*mobile on exit heartbeat max run time seconds*/
    },

    invite : {

        // For no site logo, comment this line:
        siteLogo : "sitelogo.gif",

        //alt text fore site logo img
		siteLogoAlt : "",

        /* Desktop */
        dialogs : [[{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "Thank you for visiting Stream Energy. You have been selected to participate in a brief customer satisfaction survey to let us know how we can improve your experience.",
            noticeAboutSurvey: "The survey is designed to measure your entire experience, please look for it at the <u>conclusion</u> of your visit.",
            attribution: "This survey is conducted by an independent company ForeSee, on behalf of the site you are visiting.",
            closeInviteButtonText: "Click to close.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll give feedback"
        }]],

        exclude : {
            urls:[
'/StreamEnergy/Secure/SecretQuestion.aspx',
'/StreamEnergy/Enroll_Step1.aspx',
'/StreamEnergy/FindUserName.aspx',
'/StreamEnergy/ForgotPassword.aspx',
'/StreamEnergyGA/FindUserName.aspx',
'/StreamEnergyGA/ForgotPassword.aspx',
'/StreamEnergyGA/Enroll_Step1.aspx',
'/febo/logon.asp',
'/febo/forgot_Username.asp',
'/febo/sendPass.asp',
'/febo/enrollment.asp',
'/CommercialQuestionaire.aspx',
'/commercial_choice.asp',
'/nr_quote_zip.asp',
'/renew_customer_tx.asp',
'/interim_ga.asp',
'/signup_rec.asp',
'/StreamEnergy/OneTimeValidate.aspx',
'/StreamEnergy/OneTimeAdd.aspx',
'/StreamEnergyGA/OneTimeValidate.aspx',
'/StreamEnergyGA/OneTimeAdd.aspx',
'/cust_zip.asp',
'/cust_esi-id_2.asp',
'/cust_signup.asp',
'/cust_MoveInDate.asp',
'/cust_signup_new.asp',
'/cust_confirm.asp',
'/cust_thanks.asp',
'/gas_zip.asp',
'/gas_AGLC.asp',
'/gas_MoveInDate.asp',
'/gas_signup.asp',
'/gas_confirm.asp',
'/gas_summary.asp',
'/PlanSelection.aspx',
'/CustomerLite.aspx',
'/ServiceAddress.aspx',
'/CustomerHeavy.aspx',
'/CustomerPreferences.aspx',
'/Confirmation.aspx',
'/ThankYou.aspx',
'/renew_customer.asp',
'/StreamEnergy/Default.aspx',
'/StreamEnergyGA/Default.aspx',
'/StreamEnergy/Secure/Home.aspx',
'/StreamEnergy/Secure/ViewPay.aspx',
'/StreamEnergy/Secure/Messages.aspx',
'/StreamEnergy/Secure/Bills.aspx',
'/StreamEnergy/Secure/PayAdd.aspx',
'/StreamEnergy/Secure/FiledBills.aspx',
'/StreamEnergy/Secure/PayHistory.aspx',
'/StreamEnergy/Secure/PayDetails.aspx',
'/StreamEnergy/Secure/PayAccounts.aspx',
'/StreamEnergy/Secure/RecProfiles.aspx',
'/StreamEnergy/Secure/RecProfileEdit.aspx',
'/StreamEnergy/Secure/ProfileEdit.aspx',
'/StreamEnergy/Secure/Notifications.aspx',
'/StreamEnergy/Secure/Accounts.aspx',
'/StreamEnergy/Secure/ChangePassword.aspx',
'/StreamEnergyGA/Secure/Home.aspx',
'/StreamEnergyGA/Secure/ViewPay.aspx',
'/StreamEnergyGA/Secure/Messages.aspx',
'/StreamEnergyGA/Secure/Bills.aspx',
'/StreamEnergyGA/Secure/PayAdd.aspx',
'/StreamEnergyGA/Secure/FiledBills.aspx',
'/StreamEnergyGA/Secure/PayHistory.aspx',
'/StreamEnergyGA/Secure/PayDetails.aspx',
'/StreamEnergyGA/Secure/PayAccounts.aspx',
'/StreamEnergyGA/Secure/RecProfiles.aspx',
'/StreamEnergyGA/Secure/RecProfileEdit.aspx',
'/StreamEnergyGA/Secure/ProfileEdit.aspx',
'/StreamEnergyGA/Secure/Notifications.aspx',
'/StreamEnergyGA/Secure/Accounts.aspx',
'/StreamEnergyGA/Secure/ChangePassword.aspx',
'/StreamEnergyGA/Secure/SecretQuestion.aspx',
'/buy/',
'/signup/',
'/signup/personal_information',
'/signup/representative_information',
'/signup/additional_information',
'/signup/confirmation',
'/enrollment/'
		],
            referrers:[],
            userAgents:[],
            browsers:[],
            cookies:[],
            variables:[]
        },
        include : {
            local : [ '.' ]
        },

        delay : 0,
        timeout : 0,

        hideOnClick : false,

        hideCloseButton : false,

        css : 'foresee-dhtml.css',

        hide : [],

        hideFlash: false,

        type : 'dhtml',
        /* desktop */
        // url: 'invite.html'
        /* mobile */
        url : 'invite-mobile.html',
        back: 'url'

        //SurveyMutex: 'SurveyMutex'
    },

    tracker : {
        width : '690',
        height : '415',
        timeout : 3,
        adjust : true,
        alert : {
            enabled : true,
            message : 'The survey is now available.'
        },
        url : 'tracker.html'
    },

    survey : {
        width : 690,
        height : 600
    },

    qualifier : {
        footer : '<div div id=\"fsrcontainer\"><div style=\"float:left;width:80%;font-size:8pt;text-align:left;line-height:12px;\">This survey is conducted by an independent company ForeSee,<br>on behalf of the site you are visiting.</div><div style=\"float:right;font-size:8pt;\"><a target="_blank" title="Validate TRUSTe privacy certification" href="//privacy-policy.truste.com/click-with-confidence/ctv/en/www.foreseeresults.com/seal_m"><img border=\"0\" src=\"{%baseHref%}truste.png\" alt=\"Validate TRUSTe Privacy Certification\"></a></div></div>',
        width : '690',
        height : '500',
        bgcolor : '#333',
        opacity : 0.7,
        x : 'center',
        y : 'center',
        delay : 0,
        buttons : {
            accept : 'Continue'
        },
        hideOnClick : false,
        css : 'foresee-dhtml.css',
        url : 'reminder.html'
    },

    cancel : {
        url : 'cancel.html',
        width : '690',
        height : '400'
    },

    pop : {
        what : 'survey',
        after : 'leaving-site',
        pu : true,
        tracker : true
    },

    meta : {
        referrer : true,
        terms : true,
        ref_url : true,
        url : true,
        url_params : false,
        user_agent : false,
        entry : false,
        entry_params : false
    },

    events : {
        enabled : true,
        id : true,
        codes : {
            purchase : 800,
            items : 801,
            dollars : 802,
            followup : 803,
            information : 804,
            content : 805
        },
        pd : 7,
        custom : {}
    },

    previous : false,

	analytics : {
		google_local : false,
		google_remote : false
	},

    cpps : {},

    mode : 'hybrid'
};