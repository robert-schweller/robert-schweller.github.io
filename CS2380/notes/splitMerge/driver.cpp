#include <iostream>
#include <string>
#include <chrono>
#include "doublyLL.h"
using namespace std;



int main()
{
	doublyLL A;
	
	A.addBack(450);
	A.addBack(320);
	A.addBack(750);
	A.addBack(510);
	A.addBack(720);
	A.addBack(230);
	A.addBack(290);
	A.addBack(240);
	A.addBack(320);
	A.addBack(820);
	A.addBack(530);
	A.addBack(210);

	A.printForwards(); //450 320 750..... 530 210

	doublyLL left;
	doublyLL right;

	//Split the contents of list A evenly into the two given (initially empty) lists.
	//If the number of items in the list is odd, put the extra item in the first list.
	//Must run in O(n) time, where n is the total number of items in the list.
	cout << "A thinks it has: " << A.getNumItems() << endl;
	A.split(left, right);

	A.printForwards(); //(empty)
	left.printForwards(); //450 320 750 510 720 230
	right.printForwards(); //290 240 320 820 530 210
	cout << endl;

	//Implement a sorting routine for your list
	//You may implement any elementary sorting algorithm.
	doublyLL X;
	X.addBack(45);
	X.addBack(14);
	X.addBack(71);
	X.addBack(64);
	X.addBack(103);
	X.addBack(2);

	//X.selectionSort();
	X.mergeSort();
	X.printForwards();
	
	//left.selectionSort();
	//right.selectionSort();
	left.mergeSort();
	right.mergeSort();

	left.printForwards(); //230 320 450 510 720 750
	right.printForwards(); //210 240 290 320 530 820
	
	//Implement a method that takes 2 sorted lists and merges them
	//into your (initially empty) list to create one sorted list.
	//Must run in O(n) time, where n is the total number of items in the two given lists.
	A.merge(left, right);

	left.printForwards(); //(empty)
	right.printForwards(); //(empty)
	A.printForwards(); //210 230 240 290 320 320 450 510 530 720 750 820


	//Now, implement the legendary mergeSort algorithm

	//stress test
	int huge = 1000000;
	doublyLL H;

	for (int i = 0; i < huge; i++)
		H.addBack(rand());

	auto start = chrono::high_resolution_clock::now();
	//H.selectionSort();
	H.mergeSort();
	auto finish = chrono::high_resolution_clock::now();

	chrono::duration<double> elapsed = finish - start;
	cout << "Algorithm took: " << elapsed.count() << endl;

	return 0;
}


///Timing code
/*
auto start = chrono::high_resolution_clock::now();
//method to time...
auto finish = chrono::high_resolution_clock::now();

chrono::duration<double> elapsed = finish - start;
cout << "Algorithm took: " << elapsed.count() << endl;
*/



/*
// In-place partition function using Lomuto partition scheme
// Run time: O(n), where n = high-low+1
template <typename T>
int partition(T* arr, int low, int high) {
	T pivot = arr[high]; // choose last element as pivot
	int i = low - 1;     // place for smaller elements

	for (int j = low; j < high; j++) {
		if (arr[j] <= pivot) {
			i++;
			swap(arr[i], arr[j]);
		}
	}
	swap(arr[i + 1], arr[high]); // place pivot in correct position
	return i + 1; // return pivot index
}

*/