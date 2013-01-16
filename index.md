---
layout: page
title: snap 
tagline: Bio-models in the Browser!
---
{% include JB/setup %}

<div id="examples">
    <a class="example" href="assets/images/a.png">
        <img src="assets/images/a.png">
    </a>    
    <a class="example" href="assets/images/b.png">
        <img src="assets/images/b.png">
    </a>    
    <a class="example" href="assets/images/c.png">
        <img src="assets/images/c.png">
    </a>
    <a class="example" href="assets/images/d.png">
        <img src="assets/images/d.png">
    </a>    
</div>

**node-sbml** is a bio-model viewer, editor, and simulator that allows scientists to quickly view and manipulate SBML models through the browser.   

**Updates**
------------------------------------

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
