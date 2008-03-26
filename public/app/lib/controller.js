include('../../vendor/ejs/ejs');

var Controller = new Class({
    Implements: [Options, Events],
    options: {
        binding: this,
        autoAttach: true,
        events: {
            initialized: function (controller) {
                if (controller.options.autoAttach) {
                    controller.attachAll();
                }
            }
        }
    },
    initialize: function (element, controls, options) {
        this.setOptions(options);
        this.element = element;
        this.controls = $H(controls);
        this.binding = this.options.binding;
        this.added = new Hash();
        this.addEvents(this.options.events);
        this.fireEvent("initialized", this);
    },
    attachAll: function (forceRebind) {
        this.controls.each(function (v, k) {
            var entry = this.controls.get(k);
            if (entry && !entry.noauto) {
                this.attach(k, forceRebind);
            }
        },
        this);
    },
    attach: function (selectorName, forceRebind) {
        var elements;
        this.controls.each(function (controls, selector) {
            // Bind all appropriate events, so if we have ".sel1 .sel2" in
            // this.controls, calling with ".sel1" will include it.
            if (selectorName) {
                selector = selector.clean();
                selectorName = selectorName.clean();
                if (selector.substr(0, selectorName.length) !== selectorName) {
                    return;
                }
            }

            elements = this.element.getElements(selector);

            // Bind to this.element if selector == 'self'
            if (elements.length === 0 && selector === "self") {
                elements = [this.element];
            }

            elements.each(function (elem) {
                if (!this.added[elem]) {
                    this.added[elem] = [];
                }
                $H(controls).each(function (fn, evName) {
                    if (this.added[elem].contains(evName) && !forceRebind) {
                        return;
                    } else {
                        // Don't try and bind a boolean value.
                        if (['noauto'].contains(evName)) {
                            return;
                        }

                        elem.addEvent(evName, fn.bind(this.binding));
                        this.added[elem].push(evName);
                    }
                },
                this);

                elem.fireEvent('controlsAdded', elem);
            },
            this);
        },
        this);
    },
    // Name is relative to app/views directory, without an .ejs extension.
    renderView: function (name, data) {
        return new EJS({url: '/app/views/'+name+'.ejs'}).render(data)
    }
});

