# Inker - transaction & marketing email development workflow

## Basics

Big tables mess no more. Inker provides all the mechanics for creating sane email templates and keeping a clean workflow.

Documentation [http://posabsolute.github.io/inker/](http://posabsolute.github.io/inker/)

Inker is :

* Built on top of Zurb Ink
* Sane CSS components structure with [sass](http://sass-lang.com/)
* Sane HTML components structure with [nunjucks](http://mozilla.github.io/nunjucks)
* Auto generate template to HTML documents with inlined CSS
* Auto deployment on [litmus](https://litmus.com/) for testing
* Auto deployment to any email address for testing
* Basic REST mail sender server.


## Getting started

Inker requires **npm** & **grunt** to be already installed.

```bash
git clone https://github.com/posabsolute/inker.git
gem install premailer
cd inker && npm install
```

You have now everything you need to use inker. Your first stop would be the example in src/templates to help you get started.


## Available grunt commands

* grunt watch *- Watch source folder for changes & generate dist files*
* grunt css *- Build CSS*
* grunt html *- Build HTML templates*
* grunt build *- Build css & html*
* grunt connect *- test emails in your browser from the root folder (http://0.0.0.0:8555/)
* grunt email *- Send a test email to any email inbox*
* grunt litmus *- Send a test email to litmus*


## CSS with Inker

Inker use [Zurb Ink](http://zurb.com/ink/) responsive css framework, everything in Ink is available in inker, please refer to their [documentation](http://zurb.com/ink/docs.php). Inker also uses the meta framework [ITCSS](http://csswizardry.net/talks/2014/11/itcss-dafed.pdf) for the files and folders' structure. Better explained by this image. The css can be found in **src/css**

**base.scss** is your base CSS file importing all needed files for inker, if you add a css component you must import it in base.scss.

*It is important to note that since we inline style to html nodes it makes no sense to pick and choose components you want to use as it will make no differences on the file size in the end*

### Responsive

Responsive rules are in the folder **8_trumps**, please note that these rules are added to the document's head instead of inlined using data-ignore="ignore" in the html templates.

### Ignore css inlining

```html
<!-- external styles -->
<link rel="stylesheet" data-ignore="ignore"  href="../css/style.css" />

<!-- embedded styles -->
<style data-ignore="ignore">
 /* styles here will not be inlined */
</style>
```

### Adding new themes

Open 7_themes, you will see there is already a folder called sidebarhero used for the sidebar hero template. Add a new folder in 7_themes for your template, your main css file will be automatically generated in dist/css/[your folder].

Then in your html, use:
```html
  {% block theme_css %}<link href="../../css/sidebarhero/sidebarhero.css" media="all" rel="stylesheet" type="text/css" />{% endblock %}
```

## HTML with inker

Inker uses [Mozilla Nunjucks](http://mozilla.github.io/nunjucks/) to build html templates, please see nunjucks' [documentation](http://mozilla.github.io/nunjucks/templating.html) for more information on how you can take inker even further.

Inker as an html component stucture that uses nunjucks macros. Example of component:

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


Usage in html template :
```javascript
{{ button('Go to google', 'http://www.google.com', 'button-green', 'left'); }}
```

**When creating new components, remember to add them to the base.html file situated in _src/html-components_**


### Creating new html templates

Open the template's folder, you should see a folder sidebar_hero, add your own folder here. Please refer to  sidebar_hero for a complete example.

#### Example of base template

```html
{% extends "/html-components/base.html" %}
  {% block main_css %}
    <link href="../../css/main.css" media="all" rel="stylesheet" type="text/css" />
  {% endblock %}
  {% block theme_css %}
    <link href="../../css/sidebarhero/sidebarhero.css" media="all" rel="stylesheet" type="text/css" />
  {% endblock %}

  {% block responsive_css %}
    <link href="../../css/responsive.css" media="all" data-ignore="ignore" rel="stylesheet" type="text/css" />
  {% endblock %}

  {% block meta_title %}
    Email title in document head
  {% endblock %}

{% block mainContent %}
  {% block header %}
    {% include "/templates/sidebar_hero/header.html" %}
  {% endblock %}
  {% block content %}
    {% include "/templates/sidebar_hero/content.html" %}
  {% endblock %}
{% endblock %}
```


### Inker with your back-end templating engine & application

There is a bit of a duality with Inker, it uses a templating engine to generate templates but must not use it to render personalized data on first pass so that it can be generated by another templating engine or by the server.

#### Passing data and custom template logic by string

If you have a conflict with nunjucks' template syntax, you can pass your variables and custom logics as strings likewise :

```html
  <h4>{{ '{{ name }}' }} last step and you're done!</h4>

  <p>
    {{ '{% for item in loop %}' }}
    {{ '{{ item }}' }} &nbsp;
    {{ '{% endfor %}' }}
  </p>
```

In the final email template, this will look like :

```html
  <h4>{{ name }} last step and you're done!</h4>

  <p>
    {% for item in loop %}
      {{ item }}
    {% endfor %}
  </p>
```

#### Using a custom syntax

Inker enables you to use a custom syntax to not interfere with your templating engine of choice. If you do use a custom syntax, you will have to replace the current implementation with the new syntax.

```javascript
nunjucks: {
  options: {
    tags : {
      blockStart: '<%',
      blockEnd: '%>',
      variableStart: '<$',
      variableEnd: '$>',
      commentStart: '<#',
      commentEnd: '#>'
    }
  }
}
```

### Inker with dynamic custom data

Inker can use json files as a source of dynamic data. Please note that you can also use the provided rest api to test custom data.

This is a built-in feature of [grunt-nunjucks-2-html](https://www.npmjs.com/package/grunt-nunjucks-2-html).
```javascript
nunjucks: {
  options: {
    data: grunt.file.readJSON('data.json')
  }
}
```


## Included components
Current list of implemented components. (I am always looking to add more components to inker.)

### Buttons

*Options :*
* Label
* Link
* Class to add
* Alignment

Usage :
```javascript
button('Go to google', 'http://www.google.com', 'button-green', 'left');
```

Render :
```html
  <table class="button button-green" align="left">
    <tr>
      <td>
        <a href="http://www.google.com">Go to google</a>
      </td>
    </tr>
  </table>
```

### Progress Bar

*Options:*
* width of bars
* progress
* label
* Class to add


Usage :
```javascript
progressbar('100%', 70, 'Your progress so far', 'progressbar-green');
```

Render :
```html
  <table class='progressbar progressbar-green' cellpadding="0" cellspacing="0" width="100%">
      <tr>
          <td class='foreground' style='' width="70%">
              Your progress so far
          </td>
          <td class="background" width="30%">
              &nbsp;
          </td>
      </tr>
  </table>
```

### Video

Please refer to campaign monitor chart to see which email client supports video, fallback to an image.

*Options :*
* width
* height
* video_src
* video_link
* video_image_placeholder
* class

Usage :
```javascript
video(320, 176, 'http://www.google.com', 'http://www.google.com', 'http://www.google.com', 'video-big');
```

Render :
```html
  <div class="video_holder video-big">
      <video width="320" height="176" controls>
          <source src="{{video_src}}.mp4" type="video/mp4">
          <source src="{{video_src}}.ogg" type="video/ogg">
            <a href="{{video_link}}" ><img height="176"
              src="{{video_image_placeholder}}" width="320" /></a>
      </video>
  </div>
```

### Image Caption

*Options :*
* Label
* Width
* Class
* Align

Usage :
```javascript
caption('This is a cat', '320px', 'caption-red', 'left');
```

Render :
```html
  <table class="caption caption-red" cellpadding="0" cellspacing="0" width="320px" border="0", align='left'>
      <tr>
          <td align="center">
              <img src="http://placekitten.com/g/300/300" alt="" />
              <div>This is a cat</div>
          </td>
      </tr>
  </table>
```

### Panel

*Options :*
* Label
* size (default: twelve)
* Class

Usage :
```javascript
panel('This is a panel', 'twelve', 'panel-red');
```

Render :
```html
  <table class="twelve panel-red columns">
    <tr>
      <td class="panel">

        This is a panel

      </td>
      <td class="expander"></td>
    </tr>
  </table>
```


## Sending a test email to your inbox

Inker uses [grunt-nodemailer](https://github.com/dwightjack/grunt-nodemailer) to send tests. By default, it sends a test for all files that are in the output folders, you can easily change that in **gruntfile.js**.

However a better way to use it would be to change the path directly from the grunt command. This makes it possible to send tests really fast with different templates.

```bash
// Override default src provided in gruntfile
grunt email --fileSrc=dist/output/example.html
```

Config example :
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

## Using litmus

Grunt litmus [documentation](https://github.com/jeremypeter/grunt-litmus).


### Overriding default files sent to litmus

grunt litmus:dist/output/sidebar_hero/index.html

### Default config
The most used email clients are already set in the config file.

```javascript
litmus: {
  test: {
    src: ['email.html'],
    options: {
      username: 'username',
      password: 'password',
      url: 'https://yourcompany.litmus.com',
      clients: [
        //gmail
        'gmailnew', 'ffgmailnew', 'chromegmailnew',
        // outlook
        'ol2002', 'ol2003', 'ol2007', 'ol2010', 'ol2011', 'ol2013',
        // hotmail
        'outlookcom', 'ffoutlookcom', 'chromeoutlookcom',
        //Yahoo
        'chromeyahoo',
        //applemail
        'appmail6',
        //mobile
        'iphone6plus', 'iphone6', 'iphone5s', 'androidgmailapp', 'android4', 'ipad',
        // spam check
        'messagelabs'
      ]
    }
  }
},
```
## REST API

Inker comes with a basic nodejs rest api that can handle rendering templates with custom variables and send emails throught SMTP to any email provider. In it's current state I would recommend keeping it internal and not opening it completely on the web.

There is a public [Postman](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en) collection for your convenience for testing the api locally.
https://www.getpostman.com/collections/5e0cbbb46d8e9fff3c8d

### Starting the server
Install all dependencies
```javascript
npm install
```

Start the server
```javascript
node src/server/server.js
```

### Authentication

The server has a basic auth system. It expects a token for each request. This token is set in */src/server/config.js*

Default :
```javascript
X-Authorization-Token : asd98a7s9898asdaSDA(asd987asda*(&*&%))
```

### API Templates rendering

The API also uses nunjucks to render custom variables. Remember that since we use the same rendering engine (nunjucks) for both front-end & server side, you must use strings in your template to add variables and custom template logics.

Example:
```html

  <h4>{{ '{{ name }}' }} last step and you're done!</h4>

  <p>
    {{ '{% for item in loop %}' }}
    {{ '{{ item }}' }} &nbsp;
    {{ '{% endfor %}' }}
  </p>
```

You can configure the template syntax in */src/server/config.js*.


"POST /templates/[path & name to template]"

Base path is dist/output

Example:
```javascript
"POST /templates/sunday/index"
// Post data
{
  "name": "Cedric",
  "loop": ["1","2","3"]
}
```

### API Email sending

The api can send emails to a variety of SMTP services, MailGun, Mandrill, SendGrig, Gmail, etc. You can see the full list in */src/server/serviceAuth.js*

Example :
```javascript
"POST /email/send"
// Post data
{
  "template" : {
    "src": "data_example/index.html",
    "data": {
      "name": "Cedric",
      "loop": ["1","2","3"]
    }
  },
  "options" : {
    "from": "sender@address",
    "to": "cedric.dugas@gmail.com",
    "subject": "hello",
    "text": "hello world!"
  },
  "service" : {
    "name": "MailGun"
  }
}
```

### Email delivery service Authentication

You must add your credentials in */src/server/serviceAuth.js*



## Special thanks

Thanks to [Litmus](http://www.litmus.com) for providing free email client testing for this project.


## Contributions

I'm always happy to accept contributions, I'm currently looking for more components and examples, but please follow ITCSS guidelines, and please test your new components in the most used email clients.


## Licence

The MIT License (MIT)

Copyright (c) 2014 Cedric Dugas [http://www.position-absolute.com](http://www.position-absolute.com)

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

