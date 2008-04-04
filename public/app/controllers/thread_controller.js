var ThreadController = new Class({
    Extends: Controller,
    options: {
        controls: {
            '.threaditem': {
                click: function () {
                    alert("I was clicked!");
                }
            }
        }
    }
});
