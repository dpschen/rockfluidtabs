# [rockFluidTabs](https://rockfluidtabs.pschen.de/)

> Buttery smooth tabs animated with velocity

I was searching for a tab library with a high frame rate and couldn't find any that I perfectly liked.
So I made one by implementing [Velocity](http://julian.com/research/velocity/) in jQuery-Organic-Tabs.

This is far from perfect but I still wanted to share it.
There is a working example in index.html.

## Quick setup
1. Use this HTML

    ```html
    <div class="example">
      <ul class="nav">
        <li><a href="#alpha">Tab Alpha</a></li>
        <li><a href="#beta">Tab Beta</a></li>
        <li><a href="#gamma">Tab Gamma</a></li>
      </ul>
    
      <div class="tab-wrap">
        <div id="alpha">
          <!-- content of tab alpha -->
          <p>Lorem</p>
        </div>
    
        <div id="beta">
          <!-- content of tab beta -->
          <p>Impsum</p>
        </div>
    
        <div id="gamma">
          <!-- content of tab gamma -->
          <p>Dolor</p>
        </div>
    
      </div> <!-- END Tab Wrap -->
    </div> <!-- END rockFluidTabs example -->
    ```

2. Add jQuery, Velocity and rockFluidTabs directly in front of the closing ```</body>```.

    ```html
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
    <script src="js/rockFluidTabs.js"></script>
    ```

3. Call the plugin.
    ```html
    <script>
      $(function() {
        'use strict';
    
        $('.example').rockFluidTabs();
      });
    </script>
    ```

4. Set the styles you want. For a simple start:
    ```html
    <style>
      .example .nav {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
      }
      .example .nav li {
        flex: 1;
        margin-left: 10px;
      }
      .example .nav li:first-child {
        margin-left: 0;
      }
      .example .nav a {
        display: block;
        color: #fff;
        background: #999;
        text-align: center;
        padding: 10px;
        font-weight: bold;
        transition: all .2s ease;
      }
      .example .nav .current {
        background: #eee;
        color: #666;
      }
      .example .tab-wrap { background: #eee; }
      .example .tab-wrap div { padding: 20px; }
    </style>
    ```

## Options
You can set options to the tab like this:

```js
$('.example').rockFluidTabs({
  // options, defaults listed

  speed: 400,
  // speed in ms

  easing: 'easeInOutQuart',
  // use one of the velocity easings http://velocityjs.org/#easing

  nav: '.nav',
  // define selector for navigation

  currentClass: '.current'
  // define current class of the navigation

  tabWrap: '.tab-wrap',
  // define selector for wrapper of tabs
});
```

## Assumptions
This script makes almost no assumptions about the styling of your tabs. You are free to use the basic styling given in the example

## Todo
- [ ] Make history work
- [ ] Remove jQuery as dependency
- [ ] Remove Velocity as dependency
- [ ] …

Based on [jQuery-Organic-Tabs](http://css-tricks.com/examples/OrganicTabs/) by Chris Coyier.
