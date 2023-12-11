#!/bin/bash
refdoc=~/Documents/tmp/pandoc-playground/custom-reference-计院本科课程设计.docx
echo $1
basename=$1
fname="${basename%.*}"
echo $fname
pandoc1 --verbose -t docx+native_numbering -F mermaid-filter -f markdown+table_captions --reference-doc $refdoc -o $fname.docx $fname.md