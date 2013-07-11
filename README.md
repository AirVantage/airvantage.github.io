Jekyll 101
==========

Jekyll is a framework for generating static websites out of simple structured content (basically Markdown and HTML files, with a minimal amount of metadata)

http://jekyllrb.com/

What you need to know about our usage of Jekyll
-----------------------------------------------

* `_config.yml` is where the list of contributors to the blog is maintained. It should be trivial to add an author by just duplicating an existing one.
* The content of the website lives under `_posts`. Content is grouped in folders (`api`, `blog`, ...) for the sake of organization but the physical location of the files in the `_posts` folder is not actually important.
* At the moment we rely on one external plugin for generating author pages. This may be removed in a later version, because it prevents to rely on the Jekyll support in Github Pages. It means that when you contribute to the website you will need to publish the new generated website (see "Publishing your changes" below).

Cloning the repository
======================

* `git clone https://github.com/AirVantage/airvantage.github.io.git`

The repository contains two branches:
* `source` is where the whole source of the website lives, that is all the jekyll templates and the actual content (blog posts, tutorials, ...)
* `master` is the generated website. You should not work on this branch. It is automatically updated as part of the publication process (see "Publishing you changes" section)

Contributing content
====================

It should be really easy for you to add your own blog post, tutorial, API example, ...

The Jekyll "front-matter" (what is at the beginning at every content file) is used to set attributes that are common to all kinds of posts, plus some others that are specific.

Front-matter general attributes
-------------------------------

* `category`: must be present and set to either `api`, `blog`, `projects`, or `tutorials` (reminder: the fact that content is arranged in sub-folders under `_posts` has no influence on the actual categorization).
* `comments`: `true` or `false`, depending on whether Disqus comments should be enabled or not for this content.

Blog post
---------

* Create a new file in `_posts/blog`, following the same naming pattern as existing files.
* In addition to `category` and `comments`, you should set the following attributes in the front matter:
    * `layout`: must be set to `post`
    * `title`: title of your blog post
    * `author`: the username of the author of the blog post as per the _config.yml authors list

API example
-----------

* Create a new file in `_posts/api`, following the same naming pattern as existing files.
* In addition to `category` and `comments`, you should set the following attributes in the front matter:
    * `short`: a two-letters shortcut (such as "Ja") that will be displayed in the periodic table
    * `github_repo`: the URL of the Github repo hosting the sample

Projects
--------

* Create a new file in `_posts/projects`, following the same naming pattern as existing files.
* In addition to `category` and `comments`, you should set the following attributes in the front matter:
    * `title`: the title of your blog post
    * `author`: the username of the author of the project as per the _config.yml authors list
    * `img`: the name of the image to be found in `/resources/img/projects/` for representing this project
    * `github_repo`: the URL of the Github repo hosting the project

Tutorials
---------

* Create a new file in `_posts/tutorials`, following the same naming pattern as existing files.
* In addition to `category` and `comments`, you should set the following attributes in the front matter:
    * `layout`: must be set to `default`
    * `title`: the title of the tutorial
    * `img`: the name of the image to be found in `/resources/img/tutorials/` for representing this tutorial


Testing the new website
-----------------------

You need Ruby, RubyGems, and Jekyll. See the installation instructions at http://jekyllrb.com/docs/installation/
While you are working on your modifications, you can have jekyll doing its magic in the background and rebuilding the website as you modify the posts. For this, you just need to run `jekyll serve -w` from the root folder.

Publishing your changes
=======================

When you are happy with your changes, you can publish the new sources _and_ the new generated website

* Publish the new sources
    * Commit you change(s) locally
    * `git push origin source`
* Generate and publish the new website in one line
    * `rake publish`

