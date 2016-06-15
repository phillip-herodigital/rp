define([
        "sitecore",
        "/-/speak/v1/ecm/ServerRequest.js",
        "/-/speak/v1/ecm/constants.js"
    ], function(
        _sc,
        ServerRequest,
        Constants
    ) {
        "use strict";

        var model = _sc.Definitions.Models.ComponentModel.extend(
        {
            initialize: function() {
                this._super();

                this.set("messageId", "");
                this.set("language", "");
                var self = this;

                _sc.on("change:messageContext", function() {
                    if (self.get("messageId") && self.get("language")) {
                        self.set("initialized", true);

                        self.options.messageId = self.get("messageId");
                        self.options.language = self.get("language");

                        self.dontlisten();

                        this.setup();
                    }
                }, this);
            },

            dontlisten: function() {
                _sc.off(null, null, this);
            },
            options: {
                messageId: null,
                language: null,
                activeReviews: null,
                checkInterval: 30000
            },
            reviewsToAppend: [],
            timer: null,

            setup: function() {
                var self = this;
                ServerRequest(Constants.ServerRequests.INITIAL_ACTIVE_REVIEWS, {
                    data: { messageId: self.options.messageId, language: self.options.language },
                    success: function(response) {
                        if (!response.error) {
                            self.options.activeReviews = response.results.activeReviews;
                            self.start();
                        }
                    }
                });
            },
            start: function() {
                var self = this;
                self.stop();
                self.timer = window.setTimeout(function() { self.tick(); }, self.options.checkInterval);
            },

            stop: function() {
                if (this.timer) {
                    window.clearTimeout(this.timer);
                }
            },

            tick: function() {
                var self = this;
                self.check();
            },

            check: function() {
                var self = this;

                if ((self.options.activeReviews && (self.options.activeReviews.emailPreviews.length > 0 || self.options.activeReviews.spamChecks.length)) || (self.reviewsToAppend && self.reviewsToAppend.length > 0)) {
                    ServerRequest(Constants.ServerRequests.ACTIVE_REVIEWS, {
                        data: { messageId: self.options.messageId, language: self.options.language, messageReviews: self.options.activeReviews, reviewsToAppend: self.reviewsToAppend },
                        success: function(response) {
                            if (!response.error) {
                                self.checked(response.results);
                            }
                        }
                    });

                    self.reviewsToAppend = [];
                }

                self.start();
            },

            checked: function(data) {
                var self = this;

                self.options.activeReviews = data.activeReviews;
                self.notify(data.completedMessages);

                self.start();
            },

            notify: function(messages) {
                if (messages && messages.length > 0) {
                    for (var msg in messages) {
                        this.trigger("addMessage", { type: messages[msg].type, message: messages[msg] }, this);
                    }
                }
            }
        });

        var view = _sc.Definitions.Views.ComponentView.extend(
        {
            initialize: function() {
                this._super();
            },

            add: function(newReview) {
                this.model.reviewsToAppend.push(newReview);
                this.model.start();
            }
        });

        _sc.Factories.createComponent("ReportUpdateWatcher", model, view, ".sc-reportupdatewatcher");
    }
);