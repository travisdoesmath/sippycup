# Sippycup

An in-browser Flask sandbox in a static web page

Try it out at [sippycup.app](https://sippycup.app)!

## Flask-lite

Sippycup uses [Pyodide](https://github.com/pyodide/pyodide) to run Python code in the browser. Currently (Feb 2023), Pyodide cannot run a Flask server because it has no implementation of sockets, so Sippycup is an attempt to make a "training wheels" version of Flask that runs in the browser. Sippycup is primarily a proof-of-concept at this point, so odd behaviors should be expected, and logging any issues that you run into is greatly appreciated.