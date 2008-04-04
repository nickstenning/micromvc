var Controller = new Class({
    Implements: [Options, Events],
    options: {
        autoAttach: true,
        events: {
            initialized: function (controller) {
                if (controller.options.autoAttach) {
                    controller.attachAll();
                }
            }
        },
        controls: {}
    },
    initialize: function (element, options, binding) {
        this.setOptions(options);
        this.element = element;
        this.controls = $H(this.options.controls);
        if (binding) {
            this.binding = binding;
        } else {
            this.binding = this;
        }
        this.addEvents(this.options.events);
        this.fireEvent("initialized", this);
    },
    attachAll: function (forceRebind) {
        this.controls.each(function (v, k) {
            var entry = this.controls.get(k);
            if (entry && !entry.noauto) {
                console.debug("Attaching to %o", k)
                this.attach(k, forceRebind);
            }
        },
        this);
    },
    attach: function (selectorName, forceRebind) {
        var elements;
        this.controls.each(function attachToSelector (controls, selector) {
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
            if (elements.length === 0) {
                if (selector === 'self') {
                    elements = [this.element];
                } else {
                    console.warn("Found no elements matching ", selector);
                }
            }

            elements.each(function attachToElem (elem) {
                console.debug("Attaching events to %o.", elem)
                if (!elem.retrieve('controller:events')) {
                    elem.store('controller:events', []);
                }

                $H(controls).each(function (fn, evName) {
                    if (elem.retrieve('controller:events').contains(fn) && !forceRebind) {
                        console.warn("Not rebinding %o with added = %o", elem, elem.retrieve('controller:events'));
                        return;
                    } else {
                        // Don't try and bind a boolean value.
                        if (['noauto'].contains(evName)) {
                            return;
                        }

                        elem.addEvent(evName, fn.bind(this.binding));
                        elem.retrieve('controller:events').push(fn);
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
        return new EJS({url: '/app/views/'+name+'.ejs'}).render(data);
    },
    renderViewTo: function(elem, name, data) {
        return new Element('div', {html: this.renderView(name, data)}).getFirst().replaces(elem);
    },
    getElement: function () {
        return this.element.getElement.run(arguments, this.element);
    },
    waitFor: function (elem, fn) {
        var ii, domElem = this.getElement(elem);
        while (!domElem && ii <= 20) {
            ii += 1;
            domElem = this.getElement.delay(100, this, elem);
        }
        // TODO: cope with failure of the above.
        fn.run(domElem, this);
    }
});

