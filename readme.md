# Gradient Studio

this is my new project gradient studio its a little web app for making cool css gradients
you can pick between linear radial or conic gradients and change the angle and add as many color stops as you want. it's super easy you just click the plus button to add a color and you can drag the slider to change where it sits in the gradient. theres also a randomize button for when you're feeling lucky it just goes wild and makes something new.

## Why i made this webpage

* i wanted to make something that was actually fun and looked cool
* i get bored easy so i added a ton of themes like dark vintage and a neon one (my favorite)
* it just makes it feel less like a chore and more like you're playing around

## How i made it

* its just html css and javascript no big frameworks
* i tried to be organized and put all the js in one big class
* for the themes i just used css variables so javascript only has to swap one class on the body and boom new theme its super simple
* saving presets just adds an object to an array in the javascript. when you open the modal it just reads that array to show you your saved stuff

## Struggles and what i have learned

* getting the presets to save right was a struggle. i kept messing up the data
* i decided to save the theme too which made it more complicated i ended up with this.presets.presets which is a dumb name but it works lol
* the tailwind export was also tricky i had to do a bunch of math to turn the angle number into a direction like to-r
* i learned that css variables are actually really powerful and cool for theming
* it was fun to build my own thing and make it exactly how i like it even if i spent too much time on the neon theme that no one will probably use. but now i have a tool i actually like using.

## usage of AI

* Error Lens : finds error in realtime
* Amazon Q Cli : real time code suggestion and explains error
* ChatGPT and Claude : solves bigger porblems