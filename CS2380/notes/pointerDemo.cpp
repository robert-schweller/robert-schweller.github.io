
#include <iostream>
#include <string>
using namespace std;

class taco
{
public:
	string flavor;
	bool cheese;
};

//Uh oh, a memory leak
void summonATaco()
{
	taco* p;
	p = new taco;

	//free up the memory after you are done to fix memory leak, use delete p
	//delete p;
}

int main()
{
	//"Address of" operator: &
	int x;
	x = 5;

	cout << "An int is: " << sizeof(x) << " bytes" << endl;
	cout << "x is stored at memory address: " << &x << endl;


	//Pointer variables
	
	//a pointer variable to store address of an int variable.
	int* p;

	p = &x;

	cout << p << endl; //weird memory addresss
	cout << x << endl; //5

	//Dereference operator: *
	cout << *p << endl; //should be 5
	*p = 7;
	cout << *p << endl; //7
	cout << x << endl;  //7

	//Dynamic memory allocation: new command
	double* q; //a double pointer
	q = new double;

	*q = 3.14;

	int y = 5;
	int* w = &y;

	cout << "How big is w: " << sizeof(w) << " bytes " << endl; // 4 or 8?
	cout << "How big is *w: " << sizeof(*w) << " bytes " << endl; //4 or 8?

	cout << "How big is q: " << sizeof(q) << " bytes " << endl;
	cout << "How big is the double q points at ( *q ): " << sizeof(*q) << " bytes " << endl;
	cout << q << endl;  //weird memory address
	cout << *q << endl; // 3.14

	//Pointers to any type of object
	taco* tacoPtr;
	tacoPtr = new taco;

	(*tacoPtr).flavor = "egg";
	(*tacoPtr).cheese = true;

	//same thing as (*tacoPtr).flavor
	tacoPtr->flavor = "chorizo";


	cout << "Yum, I'm eating a " << (*tacoPtr).flavor << " with " << (*tacoPtr).cheese << " cheese."<< endl;


	//Memory leaks

	//Let's create a memory leak and crash our computer!
	//Fix this with the delete command.
	while (true)
	{
		summonATaco();
	}

	//Freeing dynamic memory: delete command


	//Bracket operator and arrays: []


	//quiz 2





	return 0;
}


//Quiz 1:
/*
int x = 5; int y = 8; int* p = &x; *p = y; p = &y; *p = 10; cout << x << " " << y;
*/


