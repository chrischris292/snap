---
layout: post
title: "November 2012 Update"
description: "progress report for November 2012"
category: updates
tags: [update, progress, report]
---
{% include JB/setup %}


Introduction 
------------

[`Bio.js`](http://stanley-gu.github.com/sbmlNodes/) is an SBML model viewer, editor, and simulator that is written in JavaScript and can run entirely within a web browser. 

### Why is `bio.js` useful? ###
*  __A no-install and always-updated, modeling platform.__ The end user will never have to install any software
*  __Quickly view and interact with published models.__ Mathematical models in scientific publications are often difficult to reproduce exactly, even if the underlying SBML is included with the publication. `Bio.js` will allow a publication to directly link to a live and interactive version of their model.
*  __Always have models available on any computer.__ Models can be stored and edited online, with version control of the model development done through `git`, like Google Docs for bio-models.
*  __Collaborate with other modelers.__ Multiple users can work on building the same model and sharing experimental data. 

Updates
-------
*  [Version 0.1](http://stanley-gu.github.com/sbmlNodes/assets/demos/0.1/index.html) released
*  Built on [`jQuery`](http://jquery.com/), [`D3.js`](http://d3js.org/), and [`numeric.js`](http://www.numericjs.com/).
*  Loading SBML models
    *  automatic visual layout of species and reactions using force directed algorithm 
    *  able to switch on and off or manually drag layout
*  Simulation within client browser
    *  interactive and real time simulations with changing species initial concentration and 
*  Served through [Node.js](http://nodejs.org/) server that will allow for:
    *  server side computation and simulation
    *  able to call C libraries, which is not possible only browser-side JavaScript
    *  may be useful for interactive simulations,  able to scale well with many server calls
    *  storing and versioning of models
    *  maintenance of both client and server side code in JavaScript 

In the works
------------
*  Creating a richer UI and menu system to allow for customizing visual layouts of the model and simulation output
*  Allow more ways for the user to edit models (e.g. adding species and reaction nodes) and export the updated SBML
*  Creating user accounts to store models online
*  Implement [RoadRunner](http://code.google.com/p/roadrunnerlib/) to perform simulations on the server-side
