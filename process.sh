#!/bin/sh

cat $1 \
	| grep "Datum der letzten" \
	| sed "s/<span class=\"small\">Datum der letzten Abgabe: //" \
	| sed "s/<br>//" \
	| sed "s/---//" \
	| awk 'NF > 0' \
	| sed 's/^\s*//g' \
	| sed 's/\.//g' \
	| sed 's/\,//g' \
	| awk '{ print $3 "/" $2 "/" $1";"$4":00" }' \
	| sed 's/Nov/11/g' \
	| sed 's/Dez/12/g' \
	| sed 's/Okt/10/g' \
	| sed 's/Sep/09/g' \
	| sed 's/Jan/01/g' \
	| sed 's/Feb/02/g' \
	| sed 's/Mar/03/g' \
	| sed 's/Apr/04/g' \
	| sed 's/Mai/05/g' \
	| sed 's/Jun/06/g' \
	| sed 's/Jul/07/g' \
	| sed 's/Aug/08/g' \

