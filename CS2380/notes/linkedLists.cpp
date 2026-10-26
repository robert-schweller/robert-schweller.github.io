

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

public:
	linkedList()
	{
		head = nullptr;
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
};



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

	return 0;
}