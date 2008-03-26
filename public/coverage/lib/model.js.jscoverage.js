var Model = new Class({
    Implements: [Options, Events],
    options: {
        baseurl: '/api/rest',
        name: 'dummy',
        events: {
            //requestSent: $empty,
            //requestCompleted: $empty,
            //requestSuccess: $empty,
            //requestFailure: $empty
            }
    },
    initialize: function (options) {
        this.setOptions(options);
        this.registry = [];
        this.entities = new Hash();
        this.addEvents(this.options.events);
    },
    registerGet: function () {
        this.request('get').send();
    },
    registerPost: function (entity) {
        this.request('post').send(entity);
    },
    entityGet: function (id) {
        this.request('get', id).send();
    },
    entityPut: function (id, entity) {
        this.request('put', id).send(entity);
    },
    entityDelete: function (id) {
        this.request('delete', id).send();
    },
    request: function (reqMethod, id) {
        var reqUrl = [this.options.baseurl, this.options.name, id].clean().join('/');
        return new Request.JSON({
            method: reqMethod,
            url: reqUrl,
            // Do sanity checking of JSON?
            secure: true,
            // Fake PUT and DELETE requests (see MooTool source for details)?
            emulation: false,
            // Async callback methods:
            onRequest: this.fireEvent.bind(this, ['requestSent']),
            onComplete: this.fireEvent.bind(this, ['requestCompleted']),
            onSuccess: (function (responseObject, responseText) {
                this.requestSuccessCallback(reqMethod, id, responseObject, responseText);
            }).bind(this),
            onFailure: (function (responseObject, responseText) {
                this.requestFailureCallback(reqMethod, id, responseObject, responseText);
            }).bind(this)
        });
    },
    requestSuccessCallback: function (reqMethod, id, responseObject, responseText) {
        switch (reqMethod) {
        case 'get':
            if (id !== null && id !== undefined) {
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
        }
        this.fireEvent('requestSuccess');
    },
    requestFailureCallback: function (methodUsed, id, responseObject, responseText) {
        this.fireEvent('requestFailure');
    }
});