
#include <iostream>
#include <string>
#include <chrono>
#include "sortingAlgorithms.h"
using namespace std;


//Let n be number of items in range: n= end-start+1
//run time: O(n)
void print(double* A, int start, int end)
{
	//run time is: cost of body times #loops: O(1)*n = O(n)
	for (int i = start; i <= end; i++) //#loops: n loops
	{
		cout << A[i] << endl; //O(1)
	}
}


//add up and return summ of values in given range
double addUp(double* A, int start, int end)
{
	double sum = 0;
	for (int i = start; i <= end; i++)
	{
		sum = sum + A[i];
	}
	return sum;
}


//return index of smallest item within given range
//Let n = end-start+1
//run time: O(1)+O(n)+O(1) = O(n)
int findSmallest(double* A, int start, int end)
{
	int small = start; //O(1)

	//n*O(1)= O(n)
	for (int i = start; i <= end; i++) //#loops: n
	{
		if (A[i] < A[small]) //O(1)
			small = i;
	}
	return small; //O(1)
}

//let n=end-start+1
//Run time: O(n^2)
void selectionSort(double* A, int start, int end)
{
	//run time of loop: n*O(n)= O(n^2)
	for (int i = start; i <= end; i++)//#loops: n
	{ //body runtime: O(n)+O(1)= O(n)
		//step 1: find smallest from i to end. 
		//run time: O(n)
		int small = findSmallest(A, i, end);

		//step 2: swap items at i and small
		//run time: O(1)
		swap(A[i], A[small]);
	}
}

int main()
{
	//Declaring and filling an array
	//dynamic way:
	double* x;
	x = new double[10];

	//assign the cells of the array some values
	x[0] = 5.2;
	x[1] =14.20;
	x[2] = 502.1;
	x[3] = 3.14;
	x[4] = 15.7;
	x[5] = 72.5;
	x[6] = 8.3;
	x[7] = 12.5;
	x[8] = 9.03;
	x[9] = 24.23;

	//Function to print items in array
	print(x, 0, 9);
	cout << endl;
	print(x, 3, 8);
	cout << endl;

	//Challenge 0: (quiz) return sum of values in array
	double sum = addUp(x, 0, 9);
	cout << sum << endl;

	//Challenge 1:  Find Smallest
	cout << findSmallest(x, 0, 9) << endl; // 3
	cout << findSmallest(x, 4, 7) << endl; // 6
	cout << endl;

	//Challenge 2: Sort an unsorted array
	selectionSort(x, 0, 9);
	print(x, 0, 9);



	//Challenge 3: template the function?


	//stress test
	int huge = 1000000;
	double* B = new double[huge];

	for (int i = 0; i < huge; i++)
		B[i] = rand();

	auto start = chrono::high_resolution_clock::now();
	//selectionSort(B, 0, huge - 1);
	mergeSort(B, 0, huge - 1);
	auto finish = chrono::high_resolution_clock::now();
	
	chrono::duration<double> elapsed = finish - start;
	cout << "Algorithm took: " << elapsed.count() << endl;

	//print(B, 0, huge - 1);


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

//Notes:
// Classroom change:  EIEAB 2.203
// Review Session:	  EIEAB 2.207