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

public:
	doublyLL()
	{
		head = nullptr;
		tail = nullptr;
		numItems = 0;
	}

	int getNumItems()
	{
		return numItems;
	}

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
			//step 1: find the middle
			node* m = findMiddle();

			//step 2: hookup the stuff
			m->next->prev = nullptr;
			left.head = head;
			right.head = m->next;
			right.tail = tail;
			left.tail = m;
			m->next = nullptr;
			tail = nullptr;
			head = nullptr;
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

};
