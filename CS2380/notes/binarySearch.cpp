
#include <iostream>
#include <string>
#include <chrono>
using namespace std;

//Let n be number of items in range: n= end-start+1
//run time: O(n)
void print(double * A, int start, int end )
{
	//run time is: cost of body times #loops: O(1)*n = O(n)
	for (int i = start; i <= end; i++) //#loops: n loops
	{
		cout << A[i] << endl; //O(1)
	}
}

//return the index of key in the array from start to end
//run time: n*O(1) = O(n)
int linearSearch(double * A, int start, int end, double key)
{
	for (int i = start; i <= end; i++) //#loops: n
	{
		if (A[i] == key) //O(1)
			return i;
	}
	return -1; //item isn't in search range
}

//Run time: O(log n)
int binarySearch(double* A, int start, int end, double key)
{
	int s = start;
	int e = end;

	while (s<=e) //#loops: log_2 n
	{
		int m = (s + e) / 2;

		if (key < A[m])
			e = m - 1;
		if (key > A[m])
			s = m + 1;
		if (key == A[m])
			return m;
	}
	return -1;
}

int main()
{
	//Declaring and filling an array
	//double x[10]; //static array declaration

	//dynamic way:
	double* x;
	x = new double[10];

	//assign the cells of the array some values
	//happens to be in sorted order.
	x[0] = 3.14;
	x[1] = 4.20;
	x[2] = 5.1;
	x[3] = 5.2;
	x[4] = 5.7;
	x[5] = 7.5;
	x[6] = 10.3;
	x[7] = 10.5;
	x[8] = 15.03;
	x[9] = 24.23;

	//Function to print items in array
	print(x, 0, 9);
	cout << endl;
	print(x, 3, 8);
	cout << endl;

	//Linear Search
	cout << linearSearch(x, 0, 9, 10.3) << endl;  // 6
	cout << linearSearch(x, 0, 9, 5.7) << endl;  // 4
	cout << linearSearch(x, 0, 9, 21) << endl;  // -1

	//Binary Search
	cout << binarySearch(x, 0, 9, 10.3) << endl;  // 6
	cout << binarySearch(x, 0, 9, 5.7) << endl;  // 4
	cout << binarySearch(x, 0, 9, 21) << endl;  // -1

	//Challenge:  Find Smallest


	//Challenge 2: Sort an unsorted array


	//Challenge 3: Quiz

	return 0;
}


//Notes:
// Classroom change:  EIEAB 2.203
// Review Session:	  EIEAB 2.207