
#include <iostream>
#include <string>
using namespace std;

class node
{
public:
	string data;
	node *next;
};

//print data field for each node in list
//from node p to end.
void print(node* p)
{
	node* current = p;
	while (current !=nullptr)
	{
		cout << (*current).data << endl;
		current = (*current).next;
	}
}

int main()
{
	node* A;
	A = new node;
	(*A).data = "apple"; // A->data = "apple";

	node* B;
	B = new node;
	(*B).data = "bananana";
	
	//now, hook B up to A.
	(*A).next = B;

	//Let's make another node
	node* C;
	C = new node;

	//set C's data field:
	(*C).data = "carrot";

	//Hook C up to end of list:
	(*B).next = C;

	//end of list:
	(*C).next = nullptr;

	print(A);

	return 0;
}