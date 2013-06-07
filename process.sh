#!/bin/sh

cat ./data/u03.txt \
	| sed "s/<span class=\"small\">Datum der letzten Abgabe: //" \
	| sed "s/<br>//" \
	| sed "s/---//" \
	| awk 'NF > 0' \
	| sed 's/^\s*//g' \
	| sed 's/\.//g' \
	| sed 's/\,//g' | awk '{ print $3"/05/"$1";"$4":00" }' 

