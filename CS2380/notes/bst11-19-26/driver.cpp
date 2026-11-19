

#include <iostream>
#include <string>
#include <vector>
#include <map>
#include "binarySearchTree.h"
using namespace std;

int main()
{
	binarySearchTree T;

	int size = 10000;
	double* A = new double[size];
	A[0] = 0;
	for (int i = 1; i < size; i++)
	{
		A[i] = A[i - 1] + rand() % 10;
	}

	//for (int i = 0; i < size; i++)
	//	cout << A[i] << endl;

	//T.buildTreeDumb(A, 0, size-1);
	T.buildTree(A, 0, size - 1);
	//T.display();

	//cout << "height: " << T.height() << endl;

	//////////////////////////////////////////////STL containers////////////////////////
	//Vectors - under the hood is a normal array
	vector<double> V;

	//Maps  - binary search tree
	map<string,double> M;  //items in M are key,value pairs.

	//Insetiona: O(log n)
	M["rene"] = 3.5;
	M["brian"] = 0.1;
	M["oscar"] = 2.1;
	M["jose"] = 4.1;
	M["joe"] = 1;
	M["david"] = 3;
	M["marise"] = 3.2;
	M["javier"] = 3.8;
	M["luis"] = 3.1;
	M["gabriel"] = 2.8;


	//Can peform searches: O(log n)
	cout << M["oscar"] << endl; 
	cout << M["brian"] << endl;

	/*
	for (int i = 0; i < 100; i++)
	{
		V.push_back(rand());
		cout << "size: " << V.size() << endl; //4
		cout << "capacity: " << V.capacity() << endl; // ???
	}
	*/
	cout << "size: " << V.size() << endl; //0
	cout << "capacity: " << V.capacity() << endl; // 0

	V.push_back(3.14);
	V.push_back(5.2);
	V.push_back(7.2);
	V.push_back(8.9);

	cout << "size: " << V.size() << endl; //4
	cout << "capacity: " << V.capacity() << endl; // ???

	V.push_back(1.3);
	V.push_back(9.7);
	V.push_back(172);
	V.push_back(173);

	cout << "size: " << V.size() << endl; //8
	cout << "capacity: " << V.capacity() << endl; // 9

	//for (int i = 0; i < V.size(); i++)
	//	cout << V[i]  << endl;

	return 0;
}