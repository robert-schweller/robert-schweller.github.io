

#include <iostream>
#include <string>
using namespace std;

class node
{
public:
	double data;
	node* next;
};

class linkedList
{
private:
	node* head;

	//return pointer to the node with smallest
	//data, from startptr to end of list.
	node* findSmallest(node * startptr)
	{
		node* smallptr = startptr;
		for (node* iptr = startptr; iptr != nullptr; iptr = iptr->next)
		{
			if (iptr->data < smallptr->data)
				smallptr = iptr;
		}
		return smallptr;
	}

public:
	//constructor: called when list is created
	linkedList()
	{
		head = nullptr;
	}

	//deconstuctor: called when list goes
	//out of scope.
	~linkedList()
	{
		node* current = head;
		node* doomed = current;
		while (current !=nullptr)
		{
			doomed = current;
			current = current->next;
			delete doomed;
		}
	}

	//add x to the linked list
	//in particular, the front.
	void add(double x)
	{
		//create the new node
		node* babyNode;
		babyNode = new node;

		//set the node's variables
		babyNode->data = x;

		//hook new node up at front of list
		babyNode->next = head;
		head = babyNode;
	}

	//print all the items in the linked list
	void print()
	{
		node* finger = head;

		while (finger != nullptr)
		{
			cout << finger->data << endl;
			finger = finger->next;
		}
	}

	//remove and return front item of list
	double removeFront()
	{
		//write down where old head node is
		node* doomedNode;
		doomedNode = head;

		//write down output
		double answer = head->data;

		//actually logically delete first item
		head = head->next;

		//free the node we don't need anymore
		delete doomedNode;

		//return removed item
		return answer;
	}

	//sort the linked list
	//run time: O(n^2)
	void selectionSort()
	{
		for (node * iptr = head; iptr!=nullptr; iptr=iptr->next)
		{
			node* smallptr = findSmallest(iptr);
			swap(iptr->data,smallptr->data);
		}
	}
};

void silly()
{
	linkedList X;
	X.add(2);
	X.add(3);
	X.add(5);
	X.add(7);
	X.add(11);
	X.add(13);
	X.add(17);
}

int main()
{
	linkedList L;

	L.add(8.3);
	L.add(5.6);
	L.add(3.14);
	L.add(2);

	L.print();  // 2 3.14 5.6 8.3

	//Challenge #1: removeFront()
	cout << "removing: " << L.removeFront() << endl; //2
	cout << "removing: " << L.removeFront() << endl; //3.14
	L.add(93);
	cout << "removing: " << L.removeFront() << endl; //93
	cout << "removing: " << L.removeFront() << endl; //5.6
	cout << "removing: " << L.removeFront() << endl; //8.6
	//cout << "removing: " << L.removeFront() << endl; //Dereferencing a nullptr

	//Remaining Challenges:
	// Implement and addBack(x)

	// Implement a remove(x)

	// Implement a removeBack()

	// Deconstructors
	//while(true)
	//	silly();

	// Sort the list
	L.add(57);
	L.add(37);
	L.add(16);
	L.add(21);
	L.add(123);
	L.add(465);
	L.add(47);

	//L.incrementAll();

	L.selectionSort();

	L.print();

	return 0;
}