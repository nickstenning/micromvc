describe("Controller", {
    before_each: function () {
        returns = [];

        elem = new Element('div', {
            id: 'myControlledElement',
            html: [ '<span id="one">span one</span>',
                    '<span id="two" class="common">span two</span>',
                    '<span id="three" class="common">span three</span>' ]
        });
        
        // We need the element in the DOM to be able to search it.
        elem.setStyle('display', 'none');
        elem.inject(document.getElement('body'));
        
        spanOne = elem.getElement('#one');
        spanTwo = elem.getElement('#two');
        spanThree = elem.getElement('#three');

        c = new Controller(elem, {
            'self': {
                parentElementEvent: function () {
                    returns.push("#myControlledElement: parentElementEvent");
                }
            },
            '#one': {
                eventTheFirst: function () {
                    returns.push("#one: eventTheFirst");
                }
            },
            '#two': {
                noauto: true,
                controlsAdded: function () {
                    returns.push("#two: controlsAdded");
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
        });
    },
   'should attach its controls\' events in its element when instantiated by default': function () {
       spanOne.fireEvent('eventTheFirst');
       expect(returns).should_be(["#one: eventTheFirst"]);
   },
   'should not attach its controls\' events by default when instantiatied with option autoAttach: false': function () {
       newElem = elem.clone(true, true);
       newElem.inject(document.getElement('body'));
       newSpanOne = newElem.getElement('#one');
       d = new Controller(newElem, c.controls, {autoAttach: false});
       newSpanOne.fireEvent('eventTheFirst');
       expect(returns).should_be_empty();
   },
   'should not attach a controls\' events if noauto is set to true within a selector\'s events list': function () {
       expect(returns).should_be_empty();
   },
   'should not attach events twice (i.e. attachAll called a second time should do nothing)': function () {
       c.attachAll()
       spanOne.fireEvent('eventTheFirst');
       expect(returns).should_be(["#one: eventTheFirst"]);
   },
   'should attach events twice if forceRebind is set': function () {
       c.attachAll(true)
       spanOne.fireEvent('eventTheFirst');
       expect(returns).should_be(["#one: eventTheFirst", "#one: eventTheFirst"]);
   },
   'should bind events to its element using the special selector "self"': function () {
       elem.fireEvent('parentElementEvent');
       expect(returns).should_be(["#myControlledElement: parentElementEvent"]);
   },
   'should automatically fire controlsAdded on an element when it successfully attaches events to an elementset': function () {
       c.attach('#two');
       expect(returns).should_be(["#two: controlsAdded"]);
   }
});