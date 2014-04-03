if (typeof (Sitecore) == "undefined") {
  Sitecore = new Object();
}

Sitecore.PresetCardManager = function (chart, sliders, data, selectedPresetsConrainer) {
  this.chart = chart;
  this.sliders = sliders;
  this.data = data;
  this.selectedPresetsContainer = selectedPresetsConrainer;

  for (var i = 0; i < this.sliders.length; i++) {
    this.sliders[i].onClientChanged = function (data) { presetCardManager.RedrawChart() }
  }

  this.RedrawChart = function () {
    if (!this.chart || !this.sliders || !this.data) {
      return;
    }

    if (this.data.length != this.sliders.length) {
      return;
    }

    var container = $(this.selectedPresetsContainer);
    if (!container) {
      return;
    }

    for (var i = 0; i < this.sliders.length; i++) {
      var card = $(container).select("div[scSliderId='" + this.sliders[i].ID + "']")[0];
      if (!card) {
        return;
      }

      this.sliders[i].IsActive = $(card).visible();
    }

    var seriesData = new Array();
    for (var j = 0; j < this.data[0].length; j++) {
      seriesData[j] = 0.0;
    }

    var counter = 0;
    for (var i = 0; i < this.sliders.length; i++) {
      if (!this.sliders[i].IsActive) {
        continue;
      }

      counter++;
      var percent = this.sliders[i].getValue();
      for (var j = 0; j < this.data[i].length; j++) {
        seriesData[j] = seriesData[j] + this.data[i][j] * percent / 100;
      }
    }

    for (var i = 0; i < seriesData.length; i++) {
      /*seriesData[i] = seriesData[i] / counter;*/
      this.chart.series.data[i][1] = seriesData[i];
    }

    this.chart.redraw();
  }
}

Sitecore.PresetList = function (controlId) {
  this.controlId = controlId;
  var me = this;

  this.OnResize = function () {
    me.doResize();
  };
}

function DisableListBox(listboxId) {
  var list = $find(listboxId);
  if (!list) {
    return;
  }

  list.set_enabled(false);
}

function EnableListBox(listboxId) {
  var list = $find(listboxId);
  if (!list) {
    return;
  }

  list.set_enabled(true);
}

Sitecore.PresetList.prototype.doResize = function () {
  try {
    if (!scForm.browser.isIE) {
      return;
    }

    var parent = $(this.controlId);
    var container = $(this.controlId).childElements()[0];
    if (!container || !parent) {
      return;
    }

    var list = container.childElements()[0];
    if (!list) {
      return;
    }

    list.style.height = container.getHeight() + 'px';
    list.style.width = container.getWidth() - 3 + 'px';

    var tableContainer = list.childElements()[0];

    if (!tableContainer) {
      return;
    }

    tableContainer.style.height = container.getHeight() + 'px';
    tableContainer.style.width = container.getWidth() - 3 + 'px';

    var header = list.select('[class="rlbHeader"]')[0];
    if (!header) {
      return;
    }

    var cellHeader = header.ancestors()[0];
    cellHeader.style.height = '25px';
    cellHeader.ancestors()[0].style.height = '25px';

    var cellContainer = list.select('[class="rlbGroupCell"]')[0];
    if (!cellContainer) {
      return;
    }

    cellContainer.style.height = (container.getHeight() - header.getHeight()) + 'px';
    cellContainer.style.width = (container.getWidth() - 2) + 'px';

    var innerContainer = list.select('[class="rlbGroupContainer"]')[0];
    if (!innerContainer) {
      return;
    }

    innerContainer.style.height = cellContainer.getHeight() + 'px';
    innerContainer.style.width = cellContainer.getWidth() + 'px';

    var child = innerContainer.childElements()[0];
    if (!child) {
      return
    }

    child.style.height = innerContainer.getHeight() + 'px';
    child.style.width = innerContainer.getWidth() + 'px';
  }
  catch (err)
  { }
}

function selectPresetCard(element) {
  var elements = $(element).siblings();
  if (elements) {
    for (i = 0; i < elements.length; i++) {
      if ($(elements[i]).hasClassName('selectedPresetCardContainer')) {
        $(elements[i]).removeClassName('selectedPresetCardContainer');
      }
    }
  }
  if ($(element).hasClassName('hoveredPresetCardContainer')) {
    $(element).removeClassName('hoveredPresetCardContainer');
  }

  if (!$(element).hasClassName('selectedPresetCardContainer')) {
    $(element).addClassName('selectedPresetCardContainer');
  }
}

function hoverPresetCard(element) {
  if (!$(element).hasClassName('selectedPresetCardContainer') && !$(element).hasClassName('hoveredPresetCardContainer')) {
    $(element).addClassName('hoveredPresetCardContainer');
  }
}

function clearHoveringPresetCard(element) {
  if ($(element).hasClassName('hoveredPresetCardContainer')) {
    $(element).removeClassName('hoveredPresetCardContainer');
  }
}

function clearSelectionPresetCard(element) {
  if ($(element).hasClassName('selectedPresetCardContainer')) {
    $(element).removeClassName('selectedPresetCardContainer');
  }
}

function OnPresetItemDoubleClick(sender, e) {
  var item = e.get_item();
  if (!item) {
    return;
  }
  var presetId = item.get_value();
  AddPreset(presetId);
}

function OnAddPreset(ctlId) {
  var listbox = $find(ctlId);
  if (!listbox) {
    return false;
  }

  var item = listbox.get_selectedItem();
  if (!item) {
    return false;
  }

  var presetId = item.get_value();
  if (presetId) {
    AddPreset(presetId);
  }

  return false;
}

function AddPreset(presetId) {
  scForm.postRequest('', '', '', 'OnAddPreset("' + presetId + '")');
}

function OnSelectedPresetDoubleClick(element)
{
  var presetId = $(element).readAttribute('scPresetId');
  if (!presetId) {
    return;
  }

  RemovePreset(presetId);
}

function OnRemovePreset(ctlId) {
  var container = $(ctlId);
  if (!container) {
    return false;
  }

  var cards = $(container).childElements();
  if(!cards)
  {
    return false;
  }

  for (i = 0; i < cards.length; i++) {
    if ($(cards[i]).hasClassName('selectedPresetCardContainer')) { 
      var presetId = $(cards[i]).readAttribute('scPresetId');
      if(!presetId)
      {
        return false;
      }

      RemovePreset(presetId);
      return false;
    }
  }

  return false;
}

function RemovePreset(presetId) {
  scForm.postRequest('', '', '', 'OnRemovePreset("' + presetId + '")');
}

function SetPresetCardVisibility(presetId, isVisible, containerId) {
  var container = $(containerId);
  if (!container) {
    return;
  }

  var cards = $(container).childElements();
  if (!cards) {
    return;
  }

  var card = $(container).select("div[scPresetId='" + presetId + "']")[0];
  if (!card) {
    return;
  }

  if (!isVisible) {
    $(card).hide();
    clearHoveringPresetCard($(card));
    clearSelectionPresetCard($(card));
  }
  else {
    if (!$(card).visible()) {
      $(card).remove();
      cards = $(container).childElements();
      var afterCard = null;
      for (i = cards.length - 1; i >= 0; i--) {
        if($(cards[i]).visible()){
          afterCard = cards[i];
          break;
        }
      }

      if (afterCard != null) {
        container.insert(card, { after: afterCard });
      }
      else {
        container.insert(card);
      }
    }

    $(card).show();
  }
}