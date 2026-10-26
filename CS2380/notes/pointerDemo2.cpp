
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
	//while (true)
	//{
	//	summonATaco();
	//}

	//Freeing dynamic memory: delete command
	taco* mytaco;
	mytaco = new taco;

	(*mytaco).flavor = "chorizo";
	(*mytaco).cheese = true;

	//shorthand notation
	mytaco->flavor = "beef";

	delete mytaco;  //free the taco when done.

	//Bracket operator and arrays: []
	double* numPtr;
	numPtr = new double[5];

	//pointer arithmetic: numPtr+1 is really
	//numPtr + 1*sizeOf(double).
	cout << numPtr << endl; // some address
	cout << numPtr + 1 << endl; //???
	cout << numPtr + 2 << endl;
	cout << numPtr + 3 << endl;
	cout << numPtr + 4 << endl;

	*numPtr = 5.1;
	*(numPtr + 1) = 10.2;
	*(numPtr + 3) = 12.4;

	//Let's loop through the doubles
	for (int i = 0; i < 5; i++)
	{
		cout << *(numPtr + i) << endl;
	}

	//shorthand notation: *(numPtr+i) == numPtr[i]
	for (int i = 0; i < 5; i++)
	{
		cout << numPtr[i] << endl;
	}

	delete [] numPtr;  //free the array when done.

	//QUIZ:  see below

	//Static 2D arrays
	char grid[4][6];

	//initialize all grid elements to something
	for (int i = 0; i < 4; i++)
		for (int j = 0; j < 6; j++)
			grid[i][j] = '-';

	grid[2][5] = 'a';
	grid[3][1] = 'b';

	//let's print all the items
	for (int i = 0; i < 4; i++)
	{
		for (int j = 0; j < 6; j++)
		{
			cout << grid[i][j] << " ";
		}
		cout << endl;
	}


	return 0;
}



//Quiz:
/*
int a[5] = { 0, 10, 20, 30, 40 };
int k = 3;
int* p;
p = a + 1;

cout << a[k] << endl;
cout << *(a + k) << endl;
cout << *a << endl;
cout << a[*a] << endl;
cout << a[*a + 2] << endl;
cout << *p << endl;
cout << p[0] << endl;
cout << p[1] << endl;
*/

