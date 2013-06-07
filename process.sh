#!/bin/sh
cat ./data/u01.txt | sed "s/<span class=\"small\">Datum der letzten Abgabe: //" | sed "s/<br>//" | sed "s/---//" | awk 'NF > 0' | sed 's/^\s*//g'


