Milo
====

*v0.0.8*

In progress. Ideas for a db-less server / static site generator that's as flexible as you need it to be.

Todo:
-----

* Setting global "state".
* Helper methods for searching, iterating models.
* Plug in other template langs, not just Jade.
* Remapping sources for localization, etc.
* Related to mapping, remote data sources.
* Static-izer - Generate a static site. Require that your routes map directly to model IDs for
  "automatic" generation. Else provide an array of URLs you'd like the sytem to parse and output.
  * Something like the angular staticizer for SEO (year of moo link).
* What do you do with binary files that "belong" to modules?
  * Separate folder structure that can be re-mapped?
* Use comments in markdown to split it into an array of rendered content, for pages or post-preview split.