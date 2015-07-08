Sitecore.UnitTests.LayoutDefinition = {};
Sitecore.UnitTests.LayoutDefinition.targetRenderingUid = "{B343725A-3A93-446E-A9C8-3A2CBD3DB489}";
Sitecore.UnitTests.LayoutDefinition.testLayout = [
   "{\"r\": {", 
     "\"@xmlns:xsi\": \"http://www.w3.org/2001/XMLSchema-instance\",",
     "\"@xmlns:xsd\": \"http://www.w3.org/2001/XMLSchema\",",
     "\"d\": [",
       "{",
         "\"@id\": \"{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}\",",
         "\"@l\": \"{14030E9F-CE92-49C6-AD87-7D49B50E42EA}\",",
         "\"r\": [",
           "{",             
             "\"@id\": \"{885B8314-7D8C-4CBB-8000-01421EA8F406}\",",            
             "\"@ph\": \"main\",",
             "\"@uid\": \"{43222D12-08C9-453B-AE96-D406EBB95126}\"",
           "},",
           "{",             
             "\"@id\": \"{493B3A83-0FA7-4484-8FC9-4680991CF743}\",",             
             "\"@ph\": \"/main/centercolumn\",",
             "\"@uid\": \"" + Sitecore.UnitTests.LayoutDefinition.targetRenderingUid +"\"",
           "},",
           "{",             
             "\"@id\": \"{CE4ADCFB-7990-4980-83FB-A00C1E3673DB}\",",             
             "\"@ph\": \"/main/centercolumn\",",
             "\"@uid\": \"{CF044AD9-0332-407A-ABDE-587214A2C808}\"",
           "}",           
         "]",
       "}",       
     "]",
   "}}"].join("");

Sitecore.UnitTests.LayoutDefinition.getRenderingsInPlaceholder = function(placeholderKey) {
  var layout = Sitecore.LayoutDefinition.getLayoutDefinition();
  var renderings = layout.r.d[0].r;
  var renderingsInPlaceholder = [];
  for (var i = 0, r; r = renderings[i]; i++) {
    if (r["@ph"] == placeholderKey) {
      renderingsInPlaceholder.push(r);
    }    
  }

  return renderingsInPlaceholder;
}

module("layout definition", {
  setup: function() {
    Sitecore.UnitTests.persistedLayout = Sitecore.LayoutDefinition.getLayoutDefinition();
    Sitecore.LayoutDefinition.setLayoutDefinition(Sitecore.UnitTests.LayoutDefinition.testLayout);
  },

  teardown: function() {
    if (Sitecore.UnitTests.persistedLayout) {
      Sitecore.LayoutDefinition.setLayoutDefinition(Sitecore.UnitTests.persistedLayout);
    }
  }
});

test("remove rendering", 1, function() {
  var uid = $sc.toShortId(Sitecore.UnitTests.LayoutDefinition.targetRenderingUid);
  Sitecore.LayoutDefinition.remove(uid); 
  var r = Sitecore.LayoutDefinition.getRendering(uid); 
  ok(r == null, "the rendering must be removed.");
});

test("move rendering in the same placeholder", 2, function() {
  var uid = $sc.toShortId(Sitecore.UnitTests.LayoutDefinition.targetRenderingUid);
  var placeholderKey = "/main/centercolumn";
  Sitecore.LayoutDefinition.moveToPosition(uid, placeholderKey, 2);    
  var renderingsInPlaceholder = Sitecore.UnitTests.LayoutDefinition.getRenderingsInPlaceholder(placeholderKey);    
  ok(renderingsInPlaceholder.length == 2, "the count of renderings must not change."); 
  deepEqual(renderingsInPlaceholder[1], Sitecore.LayoutDefinition.getRendering(uid), "rendering must be on the second place");
});

test("move rendering to another placeholder", 3, function() {
   var uid = $sc.toShortId(Sitecore.UnitTests.LayoutDefinition.targetRenderingUid);   
   Sitecore.LayoutDefinition.moveToPosition(uid, "main", 0);
   var renderingsInMainPlaceholder = Sitecore.UnitTests.LayoutDefinition.getRenderingsInPlaceholder("main");
   same(renderingsInMainPlaceholder.length, 2);
   var renderingsInCenterColumnPlaceholder = Sitecore.UnitTests.LayoutDefinition.getRenderingsInPlaceholder("/main/centercolumn");
   same(renderingsInCenterColumnPlaceholder.length, 1);
   deepEqual(renderingsInMainPlaceholder[0], Sitecore.LayoutDefinition.getRendering(uid), "rendering must be on the first place");   
});

test("insert new rendering at top", 2, function() {
  var id = Sitecore.UnitTests.Constants.sampleRenderingId;
  var placeholderName = "main";
  Sitecore.LayoutDefinition.insert(placeholderName, id);
  var renderings = Sitecore.UnitTests.LayoutDefinition.getRenderingsInPlaceholder(placeholderName);
  same(renderings.length, 2);
  same(renderings[0]["@id"], id);   
});