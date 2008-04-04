// To run these tests successfully, you need to have started an instance of
// MicroFacts at the URL specified below, and will need to have added the
// following lines to Firefox's user/prefs.js:
//
//    user_pref("capability.policy.XHRToAny.XMLHttpRequest.open","allAccess");
//    user_pref("capability.policy.XHRToAny.sites", "http://testurlhost");
//    user_pref("capability.policy.policynames", "XHRToAny");
//
//    NB: replace http://testurlhost in the above with the hostname from which
//        you are running the tests.
describe('Model', {
    before_each: function () {
        mockData = [
            [0, 1, 2, 3],
            [{
                id: 0,
                name: "zarro"
            },
            {
                id: 1,
                name: "one"
            },
            {
                id: 2,
                name: "two"
            },
            {
                id: 3,
                name: "three"
            }]
        ];
        Factlet = new Model('factlet', {
            baseurl: 'http://localhost:5000/api/rest'
        });
        Thread = new Model('thread', {
            baseurl: 'http://localhost:5000/api/rest'
        });
        Mock = new Model('mock');
    },
    // TODO: can't really test this properly until we have a fixtures library.
    'should fill its registry with a list of model objects from registerGet': function () {
        Factlet.registerGet().send();
        expect(Factlet.registry).should_not_be_null();
        expect($type(Factlet.registry)).should_be('array');
    },

    // Until the above is fixed: call the callbacks directly, skipping out the
    // server call.

    // requestSuccessCallback: function (reqMethod, id, responseObject, responseText)
    'should process a GET without an id as a registerGet call': function () {
        Mock.requestSuccessCallback('get', null, mockData[0]);
        expect(Mock.registry).should_be(mockData[0]);
    },
    'should process a GET with an id as an entityGet call': function () {
        Mock.requestSuccessCallback('get', 2, mockData[1][2]);
        expect(Mock.registry).should_be([2]);
        expect(Mock.entities[2]).should_be(mockData[1][2]);
    },
    'should process a PUT as an entityPut call': function () {
        Mock.requestSuccessCallback('get', 0, mockData[1][0]);
        expect(Mock.entities[0]).should_be(mockData[1][0]);
        var modified = mockData[1][0];
        modified.name = "zero";
        Mock.requestSuccessCallback('put', 0, modified);
        expect(Mock.entities[0]).should_be(modified);
    },
    'should process a POST as an entityPost call': function () {
        expect(Mock.entities.getClean()).should_be({});
        Mock.requestSuccessCallback('post', null, mockData[1][3]);
        expect(Mock.registry).should_be([3])
        expect(Mock.entities[3]).should_be(mockData[1][3]);
    },
    'should process a DELETE as an entityDelete call': function () {
        Mock.requestSuccessCallback('get', 0, mockData[1][0]);
        expect(Mock.entities[0]).should_be(mockData[1][0]);
        expect(Mock.registry).should_include(0);
        Mock.requestSuccessCallback('delete', 0);
        expect(Mock.entities.getClean()).should_be({});
        expect(Mock.registry).should_be_empty();
    }

});