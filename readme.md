# Inker - an email marketing creation workflow for keeping sane email templates

*Not ready*

## Basics

Inker one of the best way to build email templates, take back control over your html, never have again this big mess of tables you can't understand. 

Inker is:

* Built on top of Zurb Ink
* Sane CSS components structure with sass
* Sane HTML components structure with nunjuck
* Auto generate template to HTML documents with inlined CSS
* Auto deployment on litmus for testing

## Getting started

Inker require **npm** & **grunt** to be already installed.



```bash
git clone https://github.com/posabsolute/inker.git
cd inker && npm install
```

You have now everything you need to use inker. There is template examples in src/templates to help you get started.


## Available grunt commands

* grunt watch *- Watch source folder for changes & generate dist files*
* grunt css *- Build CSS* 
* grunt html *- Build HTML templates*
* grunt build *- Build css & html*
* grunt connect *- test emails in your browser from the root folder (http://0.0.0.0:8555/)
* grunt email *- Send a test email to any email inbox*
* grunt litmus *- Send a test email to litmus*

## CSS with Inker

Inker use [Zurb Ink](http://zurb.com/ink/) as its base responsive css framework, everything in ink is available in inker, please refer to their [documentation](http://zurb.com/ink/docs.php). Inker also use the meta framework [ITCSS](http://csswizardry.net/talks/2014/11/itcss-dafed.pdf) for the files & folders structure. Better explained by this image. The css is situated in **src/css**

It is important to follow ITCSS rules if you want to keep a sane CSS structure with inker.

**base.scss** is your base CSS file importing all needed files for inker. For example, if you add  a css component you must add import it in base.scss. 

*It is important to note that since we inline style to html nodes it make no sense to pick & choose components you want to use as it will make no difference on the file size in the end*


### Responsive

Responsive rules are in the folder **8_trumps**, please note that these rules are added to the document head instead of inlined using data-ignore="ignore" in html templates.

### Adding css to the head

You can add css to head the using the data-ignore rule in your template:
```html
<!-- external styles -->
<link rel="stylesheet" data-ignore="ignore"  href="../css/style.css" />

<!-- embedded styles -->
<style data-ignore="ignore">
 /* styles here will not be inlined */
</style>
```

## HTML with inker

At its core, inker use [Mozilla Nunjucks](http://mozilla.github.io/nunjucks/) to build html templates, please see nunjucks [documentation](http://mozilla.github.io/nunjucks/templating.html) for more information on how you can take inker even farther.

Inker as an html components stucture that use nunjucks macros. an example of component:

```html
{% macro button(label='default', link='#', class='', align='left') %}
  <table class="button {{class}}" align="{{align}}">
    <tr>
      <td>
        <a href="{{link}}">{{label}}</a>
      </td>
    </tr>
  </table>
{% endmacro %}
```

```html
// Import the component in the base.html file in html-components folder.
{% from "/html-components/component.button.html" import button %}
```


Usage in html template:
```javascript
button('Go to google', 'http://www.google.com', 'button-green', 'left');
```



**When creating new components remember to add them to the base.html file situates in _src/html-components_**

### Inker with your back-end templating engine & application

Inker is specially thought so it integrate with your back-end application, Inker templating engine use <# #> so it does not interfere with others templating engine making it possible to test your templates with inker & then use your back-end to place data & send your email.

### Inker with dynamic custom data

Inker can use json files as a source of dynamic data, an use example would be to test product loops. Of course this means that if you get that data from a back-end api you will need to replace the loop system to match your templating engine after.

This is a built-in feature of [grunt-nunjucks-2-html](https://www.npmjs.com/package/grunt-nunjucks-2-html).
```javascript
nunjucks: {
  options: {
    data: grunt.file.readJSON('data.json')
  }
}
```

## Included components

Here is the current list of implemented component. I am always looking to add more components to inker.

### Buttons

*Options:*
* Label
* Link
* Class to add
* Alignement

Usage: 
```javascript
button('Go to google', 'http://www.google.com', 'button-green', 'left');
```

Render:
```html
  <table class="button button-green" align="left">
    <tr>
      <td>
        <a href="http://www.google.com">Go to google</a>
      </td>
    </tr>
  </table>
```






## Sending test email to your inbox

Inker use grunt-nodemailer to send test. By default it send a test for all files that are in the output folders, you can easily change that in **gruntfile.js**. However a better way to use it would be to change the path directly from the grunt command.

```bash
// Override default src provided in gruntfile
grunt email --fileSrc=dist/output/example.html
```

Config example:
```javascript
nodemailer: {
    options: {
      transport: {
        type: 'SMTP',
        options: {
          service: 'Gmail',
          auth: {
            user: 'your.email@gmail.com',
            pass: 'BLAH'
          }
        }
      },
      recipients: [
        {
          email: 'your.email@gmail.com',
          name: 'Jane Doe'
        }
      ]
    },
    src: ['dist/output/*.html']
},
```

## Contributions

I am always happy to accept contributions, but please follow ITCSS guidelines & please test your new components of bug fices in most used email clients.

## Licence

*All tools used in this project are bound by their own licence.*

The MIT License (MIT)

Copyright (c) 2014 Cedric Dugas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

