
#include <iostream>
#include <string>
#include "bst.h"
#include "avl.h"
using namespace std;

int main()
{
	AVL T;
	//binarySearchTree T;

	T.insert(590);
	T.insert(84);
	T.insert(57);
	T.insert(12);
	T.insert(924);
	T.insert(553);
	T.insert(78);
	T.insert(601);
	T.insert(432);
	T.insert(59);
	T.insert(570);
	T.insert(559);
	T.insert(580);
	T.insert(300);
	T.insert(565);
	T.insert(390);

	//T.display();

	int huge = 100000;
	for (int i = 0; i < huge; i++)
	{
		//T.insert(rand());
		T.insert(i);
	}

	cout << "Height is " << T.height() << endl;



	return 0;
}