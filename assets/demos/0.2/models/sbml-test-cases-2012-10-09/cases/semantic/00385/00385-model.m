(* 

category:      Test
synopsis:      Basic two reactions with four species in one compartment
               and two events that assign value to a species.
componentTags: Compartment, Species, Reaction, Parameter, EventNoDelay 
testTags:      Amount, ConstantSpecies
testType:      TimeCourse
levels:        2.1, 2.2, 2.3, 2.4, 3.1
generatedBy:   Numeric

The model contains one compartment called C.  There are four species called
S1, S2, S3 and S4 and two parameters called k1 and k2.  Species S4 is
labeled as constant and therefore cannot be changed by rules or reactions.
The model contains two reactions defined as:

[{width:30em,margin-left:5em}|  *Reaction*  |  *Rate*  |
| S1 + S2 -> S3 | $k1 * S1 * S2 * C$  |
| S3 -> S1 + S2 | $k2 * S3 * S4 * C$  |]

The model contains two events that assign values to species S1 and S4:

[{width:30em,margin-left:5em}| | *Trigger*          | *Delay* | *Assignments* |
 | Event1                      | $S2 < S4$          | $-$     | $S1 -> 2 \x 10^-3$    |]
 | Event2                      | $S3 > 2 \x 10^-3$ | $-$     | $S3 -> 1 \x 10^-3$    |]

The initial conditions are as follows:

[{width:30em,margin-left:5em}| |*Value*          |*Units*  |
|Initial amount of S1          |$1.0 \x 10^-3$  |mole                       |
|Initial amount of S2          |$1.0 \x 10^-3$  |mole                       |
|Initial amount of S3          |$1.9 \x 10^-3$  |mole                       |
|Initial amount of S4          |$1.0 \x 10^-3$  |mole                       |
|Value of parameter k1         |$0.75 \x 10^3$  |litre mole^-1^ second^-1^  |
|Value of parameter k2         |$0.25 \x 10^3$  |litre mole^-1^ second^-1^  |
|Volume of compartment C       |$1$              |litre                      |]

The species values are given as amounts of substance to make it easier to
use the model in a discrete stochastic simulator, but (as per usual SBML
principles) their symbols represent their values in concentration units
where they appear in expressions.

*)

newcase[ "00385" ];

addCompartment[ C, size -> 1 ];
addSpecies[ S1, initialAmount -> 1.0 10^-3];
addSpecies[ S2, initialAmount -> 1.2 10^-3];
addSpecies[ S3, initialAmount -> 1.9 10^-3];
addSpecies[ S4, initialAmount -> 1.0 10^-3, constant -> True];
addParameter[ k1, value -> 0.75 10^3 ];
addParameter[ k2, value -> 0.25 10^3 ];
addReaction[ S1 + S2 -> S3, reversible -> False,
	     kineticLaw -> k1 * S1 * S2 * C ];
addReaction[ S3 -> S1 + S2, reversible -> False,
	     kineticLaw -> k2 * S3 * S4 * C ];
addEvent[ trigger -> S2 < S4, eventAssignment -> S1->2/10^3 ];
addEvent[ trigger -> S3 > 2/(10^3), eventAssignment -> S3->1/10^3 ];

makemodel[]
