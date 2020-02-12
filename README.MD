# Imperialist competitive algorithm visualistion

![pic should be here :()](https://raw.githubusercontent.com/tomsiemek/imperialistic-competitive-algorithm-visualisation/master/pics/everything.png)

### [working demo](https://tomsiemek.github.io/imperialistic-competitive-algorithm-visualisation/)

## What is it?

Imperialist competitive algorithm is [population based heuristic](https://en.wikipedia.org/wiki/Evolutionary_computation), which utilises some [swarm intelligence](https://en.wikipedia.org/wiki/Swarm_intelligence) like mechanisms and competition similar to genetic algorithm. 

[wiki link](https://en.wikipedia.org/wiki/Imperialist_competitive_algorithm)

## What am I looking at?

My implementation looks for minimum of given function. There are few predefined functions (Rastrigin, Ackley, Sphere, Rosenbrock, Himmelblau).

Big dots are metropolis(capitals/centers of empires), smaller ones are theirs colonies. Colonies are getting closer and closer to theirs metropolies. If they will find better solution in the process they become the new metropolis. Whole empires have one color.

Every iteration weakest empire loses one if its colonies, to other empire(the stronger empire the more likely it is to get a colony).

## How to run
Copy/download repository and run **index.html** 

or go to

https://tomsiemek.github.io/imperialistic-competitive-algorithm-visualisation/

## How to use?
* if everything is too big and doesnt fit the screen or it is too small use **ctrl+[+/-]** or **ctrl+[mouse scroll]**
* resume/stop to control visualisation
* change parameters on the right and click **RESTART WITH PARAMETERS** to apply
* if you messed up parameters click **RESET PARAMETERS TO DEFAULT**
* list on empires in the center
* hover on nation for tooltip

## Cryptic parameters

![pic should be here :()](https://raw.githubusercontent.com/tomsiemek/imperialistic-competitive-algorithm-visualisation/master/pics/beta-gamma.png)

**Alpha** - [0, 1] - coefficient in calculating total empire power - how important are colonies in evaluation value of empire

**Beta** - [1, ∞] - multiplier of maximum distance colony can "travel" in one iteration - how "explorative"of the space "behind" metropolis are the colonies

**Gamma** - [0, π] - maximum angle of deviation from line connecting centers - how "explorative" are colonies in their travel to the metropolis

## Technology

It is made with pure javascript. 

**Libraries:**

[d3.js](https://d3js.org/) - making graphs

[math.js](https://mathjs.org/) - parsing mathematical expressions
