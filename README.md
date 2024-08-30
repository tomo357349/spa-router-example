# SPA Router Example
SPA router example based on pure javascript using:
- Web Components
- ES module
- fetch API
- history API

## How to serve the code
You can serve example with any hosting softwares from /src directory. No compiling required.

And I provide a simple server by Node.js. You may run as:

```
npm start
```

will be serving at [localhost:8080](http://localhost:8080)

## How can I use the router?
The router is made up of modules:
- /utils/router.js

	This is the main part of the routing process:
	- manages registered routes and allows transition to the route.
	- hooks href of every anchors.
	- handles changing state.
	- dispatch changed state to router components.
- /utils/routeUtil.js

	This is the helper functions for routing.
	- match(): verifies uri that matches one of registered routes. the route may have some path variables.
	- join(): generate a pathname from a relative path.
	- fill(): generate a real pathname from a route and path variables.
- /components/router.js

	This is the web component to use the router.