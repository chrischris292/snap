(* 

category:      Test
synopsis:      Two reactions with four species in one 
compartment using an assignmentRule to vary one species.
componentTags: Compartment, Species, Reaction, Parameter, AssignmentRule 
testTags:      Concentration, NonUnityCompartment, InitialValueReassigned
testType:      TimeCourse
levels:        2.1, 2.2, 2.3, 2.4, 3.1
generatedBy:   Numeric

The model contains one compartment called C.  There are four
species called S1, S2, S3 and S4 and three parameters called k1, k2 and k3.
The model contains two reactions defined as:

[{width:30em,margin-left:5em}|  *Reaction*  |  *Rate*  |
| S1 + S2 -> S3 | $k1 * S1 * S2 * C$  |
| S3 -> S1 + S2 | $k2 * S3 * C$  |]

The model contains one rule which assigns value to species S4:

[{width:30em,margin-left:5em}|  *Type*  |  *Variable*  |  *Formula*  |
 | Assignment | S4 | $k3 * S2$  |]

In this case there is no initial value declared for species S4 and thus it
must be calculated by the assignmentRule.  Note that since this
assignmentRule must always remain true, it should be considered during
simulation.

The initial conditions are as follows:

[{width:30em,margin-left:5em}| |*Value*          |*Units*  |
|Initial concentration of S1   |$   1 \x 10^-5$ |mole litre^-1^                      |
|Initial concentration of S2   |$ 1.5 \x 10^-5$ |mole litre^-1^                      |
|Initial concentration of S3   |$   1 \x 10^-5$ |mole litre^-1^                      |
|Initial concentration of S4   |$   undeclared$ |mole litre^-1^                      |
|Value of parameter k1         |$  1.5 \x 10^5$ |litre mole^-1^ second^-1^ |
|Value of parameter k2         |$            5$ |second^-1^ |
|Value of parameter k3         |$          1.5$ |dimensionless |
|Volume of compartment C       |$          0.1$ |litre                     |]

*)

newcase[ "00607" ];

addCompartment[ C, size -> 0.1];
addSpecies[ S1, initialConcentration->1 10^-5 ];
addSpecies[ S2, initialConcentration -> 1.5 10^-5];
addSpecies[ S3, initialConcentration -> 1 10^-5];
addSpecies[ S4];
addParameter[ k1, value -> 1.5 10^5];
addParameter[ k2, value -> 5 ];
addParameter[ k3, value -> 1.5 ];
addRule[ type->AssignmentRule, variable -> S4, math ->k3 * S2];
addReaction[ S1 + S2 -> S3, reversible -> False,
	     kineticLaw -> k1 * S1 * S2 * C ];
addReaction[ S3 -> S1 + S2, reversible -> False,
	     kineticLaw -> k2 * S3 * C ];

makemodel[]
