#!/bin/bash
in_pins=""
out_pins=""
unexport=0

while getopts "i:o:u" opt ; do
 case $opt in
  i)  in_pins=$(echo $OPTARG | tr , " ")
      ;;
  o)  out_pins=$(echo $OPTARG | tr , " ")
      ;;
  u)  unexport=1
      ;;
  *)  echo "Unknown option $opt" ; exit 10
 esac
done

if [[ "$in_pins" == "" && "$out_pins" == "" ]] ; then
  echo "Usage: $0 [-u] [-i pin,pin,..] [-o pin,pin,..]"
  echo "where pin is a GPIO pin of /sys/class/gpio/"
  echo "-i is input pins"
  echo "-o is output pins"
  echo "-u is for explicit unexporting (usually not needed)"
  exit 1
fi

# From here you usually need root permissions

# If exported, remove them

if [[ $unexport -eq 1 ]] ; then
  for i in $in_pins $out_pins ; do
    echo $i >/sys/class/gpio/unexport
  done
fi

# Set input pins

for i in $in_pins ; do
  if [[ ! -e /sys/class/gpio/gpio$i ]] ; then
    echo $i >/sys/class/gpio/export
  fi
  echo "in" >/sys/class/gpio/gpio$i/direction
  chmod a+rw /sys/class/gpio/gpio$i/*
done

# Set output pins

for i in $out_pins ; do
    if [[ ! -e /sys/class/gpio/gpio$i ]] ; then
      echo $i >/sys/class/gpio/export
    fi
  echo "out" >/sys/class/gpio/gpio$i/direction
  chmod a+rw /sys/class/gpio/gpio$i/*
done

