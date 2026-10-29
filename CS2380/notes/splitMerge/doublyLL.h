#pragma once
#include <iostream>
using namespace std;

class doublyLL
{
private:
	class node
	{
	public:
		node* next;
		node* prev;
		double data;

		node(double x)
		{
			data = x;
			next = nullptr;
			prev = nullptr;
		}
	};

	node* head;
	node* tail;
	int numItems;

	//return pointer to node containing x.
	//If x is not present: return nullptr
	node * find(double x)
	{
		node* finger = head;
		while (finger != nullptr)
		{
			if (finger->data == x)
				return finger;
			
			finger = finger->next;
		}
		return nullptr;
	}

	//remove node pointed to by doomed
	void eliminate(node* doomed)
	{
		if (doomed == nullptr)
		{
			//don't do anything
		}
		else if (head == tail)
		{
			delete head;
			head = nullptr;
			tail = nullptr;
		}
		else if (doomed == head)
		{
			head = head->next;
			head->prev = nullptr;
			delete doomed;
		}
		else if (doomed == tail)
		{
			tail = tail->prev;
			tail->next = nullptr;
			delete doomed;
		}
		else
		{
			doomed->prev->next = doomed->next;
			doomed->next->prev = doomed->prev;
			delete doomed;
		}
	}

	//return pointer to middle node of list
	node* findMiddle()
	{
		node* mid = head;
		for (int i = 0; i < numItems / 2 - 1; i++)
		{
			mid = mid->next;
		}
		return mid;
	}

	//return pointer to node with smallest
	//value in list from p to end.
	//let n be number of items in sublist
	// Runtime: O(1) + O(n) + O(1) = O(n)
	// Run time == O(n)
	node* findSmallest(node * p)
	{
		node* s = p;  //O(1)

		//loop runtime = #loops*costOfBody = n*O(1) = O(n)
		for (node* iptr = p; iptr != nullptr; iptr = iptr->next) //number of loops: n
		{
			if (iptr->data < s->data)  // O(1)
				s = iptr;
		}
		return s;  //O(1)
	}

public:
	doublyLL()
	{
		head = nullptr;
		tail = nullptr;
		numItems = 0;
	}

	//Let T(n) denote run time of mergeSort on n item list.
	// T(1) = c
	// so for bigger, T(n) = O(1)+O(1)+O(n)+T(n/2)+T(n/2)+O(n)
	// so T(n) = 2*T(n/2) + O(n)
	// so T(n) = 2T(n/2) + cn
	// so T(n) = O(n log n) from solving recurrence equation.
	void mergeSort()
	{
		if (head==nullptr || head==tail) //base case: 0 or 1 items
		{
		}
		else
		{
			doublyLL Left;  //O(1)
			doublyLL Right; //O(1)

			//step 0: split n items into to lists down middle
			split(Left, Right); //O(n)

			//step 1: recursively sort Left
			Left.mergeSort();   // T(n/2)

			//step 2: recursivley sort Right
			Right.mergeSort();  // T(n/2)

			//step 3: merge Left and Right back into original list
			merge(Left, Right);  //O(n)

		}
	}

	//perform selection sort on the list
	//Let n be number of items in the list
	//Runtime is: O(n^2)
	void selectionSort()
	{
		//run time of loop: numLoops*costOfBody = n*( O(n) + O(1) ) = n*O(n) = O(n^2)
		for (node* iptr = head; iptr != nullptr; iptr = iptr->next) //#loops: n
		{
			node* s = findSmallest(iptr); //O(n)
			swap(iptr->data, s->data);    //O(1)
		}
	}



	int getNumItems()
	{
		return numItems;
	}

	//run time: O(1)+O(n)+O(1) = O(n)
	void split(doublyLL& left, doublyLL& right)
	{
		if (head == tail) //one item list
		{
			left.head = head;
			left.tail = head;
			head = nullptr;
			tail = nullptr;
		}
		else
		{
			//step 1: find the middle: O(n)
			node* m = findMiddle();

			//step 2: hookup the stuff: O(1)
			m->next->prev = nullptr;
			left.head = head;
			right.head = m->next;
			right.tail = tail;
			left.tail = m;
			m->next = nullptr;
			tail = nullptr;
			head = nullptr;

			//update numItems (forgot this last time): O(1)
			left.numItems = (numItems + 1) / 2;
			right.numItems = numItems / 2;
			numItems = 0;
		}


	}

	void addBack(double x)
	{
		if (head == nullptr)
		{
			node* baby = new node(x);
			head = baby;
			tail = baby;
		}
		else
		{
			node* baby = new node(x);
			tail->next = baby;
			baby->prev = tail;
			tail = baby;
		}
		numItems++;
	}

	void addFront(double x)
	{
		if (head == nullptr)
		{
			addBack(x);
		}
		else
		{
			node* baby;
			baby = new node(x);
			head->prev = baby;
			baby->next = head;
			head = baby;

			numItems++;
		}
	}

	void printBackwards()
	{
		node* finger = tail;
		while (finger != nullptr)
		{
			cout << finger->data << endl;
			finger = finger->prev;
		}
	}

	void printForwards()
	{
		node* finger = head;
		while (finger != nullptr)
		{
			cout << finger->data << ", ";
			finger = finger->next;
		}
		cout << endl;
	}

	void remove(double x)
	{
		//step 1: find the node with x
		node* doomed;
		doomed = find(x);

		//step 2: eliminate it
		eliminate(doomed);

		numItems--;
	}


	void merge(doublyLL& left, doublyLL& right)
	{
		// Assume this list is initially empty.

		while (left.head != nullptr && right.head != nullptr)
		{
			node* temp;

			// Remove the smaller node from its original list.
			if (left.head->data <= right.head->data)
			{
				temp = left.head;
				left.head = left.head->next;
				left.numItems--;
			}
			else
			{
				temp = right.head;
				right.head = right.head->next;
				right.numItems--;
			}

			// Append the removed node to this list.
			temp->prev = tail;
			temp->next = nullptr;

			if (tail == nullptr)
				head = temp;
			else
				tail->next = temp;

			tail = temp;
			numItems++;
		}

		// Move any remaining nodes from the nonempty list.
		doublyLL* remaining;

		if (left.head != nullptr)
			remaining = &left;
		else
			remaining = &right;

		if (remaining->head != nullptr)
		{
			if (tail == nullptr)
				head = remaining->head;
			else
			{
				tail->next = remaining->head;
				remaining->head->prev = tail;
			}

			tail = remaining->tail;
			numItems += remaining->numItems;
		}

		// Both input lists are now empty.
		left.head = nullptr;
		left.tail = nullptr;
		left.numItems = 0;

		right.head = nullptr;
		right.tail = nullptr;
		right.numItems = 0;
	}




};