function postRequest(id, param, formArgs, pipeline) {
  if (typeof (scForm) === 'undefined') {
    throw 'Sitecore.js required!';
  }
  
  var request = new scRequest();
  request.url = $(id).closest('form').attr('action') || location.href;
  request.form = $.param($($(id).closest('form').serializeArray())) + '&' + formArgs;
  request.build('', '', '', param, true, this.contextmenu, this.modified);
  request.pipeline = pipeline;
  request.execute();
}

scSitecore.prototype.postResult = function (result, pipeline) {
  postRequest(
            '#' + $('form').first().attr('id'), '',
            '__RESULT=' + encodeURIComponent(result) + '&__PIPELINE=' + encodeURIComponent(pipeline), pipeline);
};