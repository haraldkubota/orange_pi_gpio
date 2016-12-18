#!/bin/bash
in_pins=""
out_pins=""

while getopts "i:o:" opt ; do
 case $opt in
  i) in_pins=$(echo $OPTARG | tr , " ")
     ;;
  o) out_pins=$(echo $OPTARG | tr , " ")
     ;;
  *) echo "Unknown option $opt" ; exit 10
 esac
done

if [[ "$in_pins" == "" && "$out_pins" == "" ]] ; then
  echo "Usage: $0 -i pin,pin,.. -o pin,pin,.."
  echo "where pin is a GPIO pin of /sys/class/gpio/"
  exit 1
fi

# From here you usually need root permissions

# If exported, remove them

for i in $in_pins $out_pins ; do
  echo $i >/sys/class/gpio/unexport
done

# Set input pins

for i in $in_pins ; do
  echo $i >/sys/class/gpio/export
  echo "in" >/sys/class/gpio/gpio$i/direction
  chmod a+rw /sys/class/gpio/gpio$i/*
done

# Set output pins

for i in $out_pins ; do
  echo $i >/sys/class/gpio/export
  echo "out" >/sys/class/gpio/gpio$i/direction
  chmod a+rw /sys/class/gpio/gpio$i/*
done

