#!/bin/bash
# Show a spinner on the first character of the LED display
# Spins very slow though

for j in {1..10} ; do
  for i in 1 2 4 64 8 16 32 128 ; do
    node bits.js $i
  done
done

