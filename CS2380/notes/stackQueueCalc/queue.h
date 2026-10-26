#pragma once

class queue
{
private:
	double* items; //array to hold items in queue
	int numItems;  //number of items in queue
	int front;     //index of front item in queue
	int capacity;  //size of array

public:
	queue()
	{
		capacity = 8;
		items = new double[capacity];
		numItems = 0;
		front = 0;
	}

	//add x to back of queue
	void enqueue(double x)
	{
		int index = (front + numItems)%capacity;
		items[index] = x;
		numItems = numItems + 1;
	}

	//remove and return item at front of queue
	double dequeue()
	{
		int output = items[front];

		front = (front + 1)%capacity;
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