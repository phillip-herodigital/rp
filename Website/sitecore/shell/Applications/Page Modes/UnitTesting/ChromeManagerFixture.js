module("Chrome Manager operations");
test("Select no element", 1, function() {
  Sitecore.PageModes.ChromeManager.select(null);
  ok(Sitecore.PageModes.ChromeManager.selectedChrome() == null, "the selected chrome must be null");
});

test("Select field", function() {
  var field, selectedChrome;
  field = $sc(Sitecore.UnitTests.Constants.fieldChromeSelector).eq(0);  
  if (!Sitecore.UnitTests.Helper.requiredCondition(field.length, "Field wasn't found on a page")) {
    return;
  }
  
  expect(3); 
  field.trigger("click");
  selectedChrome = Sitecore.PageModes.ChromeManager.selectedChrome();
  ok(selectedChrome != null, "the selected chrome mustn't be null");
  ok(selectedChrome.key() == "field", "The selected chrome chrome must be a field")    
});

test("Select rendering", function() {
  var rendering, selectedChrome;
  rendering = $sc(Sitecore.UnitTests.Constants.renderingChromeSelector).eq(0);  
  if (!Sitecore.UnitTests.Helper.requiredCondition(rendering.length, "No rendering found on the page")) {
    return;
  }
  
  expect(3);
  rendering.next().trigger("click"); 
  selectedChrome = Sitecore.PageModes.ChromeManager.selectedChrome();
  ok(selectedChrome != null, "the selected chrome mustn't be null");  
  ok(selectedChrome.key() == "rendering", "The selected chrome chrome must be a rendering");  
});

test("Select placeholder", function() {
  var emptyPlaceholder, selectedChrome;
  emptyPlaceholder = $sc("." + Sitecore.PageModes.ChromeTypes.Placeholder.emptyLookFillerCssClass).eq(0);      
  if (!Sitecore.UnitTests.Helper.requiredCondition(emptyPlaceholder.length, "No empty placeholder found on the page")) {
    return;
  }

  expect(3);
  emptyPlaceholder.trigger("click"); 
  selectedChrome = Sitecore.PageModes.ChromeManager.selectedChrome();
  ok(selectedChrome != null, "the selected chrome mustn't be null");  
  ok(selectedChrome.key() == "placeholder", "The selected chrome chrome must be a placeholder");  
});

test("Get all chrome elements", 4, function() {
  var placeholders, fields, rendering, editframes;
  placeholders = Sitecore.PageModes.ChromeManager.getChromesByType(Sitecore.PageModes.ChromeTypes.Placeholder);
  same(placeholders.length, $sc(Sitecore.UnitTests.Constants.placeholderChromeSelector).length);
  fields = Sitecore.PageModes.ChromeManager.getChromesByType(Sitecore.PageModes.ChromeTypes.Field);
  same(fields.length, $sc(Sitecore.UnitTests.Constants.fieldChromeSelector).length);
  renderings = Sitecore.PageModes.ChromeManager.getChromesByType(Sitecore.PageModes.ChromeTypes.Rendering);
  same(renderings.length, $sc(Sitecore.UnitTests.Constants.renderingChromeSelector).length);
  editframes = Sitecore.PageModes.ChromeManager.getChromesByType(Sitecore.PageModes.ChromeTypes.EditFrame);
  same(editframes.length, $sc(Sitecore.UnitTests.Constants.editFrameChromeSelector).length)
}); 

test("Disable editing capability", function() {  
  Sitecore.PageModes.PageEditor.changeCapability(Sitecore.PageModes.Capabilities.edit, false);  
  var field, selectedChrome;
  field = $sc(Sitecore.UnitTests.Constants.fieldChromeSelector).eq(0);  
  if (!Sitecore.UnitTests.Helper.requiredCondition(field.length, "Field wasn't found on a page")) {
    return;
  }

  expect(3);
  field.trigger("click");
  selectedChrome = Sitecore.PageModes.ChromeManager.selectedChrome();
  ok(selectedChrome != null, "the selected chrome mustn't be null"); 
  same(selectedChrome.key(), "rendering", "The selected chrome chrome must be a a fields parent rendering");
  Sitecore.PageModes.PageEditor.changeCapability(Sitecore.PageModes.Capabilities.edit, true);  
});

test("Disable designing capability", function() {  
  Sitecore.PageModes.PageEditor.changeCapability(Sitecore.PageModes.Capabilities.design, false);  
  var rendering, selectedChrome;
  rendering = $sc(Sitecore.UnitTests.Constants.renderingChromeSelector).eq(0);      
  if (!Sitecore.UnitTests.Helper.requiredCondition(rendering.length, "No rendering found on the page.")) {
    return;
  }  
  
  expect(2);
  rendering.next().trigger("click"); 
  selectedChrome = Sitecore.PageModes.ChromeManager.selectedChrome();  
  ok(selectedChrome == null, "the selected chrome must be null");   
  Sitecore.PageModes.PageEditor.changeCapability(Sitecore.PageModes.Capabilities.design, true);  
});

test("Get parent", 3, function() {
  var field, parent;
  field = Sitecore.PageModes.ChromeManager.getChrome($sc(Sitecore.UnitTests.Constants.fieldChromeSelector).eq(0));
  ok(field, "Field was not found");
  parent = field.parent(true,false);
  ok(parent && parent.key() === "rendering", "Parent rendering wasn't found");
  ok($sc.first(parent.children(), function() { return this == field;}), "Wrong parent chrome");
});

test("Get descentants", 3, function() {
  var field, grandparent;
  field = Sitecore.PageModes.ChromeManager.getChrome($sc(Sitecore.UnitTests.Constants.fieldChromeSelector).eq(0));
  ok(field, "Field was not found");
  grandparent = field.parent(true,false).parent(true,false);
  ok(!$sc.first(grandparent.children(), function() { return this == field;}), "Descendant, but not child chrome");
  ok(grandparent.getChildChromes(function() { return this == field;}, true).length === 1, "Descendant chrome wasn't found");
});

test("Get disabled parent", 3, function() {
  var field, parent;
  Sitecore.PageModes.PageEditor.changeCapability(Sitecore.PageModes.Capabilities.design, false)
  field = Sitecore.PageModes.ChromeManager.getChrome($sc(Sitecore.UnitTests.Constants.fieldChromeSelector).eq(0));
  ok(field, "Field was not found");
  parent = field.parent(true);
  ok(!parent, "Parent element must be null, since renderings are not acessible without design capability");
  parent = field.parent(true, false);
  ok(parent, "Parent element must exist, since we specified retrieving disabled elements");  
  Sitecore.PageModes.PageEditor.changeCapability(Sitecore.PageModes.Capabilities.design, true);  
});