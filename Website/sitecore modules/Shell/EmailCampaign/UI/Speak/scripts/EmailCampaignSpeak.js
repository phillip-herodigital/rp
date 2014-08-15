emailCampaignSpeak = new function ()
{
  this.disable = function (elementId)
  {
    $('#' + elementId).find('input, select').attr('disabled', 'disabled');
  };

  this.enable = function (elementId)
  {
    $('#' + elementId).find('input, select').removeAttr('disabled');
  };
}