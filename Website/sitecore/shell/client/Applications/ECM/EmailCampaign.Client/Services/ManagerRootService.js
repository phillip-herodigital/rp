define([], function() {
  return {
    getManagerRootList: function () {
      var roots = [];
      var id = "root-id";
      $.each($('div[data-sc-id="EmailManagerRoot"]:first').find('*[data-' + id + ']'), function () {
        var el = $(this);
        roots.push({ title: el.text(), id: el.data('root-id') });
      });
      return roots;
    }
  }
})