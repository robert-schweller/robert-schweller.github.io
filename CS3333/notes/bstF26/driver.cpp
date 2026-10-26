
#include <iostream>
#include <string>
#include "bst.h"
using namespace std;

int main()
{
	binarySearchTree T;

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


	//quiz:  show (picture) bst generated from above insertions, and state height of tree.

	T.display();

	cout << "Height is " << T.height() << endl;


	//Next:  modify so height is computed in O(1) time.

	return 0;
}