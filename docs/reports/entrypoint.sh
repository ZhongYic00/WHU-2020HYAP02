#!/bin/bash
dir=$PWD
for i in $(ls $dir/*.md)
do
echo $i;
./md2docx.sh $i;
done