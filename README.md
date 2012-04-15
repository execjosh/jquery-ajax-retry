jQuery Ajax Retry
=================

This project is a plugin for jQuery that augments `$.ajax` by adding smart retry functionality.

Retry Strategies
----------------

Presently, it's retry strategy employs [exponential backoff][eb], or more specifically
[truncated binary exponential backoff][tbeb], which can help to alleviate server congestion.

[eb]: http://en.wikipedia.org/wiki/Exponential_backoff
[tbeb]: http://en.wikipedia.org/wiki/Truncated_binary_exponential_backoff
