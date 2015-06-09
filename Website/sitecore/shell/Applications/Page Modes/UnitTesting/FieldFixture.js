module("Fields operations");
test("Inline editing", function() { 
  var element = $sc(Sitecore.UnitTests.Constants.inlineEditableFieldChromeSelector).eq(0);
  var field  = Sitecore.PageModes.ChromeManager.getChrome(element);  
  if (!Sitecore.UnitTests.Helper.requiredCondition(field, "Cannot find inline editable field")) {
    return;
  }

  expect(3);
  Sitecore.PageModes.ChromeManager.select(field);
  var rng, node, testText = "Hello world";
  if (document.body.createTextRange) {    
    rng = document.body.createTextRange();
    rng.moveToElementText(element[0]);
    rng.pasteHTML(testText);    
  }
  else {
    rng = document.createRange();
    rng.selectNodeContents(element[0]);
    rng.deleteContents();
    node = rng.createContextualFragment(testText);    
    rng.insertNode(node);    
  }

  field.element.trigger("blur");
  var fieldValue = Sitecore.PageModes.ChromeManager.getFieldValueContainerById(field.controlId());
  ok(fieldValue, "field value mustn't be null");
  same(fieldValue.value, testText);
});

test("Disable line breaks in text fields. OT #346162", function() {
  var textFieldSelector = Sitecore.UnitTests.Constants.inlineEditableFieldChromeSelector + "[scFieldType='text']" + 
                           ", " + 
                          Sitecore.UnitTests.Constants.inlineEditableFieldChromeSelector + "[scFieldType='single-line text']";
  
  var element = $sc(textFieldSelector).eq(0);  
  if (!Sitecore.UnitTests.Helper.requiredCondition(element, "There's no text fields in the layout")) {
    return;
  }

   expect(2);
   var field  = Sitecore.PageModes.ChromeManager.getChrome(element);
   var initialHtml = field.element.html();                       
   field.element.trigger("click");
   var e = $sc.Event("keydown");
   e.keyCode = 13;
   field.element.trigger(e);   
   ok(e.isDefaultPrevented(), "Inserting line breaks are not allowed for inline fields")  
});