
//Create a dog class such that the following
//test code performs as specified in the comments.

int main()
{
	//Make some constructors
	dog bonny;
	dog wimpy;
	dog fido("rottweiler", 200);
	dog snuffles(15);

	//A "setter" method
	bonny.setBreed("pit bull");
	bonny.setWeight(500);

	//Don't let the user set weight to something dumb...
	wimpy.setWeight(-300);

	//cout information about the dog in the speak method
	bonny.speak(); //I'm a 500 lbs pit bull
	wimpy.speak(); //I'm a 0 lbs mutt
	fido.speak();  //I'm a 200 lbs rottweiler
	snuffles.speak(); //I'm a 15 lbs mutt

	//feed the dog food to increase it's weight
	fido.feed(20);
	fido.speak(); //I'm a 220 lbs rottweiler

	bonny.feed(40);
	bonny.speak(); //I'm a 540 lbs pit bull

	//Freaky dog day
	bonny.switchBodies(fido);

	bonny.speak(); //I'm a 220 lbs rottweiler
	fido.speak();  //I'm a 540 lbs pit bull

	//Uh oh, the dogs are breeding....
	dog puppy;
	puppy = fido.mateWith(wimpy);

	puppy.speak(); //I'm a 250 lbs pit bull-mutt

	//Advanced stuff: Operator overloading
	fido++;
	fido.speak();  //I'm a 640 lbs pit bull

	if( fido < bonny )
		cout << "Bonny's heavier" << endl;
	else
		cout << "Fido's heavier" << endl;

	dog puppy2 = bonny + snuffles;
	puppy2.speak(); //I'm a 100 lbs rottweiler-mutt

	return 0;
}


