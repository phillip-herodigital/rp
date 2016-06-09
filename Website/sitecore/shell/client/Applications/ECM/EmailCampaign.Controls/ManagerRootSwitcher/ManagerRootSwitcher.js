define([
  'sitecore',
  '/-/speak/v1/ecm/CompositeComponentBase.js',
  '/-/speak/v1/ecm/ManagerRootService.js'
], function(
  _sc,
  CompositeComponentBase,
  ManagerRootService
) {

  var model = _sc.Definitions.Models.ControlModel.extend({
    initialize: function() {
      this._super();
      this.set('managerRoot', null);
      this.set('defaultManagerRootId', null);
      this.set('managerRootId', '');
    }
  });

  var view = CompositeComponentBase.view.extend({
    childComponents: [
      'DropDownButton'
    ],

    initialize: function() {
      this._super();
      this.model.set('isTaskPage', this.$el.data('sc-istaskpage'));
      this.model.set('defaultManagerRootId', this.$el.data('sc-defaultmanagerrootid'));
      this.attachHandlers();
      this.setRootsList();
      this.setManagerRoot();

      setTimeout(function() {
        $('.sc-ecm-managerroot').fadeIn(800);
      }, 100);
    },

    attachHandlers: function() {
      this.model.on('change:managerRoot', this.onChangeManagerRoot, this);
      this.$el.find('.root-item').on('click', _.bind(this.selectRoot, this));
    },

    onChangeManagerRoot: function() {
      var managerRoot = this.model.get('managerRoot');
      if (managerRoot) {
        this.children.DropDownButton.set('text', managerRoot.title);
        this.$el.find('.selected').removeClass('selected');
        this.$el.find('[data-root-id="' + managerRoot.id + '"]').parent().addClass('selected');
        this.model.set('managerRootId', managerRoot.id);
      }
    },

    setRootsList: function() {
      this.model.set('rootsList', ManagerRootService.getManagerRootList());
    },

    getRootById: function(id) {
      return _.findWhere(this.model.get('rootsList'), {id: id});
    },

    setManagerRoot: function() {
      if (this.model.get('isTaskPage')) {
        sessionStorage.managerRootId = this.model.get('defaultManagerRootId');
      }

      var storedRootId = sessionStorage.managerRootId;
      if (!storedRootId || !this.getRootById(storedRootId)) {
        storedRootId = this.model.get('defaultManagerRootId');
        sessionStorage.managerRootId = storedRootId;
      }
      this.model.set('managerRoot', this.getRootById(storedRootId));
    },

    selectRoot: function(e) {
      e.preventDefault();

      var target = $(e.target),
        rootId = target.data('root-id'),
        selectedRoot = this.getRootById(rootId);

      sessionStorage.managerRootId = rootId;
      this.model.set('managerRoot', selectedRoot);
      this.children.DropDownButton.set('isOpen', false);
    }
  });

  return _sc.Factories.createComponent('ManagerRootSwitcher', model, view, '.sc-ecm-managerroot');
});
