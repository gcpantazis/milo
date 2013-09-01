Milo
====

*v0.0.1*

In progress. Ideas for a db-less server / static site generator that's as flexible as you need it to be.

Todo:
-----

* Extensibility. How would I make a Sass pipeline, etc.?
  * Related, need an equivalent of expressjs's app.use() for middleware.
* Remapping sources for localization, etc.
* Related to mapping, remote data sources.
* Static-izer - Generate a static site. Require that your routes map directly to model IDs for
  "automatic" generation. Else provide an array of URLs you'd like the sytem to parse and output.
* What do you do with binary files that "belong" to modules?
  * Separate folder structure that can be re-mapped?