require.config({
  paths: {
    mockjax: "/sitecore/shell/client/Business Component Library/version 2/Assets/lib/test/jquery.mockjax"
  }
});
define(["mockjax"], function () {
  describe("Given a QueryDataSource component", function() {

    var app = Sitecore.Speak.app,
      sut1 = app.DataSource1,
      sut2 = app.DataSource2,
      sut3 = app.DataSource3,
      sut4 = app.DataSource4,
      sut5 = app.DataSource5;

    var defaultResponse = { "statusCode": 200, "result": { "totalCount": 111, "resultCount": 20, "items": [{ "Category": "Default Website", "Database": "master", "DisplayName": "cover", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/04DAD0FDDB664070881F17264CA257E1.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{04DAD0FD-DB66-4070-881F-17264CA257E1}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{4D8A1C4D-1351-4DD1-A502-0660F01FEDC7}/{04DAD0FD-DB66-4070-881F-17264CA257E1}", "MediaUrl": "/sitecore/shell/~/media/Default Website/cover.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "cover", "Path": "/sitecore/media library/Default Website/cover", "Template": "System/Media/Unversioned/Jpeg", "TemplateId": "{DAF085E8-602E-43A6-8299-038FF171349F}", "TemplateName": "Jpeg", "Url": "~/link.aspx?_id=04DAD0FDDB664070881F17264CA257E1\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Thursday, October 09, 2014 12:06 PM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "1600 x 550" } } }, { "Category": "Default Website", "Database": "master", "DisplayName": "sc_logo", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/094AED0302E7486880CB19926661FB77.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{094AED03-02E7-4868-80CB-19926661FB77}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{4D8A1C4D-1351-4DD1-A502-0660F01FEDC7}/{094AED03-02E7-4868-80CB-19926661FB77}", "MediaUrl": "/sitecore/shell/~/media/Default Website/sc_logo.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "sc_logo", "Path": "/sitecore/media library/Default Website/sc_logo", "Template": "System/Media/Unversioned/Image", "TemplateId": "{F1828A2C-7E5D-4BBD-98CA-320474871548}", "TemplateName": "Image", "Url": "~/link.aspx?_id=094AED0302E7486880CB19926661FB77\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Thursday, October 09, 2014 12:07 PM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "204 x 51" } } }, { "Category": "Simulator Backgrounds", "Database": "master", "DisplayName": "Android Tablet", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/B8415FE41F43488E8EA9AEF1337EF914.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{B8415FE4-1F43-488E-8EA9-AEF1337EF914}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{76DBBDDE-9A96-414C-846F-36D7FD8BFDC3}/{B8415FE4-1F43-488E-8EA9-AEF1337EF914}", "MediaUrl": "/sitecore/shell/~/media/System/Simulator Backgrounds/Android Tablet.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "Android Tablet", "Path": "/sitecore/media library/System/Simulator Backgrounds/Android Tablet", "Template": "System/Media/Unversioned/Jpeg", "TemplateId": "{DAF085E8-602E-43A6-8299-038FF171349F}", "TemplateName": "Jpeg", "Url": "~/link.aspx?_id=B8415FE41F43488E8EA9AEF1337EF914\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Friday, April 06, 2012 11:58 AM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "970 x 1441" } } }, { "Category": "Simulator Backgrounds", "Database": "master", "DisplayName": "Android Tablet_landscape", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/A0C1DCFD3D90478F864FD448D9467ABB.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{A0C1DCFD-3D90-478F-864F-D448D9467ABB}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{76DBBDDE-9A96-414C-846F-36D7FD8BFDC3}/{A0C1DCFD-3D90-478F-864F-D448D9467ABB}", "MediaUrl": "/sitecore/shell/~/media/System/Simulator Backgrounds/Android Tablet_landscape.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "Android Tablet_landscape", "Path": "/sitecore/media library/System/Simulator Backgrounds/Android Tablet_landscape", "Template": "System/Media/Unversioned/Jpeg", "TemplateId": "{DAF085E8-602E-43A6-8299-038FF171349F}", "TemplateName": "Jpeg", "Url": "~/link.aspx?_id=A0C1DCFD3D90478F864FD448D9467ABB\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Friday, April 06, 2012 11:58 AM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "1441 x 970" } } }, { "Category": "Simulator Backgrounds", "Database": "master", "DisplayName": "Blackberry", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/65AE88A6BE9B40229BFF49E66E3DC6D3.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{65AE88A6-BE9B-4022-9BFF-49E66E3DC6D3}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{76DBBDDE-9A96-414C-846F-36D7FD8BFDC3}/{65AE88A6-BE9B-4022-9BFF-49E66E3DC6D3}", "MediaUrl": "/sitecore/shell/~/media/System/Simulator Backgrounds/Blackberry.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "Blackberry", "Path": "/sitecore/media library/System/Simulator Backgrounds/Blackberry", "Template": "System/Media/Unversioned/Jpeg", "TemplateId": "{DAF085E8-602E-43A6-8299-038FF171349F}", "TemplateName": "Jpeg", "Url": "~/link.aspx?_id=65AE88A6BE9B40229BFF49E66E3DC6D3\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Friday, April 06, 2012 11:58 AM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "558 x 952" } } }, { "Category": "Simulator Backgrounds", "Database": "master", "DisplayName": "Feature Phone", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/E6BA438DB1124BEFAE3C4F0C046868D6.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{E6BA438D-B112-4BEF-AE3C-4F0C046868D6}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{76DBBDDE-9A96-414C-846F-36D7FD8BFDC3}/{E6BA438D-B112-4BEF-AE3C-4F0C046868D6}", "MediaUrl": "/sitecore/shell/~/media/System/Simulator Backgrounds/Feature Phone.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "Feature Phone", "Path": "/sitecore/media library/System/Simulator Backgrounds/Feature Phone", "Template": "System/Media/Unversioned/Jpeg", "TemplateId": "{DAF085E8-602E-43A6-8299-038FF171349F}", "TemplateName": "Jpeg", "Url": "~/link.aspx?_id=E6BA438DB1124BEFAE3C4F0C046868D6\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Friday, April 06, 2012 11:59 AM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "351 x 833" } } }, { "Category": "Simulator Backgrounds", "Database": "master", "DisplayName": "HD TV", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/DE305E7DD74B4ABBBEA04A3A9D0137EF.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{DE305E7D-D74B-4ABB-BEA0-4A3A9D0137EF}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{76DBBDDE-9A96-414C-846F-36D7FD8BFDC3}/{DE305E7D-D74B-4ABB-BEA0-4A3A9D0137EF}", "MediaUrl": "/sitecore/shell/~/media/System/Simulator Backgrounds/HD TV.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "HD TV", "Path": "/sitecore/media library/System/Simulator Backgrounds/HD TV", "Template": "System/Media/Unversioned/Jpeg", "TemplateId": "{DAF085E8-602E-43A6-8299-038FF171349F}", "TemplateName": "Jpeg", "Url": "~/link.aspx?_id=DE305E7DD74B4ABBBEA04A3A9D0137EF\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Friday, September 02, 2011 5:00 PM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "2276 x 1556" } } }, { "Category": "Simulator Backgrounds", "Database": "master", "DisplayName": "Large Android phone", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/6C9ADE963328411AA614EB95E6DA320E.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{6C9ADE96-3328-411A-A614-EB95E6DA320E}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{76DBBDDE-9A96-414C-846F-36D7FD8BFDC3}/{6C9ADE96-3328-411A-A614-EB95E6DA320E}", "MediaUrl": "/sitecore/shell/~/media/System/Simulator Backgrounds/Large Android phone.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "Large Android phone", "Path": "/sitecore/media library/System/Simulator Backgrounds/Large Android phone", "Template": "System/Media/Unversioned/Jpeg", "TemplateId": "{DAF085E8-602E-43A6-8299-038FF171349F}", "TemplateName": "Jpeg", "Url": "~/link.aspx?_id=6C9ADE963328411AA614EB95E6DA320E\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Friday, April 06, 2012 11:58 AM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "912 x 1688" } } }, { "Category": "Simulator Backgrounds", "Database": "master", "DisplayName": "Large Android phone_landscape", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/DF1D83F8D8134445A94F1DB2067DAF2A.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{DF1D83F8-D813-4445-A94F-1DB2067DAF2A}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{76DBBDDE-9A96-414C-846F-36D7FD8BFDC3}/{DF1D83F8-D813-4445-A94F-1DB2067DAF2A}", "MediaUrl": "/sitecore/shell/~/media/System/Simulator Backgrounds/Large Android phone_landscape.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "Large Android phone_landscape", "Path": "/sitecore/media library/System/Simulator Backgrounds/Large Android phone_landscape", "Template": "System/Media/Unversioned/Jpeg", "TemplateId": "{DAF085E8-602E-43A6-8299-038FF171349F}", "TemplateName": "Jpeg", "Url": "~/link.aspx?_id=DF1D83F8D8134445A94F1DB2067DAF2A\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Friday, April 06, 2012 11:58 AM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "1688 x 912" } } }, { "Category": "Simulator Backgrounds", "Database": "master", "DisplayName": "Windows Phone", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/63EA428F83C34F95BED587FC267652B4.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{63EA428F-83C3-4F95-BED5-87FC267652B4}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{76DBBDDE-9A96-414C-846F-36D7FD8BFDC3}/{63EA428F-83C3-4F95-BED5-87FC267652B4}", "MediaUrl": "/sitecore/shell/~/media/System/Simulator Backgrounds/Windows Phone.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "Windows Phone", "Path": "/sitecore/media library/System/Simulator Backgrounds/Windows Phone", "Template": "System/Media/Unversioned/Jpeg", "TemplateId": "{DAF085E8-602E-43A6-8299-038FF171349F}", "TemplateName": "Jpeg", "Url": "~/link.aspx?_id=63EA428F83C34F95BED587FC267652B4\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Friday, April 06, 2012 11:59 AM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "606 x 1154" } } }, { "Category": "Simulator Backgrounds", "Database": "master", "DisplayName": "Windows Phone_ landscape", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/9C92CD3BFE2546F68F78B0D7BFEBCFBC.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{9C92CD3B-FE25-46F6-8F78-B0D7BFEBCFBC}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{76DBBDDE-9A96-414C-846F-36D7FD8BFDC3}/{9C92CD3B-FE25-46F6-8F78-B0D7BFEBCFBC}", "MediaUrl": "/sitecore/shell/~/media/System/Simulator Backgrounds/Windows Phone_ landscape.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "Windows Phone_ landscape", "Path": "/sitecore/media library/System/Simulator Backgrounds/Windows Phone_ landscape", "Template": "System/Media/Unversioned/Jpeg", "TemplateId": "{DAF085E8-602E-43A6-8299-038FF171349F}", "TemplateName": "Jpeg", "Url": "~/link.aspx?_id=9C92CD3BFE2546F68F78B0D7BFEBCFBC\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Friday, April 06, 2012 11:59 AM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "1154 x 606" } } }, { "Category": "Presets", "Database": "master", "DisplayName": "Unknown 128x128", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/-/media/715C5BB4358445108815C42F88B1034E.ashx?h=16\u0026thn=1\u0026w=16", "ID": "{715C5BB4-3584-4510-8815-C42F88B1034E}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{55CDBC4D-38B0-4DB8-8A6E-0C9FBBE8F3A7}/{A227A241-3E6C-4841-BB1D-2770FBA46621}/{715C5BB4-3584-4510-8815-C42F88B1034E}", "MediaUrl": "/sitecore/shell/~/media/Experience Explorer/Presets/Unknown 128x128.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "Unknown 128x128", "Path": "/sitecore/media library/Experience Explorer/Presets/Unknown 128x128", "Template": "System/Media/Unversioned/Jpeg", "TemplateId": "{DAF085E8-602E-43A6-8299-038FF171349F}", "TemplateName": "Jpeg", "Url": "~/link.aspx?_id=715C5BB4358445108815C42F88B1034E\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Wednesday, February 27, 2013 12:58 PM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "128 x 128" } } }, { "Category": "Page Event Images", "Database": "master", "DisplayName": "Begin Transaction", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/831D2FDF98A946ADAFC8AF4918213068.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{831D2FDF-98A9-46AD-AFC8-AF4918213068}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{B43AFD99-AFE1-4A6D-A4B2-3844BE73C9BE}/{831D2FDF-98A9-46AD-AFC8-AF4918213068}", "MediaUrl": "/sitecore/shell/~/media/System/Page Event Images/Begin Transaction.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "Begin Transaction", "Path": "/sitecore/media library/System/Page Event Images/Begin Transaction", "Template": "System/Media/Unversioned/Image", "TemplateId": "{F1828A2C-7E5D-4BBD-98CA-320474871548}", "TemplateName": "Image", "Url": "~/link.aspx?_id=831D2FDF98A946ADAFC8AF4918213068\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Thursday, February 13, 2014 10:49 AM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "128 x 128" } } }, { "Category": "Page Event Images", "Database": "master", "DisplayName": "Campaign", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/23656F9577394C1FA1C3825D1C3129F8.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{23656F95-7739-4C1F-A1C3-825D1C3129F8}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{B43AFD99-AFE1-4A6D-A4B2-3844BE73C9BE}/{23656F95-7739-4C1F-A1C3-825D1C3129F8}", "MediaUrl": "/sitecore/shell/~/media/System/Page Event Images/Campaign.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "Campaign", "Path": "/sitecore/media library/System/Page Event Images/Campaign", "Template": "System/Media/Unversioned/Image", "TemplateId": "{F1828A2C-7E5D-4BBD-98CA-320474871548}", "TemplateName": "Image", "Url": "~/link.aspx?_id=23656F9577394C1FA1C3825D1C3129F8\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Thursday, February 13, 2014 10:49 AM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "128 x 128" } } }, { "Category": "Page Event Images", "Database": "master", "DisplayName": "Campaign Registration Failed", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/A3E770457F174EFC93321EE28AD97417.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{A3E77045-7F17-4EFC-9332-1EE28AD97417}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{B43AFD99-AFE1-4A6D-A4B2-3844BE73C9BE}/{A3E77045-7F17-4EFC-9332-1EE28AD97417}", "MediaUrl": "/sitecore/shell/~/media/System/Page Event Images/Campaign Registration Failed.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "Campaign Registration Failed", "Path": "/sitecore/media library/System/Page Event Images/Campaign Registration Failed", "Template": "System/Media/Unversioned/Image", "TemplateId": "{F1828A2C-7E5D-4BBD-98CA-320474871548}", "TemplateName": "Image", "Url": "~/link.aspx?_id=A3E770457F174EFC93321EE28AD97417\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Thursday, February 13, 2014 10:49 AM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "128 x 128" } } }, { "Category": "Page Event Images", "Database": "master", "DisplayName": "Cancel Transaction", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/0A91E5D5715B40BAA457CF22E4CCE1A9.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{0A91E5D5-715B-40BA-A457-CF22E4CCE1A9}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{B43AFD99-AFE1-4A6D-A4B2-3844BE73C9BE}/{0A91E5D5-715B-40BA-A457-CF22E4CCE1A9}", "MediaUrl": "/sitecore/shell/~/media/System/Page Event Images/Cancel Transaction.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "Cancel Transaction", "Path": "/sitecore/media library/System/Page Event Images/Cancel Transaction", "Template": "System/Media/Unversioned/Image", "TemplateId": "{F1828A2C-7E5D-4BBD-98CA-320474871548}", "TemplateName": "Image", "Url": "~/link.aspx?_id=0A91E5D5715B40BAA457CF22E4CCE1A9\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Thursday, February 13, 2014 10:49 AM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "128 x 128" } } }, { "Category": "Page Event Images", "Database": "master", "DisplayName": "Download Brochure", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/93D49B7D03084678AABF0DE750C55194.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{93D49B7D-0308-4678-AABF-0DE750C55194}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{B43AFD99-AFE1-4A6D-A4B2-3844BE73C9BE}/{93D49B7D-0308-4678-AABF-0DE750C55194}", "MediaUrl": "/sitecore/shell/~/media/System/Page Event Images/Download Brochure.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "Download Brochure", "Path": "/sitecore/media library/System/Page Event Images/Download Brochure", "Template": "System/Media/Unversioned/Image", "TemplateId": "{F1828A2C-7E5D-4BBD-98CA-320474871548}", "TemplateName": "Image", "Url": "~/link.aspx?_id=93D49B7D03084678AABF0DE750C55194\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Thursday, February 13, 2014 10:49 AM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "128 x 128" } } }, { "Category": "Page Event Images", "Database": "master", "DisplayName": "Download", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/00299D923A8C410C9EB011CD29C6DB85.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{00299D92-3A8C-410C-9EB0-11CD29C6DB85}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{B43AFD99-AFE1-4A6D-A4B2-3844BE73C9BE}/{00299D92-3A8C-410C-9EB0-11CD29C6DB85}", "MediaUrl": "/sitecore/shell/~/media/System/Page Event Images/Download.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "Download", "Path": "/sitecore/media library/System/Page Event Images/Download", "Template": "System/Media/Unversioned/Image", "TemplateId": "{F1828A2C-7E5D-4BBD-98CA-320474871548}", "TemplateName": "Image", "Url": "~/link.aspx?_id=00299D923A8C410C9EB011CD29C6DB85\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Thursday, February 13, 2014 10:49 AM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "128 x 128" } } }, { "Category": "Page Event Images", "Database": "master", "DisplayName": "End Transaction", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/C34B9E7B55E24209A66DCD4169F4582F.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{C34B9E7B-55E2-4209-A66D-CD4169F4582F}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{B43AFD99-AFE1-4A6D-A4B2-3844BE73C9BE}/{C34B9E7B-55E2-4209-A66D-CD4169F4582F}", "MediaUrl": "/sitecore/shell/~/media/System/Page Event Images/End Transaction.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "End Transaction", "Path": "/sitecore/media library/System/Page Event Images/End Transaction", "Template": "System/Media/Unversioned/Image", "TemplateId": "{F1828A2C-7E5D-4BBD-98CA-320474871548}", "TemplateName": "Image", "Url": "~/link.aspx?_id=C34B9E7B55E24209A66DCD4169F4582F\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Thursday, February 13, 2014 10:49 AM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "128 x 128" } } }, { "Category": "Page Event Images", "Database": "master", "DisplayName": "Error", "HasChildren": false, "Icon": "/sitecore/shell/themes/standard/~/media/BFC559745B6845F2A3ADA993E29777D7.ashx?h=16\u0026thn=1\u0026w=16\u0026db=master", "ID": "{BFC55974-5B68-45F2-A3AD-A993E29777D7}", "Language": "en", "LongID": "/{11111111-1111-1111-1111-111111111111}/{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}/{7F864298-A4D8-4CE5-B8AC-A6D4DBA439D3}/{B43AFD99-AFE1-4A6D-A4B2-3844BE73C9BE}/{BFC55974-5B68-45F2-A3AD-A993E29777D7}", "MediaUrl": "/sitecore/shell/~/media/System/Page Event Images/Error.ashx?bc=Transparent\u0026db=master\u0026thn=1", "Name": "Error", "Path": "/sitecore/media library/System/Page Event Images/Error", "Template": "System/Media/Unversioned/Image", "TemplateId": "{F1828A2C-7E5D-4BBD-98CA-320474871548}", "TemplateName": "Image", "Url": "~/link.aspx?_id=BFC559745B6845F2A3ADA993E29777D7\u0026amp;_z=z", "Version": 1, "Fields": { "{25BED78C-4957-4165-998A-CA1B52F67497}": { "Name": "__Created", "Type": "datetime", "Value": "Thursday, February 13, 2014 10:49 AM" }, "{CB09946F-3218-4823-87D2-D5007C199A96}": { "Name": "Dimensions", "Type": "text", "Value": "128 x 128" } } }], "facets": [{ "Name": "Dimensions", "Values": [{ "Count": 6, "DisplayText": "Huge", "Priority": 0, "Text": "huge", "Value": "calculateddimension:huge" }, { "Count": 10, "DisplayText": "Large", "Priority": 0, "Text": "large", "Value": "calculateddimension:large" }, { "Count": 42, "DisplayText": "Medium", "Priority": 0, "Text": "medium", "Value": "calculateddimension:medium" }, { "Count": 53, "DisplayText": "Small", "Priority": 0, "Text": "small", "Value": "calculateddimension:small" }] }, { "Name": "Media type", "Values": [{ "Count": 100, "DisplayText": "Image", "Priority": 0, "Text": "image", "Value": "_templatename:image" }, { "Count": 11, "DisplayText": "Jpeg", "Priority": 0, "Text": "jpeg", "Value": "_templatename:jpeg" }] }, { "Name": "Date uploaded", "Values": [{ "Count": 0, "DisplayText": "Today", "Priority": 1, "Text": "Today", "Value": "__smallupdateddate:[20150505T2100Z TO 20150506T2059Z]" }, { "Count": 0, "DisplayText": "Yesterday", "Priority": 2, "Text": "Yesterday", "Value": "__smallupdateddate:[20150504T2100Z TO 20150505T2059Z]" }, { "Count": 0, "DisplayText": "2-4 days ago", "Priority": 3, "Text": "2-4 days ago", "Value": "__smallupdateddate:[20150501T2100Z TO 20150504T2059Z]" }, { "Count": 0, "DisplayText": "Last month", "Priority": 4, "Text": "Last month", "Value": "__smallupdateddate:[20150405T2100Z TO 20150501T2059Z]" }, { "Count": 34, "DisplayText": "2-4 months ago", "Priority": 5, "Text": "2-4 months ago", "Value": "__smallupdateddate:[20150105T2100Z TO 20150405T2059Z]" }, { "Count": 77, "DisplayText": "Older", "Priority": 6, "Text": "Older", "Value": "__smallupdateddate:[00010101T0000Z TO 20150105T2059Z]" }] }] } }
    var error401Response = { statusCode: 401 };
    var error500Response = { statusCode: 500, error: {message: "Error"} };
    var getQueryParams = function(queryString) {
      if (!queryString) {
        return false;
      }      
      var tmpurl = queryString.split("?");
      var url = tmpurl[0];
      if (tmpurl.length == 1)
        return {
          url: url
        };
      query = tmpurl[1];
      return {
        url: url,
        params: _
          .chain(query.split('&'))
          .map(function(params) {
            var p = params.split('=');
            return [p[0], decodeURIComponent(p[1])];
          })
          .object()
          .value()
      };
    };

    var initMockjax = function(callback, response) {
      $.mockjax(function(settings) {
        var should = true,
          queryParams = getQueryParams(settings.url);
        if (callback) {
          should = callback(queryParams);
        }
        if (settings.url != "" && should) {
          return {
            contentType: 'text/json',
            responseText: response
          };
        }

        return;
      });
    };

    afterEach(function () {
      $.mockjax.clear();
    });

    it("Query property should obtain value from rendering parameters", function() {
      expect(sut1.Query).toBe("/sitecore/client/*");
    });


    describe("when loadData executed", function() {
      it("should make request to the ItemWebApi", function(done) {
        initMockjax(function(request) {
          expect(request.url).toBe("/-/item/v1/sitecore/shell");
          done();
          return true;
        }, defaultResponse);
        sut1.loadData();
      });
      it("should make request with Query in parameters", function(done) {
        initMockjax(function(request) {
          expect(request.params.query).toBe(sut1.Query);
          done();
          return true;
        }, defaultResponse);
        sut1.loadData();
      });

      it("should make request with PageSize and PageIndex in parameters", function(done) {
        initMockjax(function(request) {

          expect(request.params.pageSize).toBe("" + sut1.PageSize);
          expect(request.params.pageIndex).toBe("" + sut1.PageIndex);
          done();
          return true;
        }, defaultResponse);
        sut1.loadData();
      });

      it("should make request with database in parameters", function (done) {
        initMockjax(function (request) {

          expect(request.params.sc_database).toBe(sut1.DatabaseName);
          done();
          return true;
        }, defaultResponse);
        sut1.loadData();
      });

      it("should make request with language in parameters", function (done) {
        initMockjax(function (request) {

          expect(request.params.language).toBe(sut1.LanguageName);
          done();
          return true;
        }, defaultResponse);
        sut1.loadData();
      });

      it("should make request with full payload in parameters", function (done) {
        initMockjax(function (request) {

          expect(request.params.payload).toBe("full");
          done();
          return true;
        }, defaultResponse);
        sut1.loadData();
      });

      it("should make request with fields and payload in parameters", function (done) {
        initMockjax(function (request) {

          expect(request.params.fields).toBe("__Created|Dimensions");
          expect(request.params.payload).toBe(undefined);
          done();
          return true;
        }, defaultResponse);
        sut3.loadData();
      });

      it("should make request with showHiddenItems in parameters", function (done) {
        initMockjax(function (request) {
          
          expect(request.params.showHiddenItems).toBe("" + sut1.ShowHiddenItems);
          done();
          return true;
        }, defaultResponse);
        sut1.loadData();
      });
      
      it("should set 'IsBusy' to true", function (done) {
        initMockjax(function (request) {
          
          expect(sut5.IsBusy).toBe(true);
          done();
          return true;
        }, defaultResponse);
        expect(sut5.IsBusy).toBe(false);
        sut5.loadData();
      });

      it("should set 'IsBusy' to false after complete", function (done) {
        initMockjax(function (request) {
          expect(sut5.IsBusy).toBe(true);
          return true;
        }, defaultResponse);
        sut5.on("itemsChanged", function () {
          if (!sut5.IsBusy) {
            expect(sut5.IsBusy).toBe(false);
            done();
          }
        });
        sut5.loadData();
      });

      it("should have items in results", function (done) {
        initMockjax(null, defaultResponse);
        sut1.on("itemsChanged", function () {

          expect(sut1.Items.length).toBe(20);
          done();
        });
        sut1.loadData();
      });
      
    });

    describe("if server error happens", function () {
      it("should trigger error", function (done) {
        initMockjax(null, error500Response);
        sut4.on("error", function (message) {
          expect(message).toBe("Error");
          done();
        });
        sut4.loadData();
      });
    });

    describe("if no data", function () {
      it("should have HasData=false HasNoData=true HasMoreData=false", function () {
        expect(sut2.HasData).toBe(false);
        expect(sut2.HasNoData).toBe(true);
        expect(sut2.HasMoreData).toBe(false);
      });
    });

    describe("when IsLoadDataDeferred set to true", function () {
      it("should have empty Items on page load", function () {
        expect(sut2.Items.length).toBe(0);
      });
    });

    describe("after the binded text changed", function () {
      it("should make request with new Query value", function (done) {
        var newQueryValue = "/*/*";
        initMockjax(function (request) {
          var query = request.params.query;
          expect(query).toBe(newQueryValue);
          done();
          return true;
        }, defaultResponse);
        app.TextBox1.Value = newQueryValue;
      });
      
      it("should change Items collection", function (done) {
        var newQueryValue = "/sitecore/client/Business Component Library/version 2/Test/Data/QueryDataSource/PageSettings/*";
        sut2.on("itemsChanged", function () {
          expect(sut2.Items.length).toBe(1);
          done();
        });
        app.TextBox1.Value = newQueryValue;
      });
    });
    
  });
});