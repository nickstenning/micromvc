Request.JSON.RESTful = new Class({
    Extends: Request.JSON,
    initialize: function (model, objectId, options) {
        this.parent(options);
        this.model = model;
        this.objectId = objectId;
    },
    callback: function (fn, binding) {
        this.addEvent('onFailure', function (responseObject, responseText) {
            // TODO: actually FAIL!
            this.model.requestFailureCallback(this.options.method,
                                              this.objectId,
                                              responseObject,
                                              responseText);
            fn.bind(binding)();
        });
        this.addEvent('onSuccess', function (responseObject, responseText) {
            this.model.requestSuccessCallback(this.options.method,
                                              this.objectId,
                                              responseObject,
                                              responseText);
            fn.bind(binding)();
        });
        return this;
    }
});

var Model = new Class({
    Implements: [Options, Events],
    options: {
        baseurl: '/api/rest',
        events: {
            //requestSent: $empty,
            //requestCompleted: $empty,
            //requestSuccess: $empty,
            //requestFailure: $empty
            }
    },
    initialize: function (name, options) {
        this.setOptions(options);
        this.name = name;
        this.requests = [];
        this.registry = [];
        this.entities = new Hash();
        this.addEvents(this.options.events);
    },
    returnMe: function () {
        return this;
    },
    registerGet: function () {
        return this.request('get');
    },
    registerPost: function (entity) {
        return this.request('post');
    },
    entityGet: function (id) {
        return this.request('get', id);
    },
    entityPut: function (id) {
        //return this.request('put', id);
        return this.request('post', id);
    },
    entityDelete: function (id) {
        //return this.request('delete', id);
        return this.request('post', id);
    },
    request: function (reqMethod, id) {
        var reqUrl = [this.options.baseurl, this.name, id].clean().join('/');
        return new Request.JSON.RESTful(this, id, {
            url: reqUrl,
            method: reqMethod,
            // Do sanity checking of JSON?
            secure: true,
            // Fake PUT and DELETE requests? (see MooTools source for details)
            emulation: false,
            // Async callback methods:
            onRequest: this.fireEvent.bind(this, ['requestSent']),
            onComplete: this.fireEvent.bind(this, ['requestCompleted'])
        });
    },
    requestSuccessCallback: function (reqMethod, id, responseObject, responseText) {
        switch (reqMethod) {
        case 'get':
            if ($chk(id)) {
                // entityGet
                this.registry.include(id);
                this.entities[id] = responseObject;
            } else {
                // registerGet
                this.registry = responseObject;
            }
            break;
        case 'post':
            // registerPost (use responseObject.id as we didn't have an id when
            // we made the request)
            this.registry.include(responseObject.id);
            this.entities[responseObject.id] = responseObject;
            break;
        case 'put':
            // entityPut
            this.entities[id] = responseObject;
            break;
        case 'delete':
            // entityDelete
            this.registry.erase(id);
            this.entities.erase(id);
            break;
        default:
            break;
        }
        this.fireEvent('requestSuccess');
    },
    requestFailureCallback: function (methodUsed, id, responseObject, responseText) {
        this.fireEvent('requestFailure');
    }
});