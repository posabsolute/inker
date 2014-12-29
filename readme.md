# Inker - an email marketing creation workflow for keeping sane email templates

*Not ready*

## Basics

Inker is a new way to build email templates, take back control over your templates, never have again this big mess of tables you can't understand. Inker is:

* Built on top of Zurb Ink
* Sane CSS components structure with sass
* Sane HTML components structure with nunjuck
* Auto generate template to HTML documents with inlined CSS
* Auto deployment on litmus for testing

## Getting started

Inker require npm & grunt to be already installed.



```javascript
git clone https://github.com/posabsolute/inker.git
cd inker && npm install
```

You have now everything you need to get started. There is template examples in src/templates to help you get started.


## Available grunt commands

* grunt watch *watch all source folders for changes*
* grunt css *Build CSS* 
* grunt html *Build HTML templates*
* grunt build *Build css & html*
* grunt litmus *send a test email to litmus*

## CSS with Inker

Inker use ink as it base css framework, everything in ink is available in inker, please refer to there documentations. Inker also use the meta framework ITCSS as the base folder structure. Better explain by this image. The css is situated in *src/css*

It is important to follow ITCSS if you want to keep a sane CSS structure with inker, I may also reject contributions not following this.

base.scss is your base CSS file importing all needed files for inker, for example if you add components you must add the import to base.scss. *It is important to note that since we inline style to html node it make no sense to pick & choose components you want to use as it will make no difference on the file size in the end (like you would do in bootstrap to save css kilobytes)*


### Responsive

Responsive rules are situated in 8_trumps, please note that these rules are added to head instead of inlined using data-ignore="ignore" in html templates.

### Adding css to head

You can add css to head using the data-ignore rule in your template:
```html
<!-- external styles -->
<link rel="stylesheet" data-ignore="ignore"  href="../css/style.css" />

<!-- embedded styles -->
<style data-ignore="ignore">
 /* styles here will not be inlined */
</style>
```

## HTML with inker






