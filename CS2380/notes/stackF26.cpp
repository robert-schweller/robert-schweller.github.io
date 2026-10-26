

#include <iostream>
#include <string>
using namespace std;

class stack
{
private:
	string* items; //array of stack items
	int numItems; //number of items in stack
	int cap; //size of the array

	//create bigger size newCap array,
	//copy old array over.
	void resize(int newCap)
	{
		cout << "Resizing array from size " << cap << " to " << newCap << endl;

		//step 1: Create a new size newCap array
		string* bigArray = new string[newCap];

		//step 2: Copy items from items array to new array
		for (int i = 0; i < cap; i++)
			bigArray[i] = items[i];

		//step 3: free the memory used by old array
		delete[] items;

		//step 4: update cap variable to newCap
		cap = newCap;

		//step 5: point items array variable to bigArray
		items = bigArray;

	}

public:
	stack()
	{
		cap = 5;
		items = new string[cap];
		numItems = 0;
	}

	//Add x to top of stack
	void push(string x)
	{
		if (numItems == cap) //out of room!
			resize(2*cap);

		items[numItems] = x;
		numItems++;
	}

	//remove and return top item from stack
	string pop()
	{
		string output = items[numItems-1];
		numItems--;
		return output;
	}
};

int main()
{
	stack S;

	S.push("waffle");
	S.push("blueberry");
	S.push("chocochip");
	S.push("strawberry");
	S.push("protein");
	S.push("water");
	S.push("bagel");
	S.push("nucleo");
	S.push("raison");
	S.push("cinamin");
	S.push("dubstep");
	S.push("maple");
	S.push("salt");
	S.push("peppr");
	S.push("apple");
	S.push("carmel");
	S.push("poly");
	S.push("dusty");


	cout << S.pop()  << endl; //dusty
	cout << S.pop() << endl;  //poly

	S.push("banana");

	cout << S.pop() << endl;  //banananana
	cout << S.pop() << endl;  //carmel

	return 0;
}