require.config({
    paths: {
        bootstraplib: "lib/ui/deps/bootstrap/js/bootstrap.min",
        bootstrapModal: "lib/ui/deps/bootstrapModal/bootstrap-modal",
        bootstrapModalManager: "lib/ui/deps/bootstrapModal/bootstrap-modalmanager"
    },
    shim: {
        'bootstraplib': { deps: ['jquery'] },
        'bootstrapModalManager': { deps: ['bootstraplib'] },
        'bootstrapModal': { deps: ['bootstrapModalManager'] }
    }
});

define("dialog", ["jquery", "bootstraplib", "bootstrapModalManager", "bootstrapModal"], function () {
    return true;
});