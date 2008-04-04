describe("Controller", {
    before_each: function () {
        returns = [];

        elem = new Element('div', {
            'class': 'myControlledElement',
            html: [ '<span class="one">span one</span>',
                    '<span class="two common">span two</span>',
                    '<span class="three common">span three</span>' ]
        });

        // We need the element in the DOM to be able to search it.
        elem.setStyle('display', 'none');
        elem.inject(document.getElement('body'));

        MyController = new Class({
            Extends: Controller,
            options: {
                controls: {
                    'self': {
                        parentElementEvent: function () {
                            returns.push(".myControlledElement: parentElementEvent");
                        }
                    },
                    '.one': {
                        eventTheFirst: function () {
                            returns.push(".one: eventTheFirst");
                        }
                    },
                    '.two': {
                        noauto: true,
                        controlsAdded: function () {
                            returns.push(".two: controlsAdded");
                        }
                    },
                    '.three': {
                        bindingTest: function () {
                            returns.push(this.name);
                        }
                    },
                    'span': {
                        threeCalls: function () {
                            returns.push("span: threeCalls");
                        }
                    },
                    '.common': {
                        twoCalls: function (param) {
                            returns.push(".common: twoCalls(" + param + ")")
                        }
                    }
                }
            }
        });
        c = new MyController(elem);
    },
    after_each: function () {
        elem.dispose();
        try {
            elem2.dispose();
        } catch(e) {}
    },
   'should attach its controls\' events in its element when instantiated by default': function () {
       elem.getElement('.one').fireEvent('eventTheFirst');
       expect(returns).should_be([".one: eventTheFirst"]);
   },
   'should not attach its controls\' events by default when instantiatied with option autoAttach: false': function () {       
       elem2 = elem.clone();
       d = new MyController(elem2, {autoAttach: false});
       elem2.getElement('.one').fireEvent('eventTheFirst');
       expect(returns).should_be_empty();
   },
   'should not attach a controls\' events if noauto is set to true within a selector\'s events list': function () {
       expect(returns).should_be_empty();
   },
   'should not attach events twice (i.e. attachAll called a second time should do nothing)': function () {
       c.attachAll();
       elem.getElement('.one').fireEvent('eventTheFirst');
       expect(returns).should_be([".one: eventTheFirst"]);
   },
   'should attach events twice if forceRebind is set': function () {
       c.attachAll(true);
       elem.getElement('.one').fireEvent('eventTheFirst');
       expect(returns).should_be([".one: eventTheFirst", ".one: eventTheFirst"]);
   },
   'should bind events to its element using the special selector "self"': function () {
       elem.fireEvent('parentElementEvent');
       expect(returns).should_be([".myControlledElement: parentElementEvent"]);
   },
   'should automatically fire controlsAdded on an element when it successfully attaches events to an elementset': function () {
       c.attach('.two');
       expect(returns).should_be([".two: controlsAdded"]);
   },
   'should bind event functions to itself by default': function () {
       c.name = "MyControllerName";
       elem.getElement('.three').fireEvent('bindingTest');
       expect(returns).should_be([c.name]);
   },
   'should bind event functions to the object specified on construction if it exists': function () {
       elem2 = elem.clone();
       binding = {
           name: "AnotherControllerName"
       };
       d = new MyController(elem2, {}, binding);
       elem2.getElement('.three').fireEvent('bindingTest');
       expect(returns).should_be([binding.name]);
   }
});