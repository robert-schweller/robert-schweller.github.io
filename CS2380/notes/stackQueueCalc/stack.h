#pragma once
#include <iostream>
using namespace std;

template <class THING>
class stack
{
private:
	THING* items; //array of stack items
	int numItems; //number of items in stack
	int cap; //size of the array

	//create bigger size newCap array,
	//copy old array over.
	void resize(int newCap)
	{
		cout << "Resizing array from size " << cap << " to " << newCap << endl;

		//step 1: Create a new size newCap array
		THING* bigArray = new THING[newCap];

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
		items = new THING[cap];
		numItems = 0;
	}

	//Add x to top of stack
	void push(THING x)
	{
		if (numItems == cap) //out of room!
			resize(2 * cap);

		items[numItems] = x;
		numItems++;
	}

	//remove and return top item from stack
	THING pop()
	{
		THING output = items[numItems - 1];
		numItems--;
		return output;
	}

	bool empty()
	{
		if (numItems == 0)
			return true;
		else
			return false;
	}
};
