#  MicroMVC
## a li'l Mootools-powered Javascript MVC framework

This is MicroMVC, a small, hopefully useful MVC framework written in 
Javascript. It was very recently spun out of another much larger project so 
there are certainly going to be rough edges in places. However, it has a small 
set of passing specs (see public/spec/lib) which should explain how it's  
meant to work.

The idea is that you'd take the MicroMVC layout as your starting point for 
writing a highly data-driven web application front-end. Included are some 
skeletal examples of a controller, a model and a view[1] to power a "Thread," 
whatever that might be!

[1]: Yes, just the one .. =P 

You'll notice that the model (public/app/models/thread.js) is really really 
tiny ... that's because MicroMVC is currently designed to get data from a 
RESTful API. Everything else (well, nearly) is automagic!

If you're interested by the above, please have a poke around, look in the TODO 
file to see stuff that might want doing, and contribute!
