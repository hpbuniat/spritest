spritest
=====

**spritest** is a preview tool for css-sprites

Usage
-----

Using spritest is quite simple - just configure a sprite via **sprites.json** and view the index.html in a browser.

**spritest** supports various sprite-setups, but creating a common-class & concrete usage-classes with a common namespace (which will also pass [csslint](https://github.com/stubbornella/csslint)).
A sample configuration is listed in **sprites.dist.json**.

Options
-------
"title": The title, which is shown in the overview

"style": The common-class defintion, which should contain the sprite as background-image

"class": A static common class for all elements

"href": The stylesheet with all element-rules

"namespace": A class namespace to filter the rules within the stylesheet
