

#include <iostream>
#include <string>
#include "binarySearchTree.h"
using namespace std;

int main()
{
	binarySearchTree T;

	T.insert(43);
	T.insert(17);
	T.insert(89);
	T.insert(68);
	T.insert(12);
	T.insert(5);
	T.insert(35);
	T.insert(47);
	T.insert(92);
	T.insert(23);
	T.insert(19);

	//Show bst after insertions:
	//T.display();
	
	
	//What is: height:  , #leaves: 


	//Extract min
	//cout << T.extractMin() << endl;  //5
	//cout << T.extractMin() << endl;  //12
	//cout << T.extractMin() << endl;  //17
	//cout << T.extractMin() << endl;  //19
	//cout << T.extractMin() << endl;  //23

	cout << "Tree after extracts: " << endl;
	T.display();

	//General remove
	T.remove(5);
	T.remove(68);
	T.remove(23);
	T.remove(89);

	cout << "after removals" << endl;
	T.display();

	return 0;
}