/* An example master.js for a site in which every element
   with class "thread" has its behaviour controlled by a
   ThreadController controller. */

window.addEvent('domready', function () {

    $$('.thread').each(function (elem) {
        var t = new ThreadController(elem);

        // I've found the following to be really quite
        // useful when keeping track of controllers.
        elem.store("thread:controller", t);
    });

});

