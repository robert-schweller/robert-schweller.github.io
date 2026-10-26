

#include <iostream>
#include <string>
#include <vector>
using namespace std;

class linkedList
{
private:
	class node
	{
	public:
		double data;
		node* next;
		node(double x)
		{
			data = x;
			next = nullptr;
		};
	};

	node* head;

	//Bad use of recursion:  stack size O(n)
	void printForwardsRec(node* p)
	{
		if(p==nullptr)
		{
		}
		else
		{
			cout << p->data << endl;
			printForwardsRec(p->next);
		}
	}

	//Bad use of recursion: O(n) stack size
	void printBackwardsRec(node* p)
	{
		if (p==nullptr) //base case
		{
			//nothing to print... solved!
		}
		else  //recursive case
		{
			printBackwardsRec(p->next);
			cout << p->data << endl;
		}
	}

	//Add x to the back of the list starting at node p
	//Bad use of recursion: O(n) calls on stack
	void addBack(double x, node * &p)
	{
		if (p == nullptr)
		{
			p = new node(x);
		}
		else
		{
			addBack(x, p->next);
		}
	}

public:
	linkedList()
	{
		head = nullptr;
	}

	void addFront(double x)
	{
		node* baby = new node(x);
		baby->next = head;
		head = baby;
	}

	void addBack(double x)
	{
		addBack(x, head);
	}

	
	void printForwards()
	{
		printForwardsRec(head);
	}

	void printBackwards()
	{
		printBackwardsRec(head);
	}

	//void reverse()
	//{

	//}
};


int binarySearch(double* A, int start, int end, double key)
{
	if (start > end) //base case: no items in search range
	{
		return -1;
	}
	else  //recursive case: more than 0 items 
	{
		int m = (start + end) / 2;

		if (key == A[m])
			return m;
		if (key < A[m])
			return binarySearch(A,start, m-1,key);
		if (key > A[m])
			return binarySearch(A,m+1, end, key);
	}
}

int main()
{
	linkedList L;
	L.addFront(11);
	L.addFront(7);
	L.addFront(5);
	L.addFront(3);
	L.addFront(2);
	L.addBack(13);
	L.addBack(17);
	L.addBack(19);

	int huge = 100000;
	for (int i = 0; i < huge; i++)
		L.addFront(rand());

	L.printBackwards();
	//L.printForwards();

	//L.printForwards();
	//cout << endl;
	//L.printBackwards();


	double* numbers;
	numbers = new double[12];

	numbers[0]=-5.3;
	numbers[1]=-1.5;
	numbers[2]=2.5;
	numbers[3]=3.14;
	numbers[4]=5.7;
	numbers[5]=8;
	numbers[6]=12.1;
	numbers[7]=15;
	numbers[8]=23;
	numbers[9]=28;
	numbers[10]=32;
	numbers[11]=56;

	cout << binarySearch(numbers, 0, 11, 5.7) << endl; // 4
	cout << binarySearch(numbers, 0, 11, 12.1) << endl; // 6
	cout << binarySearch(numbers, 0, 11, 7) << endl;// -1

	return 0;
}

//quiz: 
//recursive binary search
//linked lists with recursive methods: printBackwards, addBack, sort

