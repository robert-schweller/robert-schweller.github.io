

#include <iostream>
#include <string>
#include <chrono>
#include <queue>
using namespace std;

//return the index of the smallest value
//that is in the range from index start to end (inclusive)
//Let n be size of search space: n = end-start+1
//Run time: O(1)+O(1)+O(n)+O(1)= O(n)
int findSmallest(vector<double>& V, int start, int end) //O(1)
{
	int smallestSeen = start; // O(1)

	//run time: n*O(1) = O(n)
	for (int i = start; i <= end; i++) //#iterations: n
	{
		if (V[i] < V[smallestSeen]) //O(1)
			smallestSeen = i;
	}

	return smallestSeen; // O(1)
}

//Let n be the size of the vector V, n= V.size()
//Run time: O(1) + O(n) = O(n)
void printList(vector<double>& V) //O(1)
{
	//Run time: n*O(1) = O(n)
	for (int i = 0; i < V.size(); i++)//#iterations: n
	{
		cout << V[i] << endl; //O(1)
	}
}

void printList2(vector<double> V)
{
	for (auto x : V)
	{
		cout << x << endl;
	}
}

//Classic selection sort algorithm
//Run time: O(1)+O(n^2) = O(n^2)
void selectionSort(vector<double>& X) //O(1)
{
	//n*O(n)= O(n^2)
	for (int i = 0; i < X.size(); i++) //iterations: n
	{ //total of loop body: O(n)+O(1)=O(n)
		//find smallest from i to end
		int small = findSmallest(X, i, X.size() - 1); //O(n)

		//swap smallest into position i
		swap(X[i], X[small]); //O(1)
	}
}

//Run time: O(n*log n)
void heapSort(vector<double>& X)
{
	priority_queue<double> H; //a heap

	//step 1: insert each item into heap: O(n*log n)
	for (int i = 0; i < X.size(); i++) //iteratoins: n
		H.push(X[i]); //O(log n)

	//step 2: O(n*log n)
	for (int i = 0; i < X.size(); i++) //iterations: n
	{
		X[i] = H.top(); //O(1)
		H.pop();  //O(log n)
	}

}

// In-place partition function using Lomuto partition scheme
// Run time: O(n), where n = high-low+1
template <typename T>
int partition(vector<T>& arr, int low, int high) {
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


//Merge sorted "left" (left to mid) with sorted "right" (mid+1 to right)
//Run time: O(n), where n = right-left+1.
template <typename T>
void merge(vector<T>& vec, int left, int mid, int right) {
	int i, j, k;
	int n1 = mid - left + 1;
	int n2 = right - mid;

	// Create temporary vectors
	vector<T> leftVec(n1), rightVec(n2);

	// Copy data to temporary vectors
	for (i = 0; i < n1; i++)
		leftVec[i] = vec[left + i];
	for (j = 0; j < n2; j++)
		rightVec[j] = vec[mid + 1 + j];

	// Merge the temporary vectors back into vec[left..right]
	i = 0;
	j = 0;
	k = left;
	while (i < n1 && j < n2) {
		if (leftVec[i] <= rightVec[j]) {
			vec[k] = leftVec[i];
			i++;
		}
		else {
			vec[k] = rightVec[j];
			j++;
		}
		k++;
	}

	// Copy the remaining elements of leftVec[], if any
	while (i < n1) {
		vec[k] = leftVec[i];
		i++;
		k++;
	}

	// Copy the remaining elements of rightVec[], if any
	while (j < n2) {
		vec[k] = rightVec[j];
		j++;
		k++;
	}
}

//Sort V from positions start to end
//Worst-case: O(n^2), Average Case: O(n log n)
template <class T>
void quickSort(vector<T>& V, int start, int end)
{
	if (start >= end) //base case: 1 or 0 items
	{
		return;
	}
	else //recursive case: more than 1 item
	{
		//step 1: partition around a pivot
		int p = partition(V, start, end);

		//step 2:
		quickSort(V, start, p - 1);

		//step 3:
		quickSort(V, p + 1, end);
	}
}

//run time: O(n log n)
void mergeSort(vector<double>& V, int start, int end)
{
	if (start >= end) //base case: 1 or 0 items
	{
		return;
	}
	else
	{
		int m = (start + end) / 2;

		mergeSort(V, start, m);   //sort left
		mergeSort(V, m + 1, end); //sort right
		merge(V, start, m, end);  //merge 2 sorted halves together
	}
}

int main()
{
	vector<double> X;

	X.push_back(15.3);		//At index 0
	X.push_back(8);			//1
	X.push_back(568);		//2
	X.push_back(45);		//3
	X.push_back(3.14);		//4
	X.push_back(93.7);		//5
	X.push_back(703);		//6
	X.push_back(57);		//7
	X.push_back(347.2);		//8
	X.push_back(1.5);		//9
	X.push_back(752);		//10
	X.push_back(57);		//11
	X.push_back(12);		//12
	X.push_back(53);		//13

	//Warmup:
	//Print the list

	printList(X);
	cout << endl;
	printList2(X);
	cout << endl;



	//Challenge #2:
	//Search list for smallest item:
	//return the index of smallest in specified range

	cout << findSmallest(X, 0, X.size() - 1) << endl;  //9
	cout << findSmallest(X, 5, 8) << endl;   //7
	cout << endl << endl;


	//Challenge #3
	//Sort the list
	//selectionSort(X);
	mergeSort(X, 0, X.size() - 1);
	//quickSort(X, 0, X.size() - 1);
	printList(X);
	cout << endl;



	//Stress test with large list
	int huge = 1000000;
	//int huge = 100;

	vector<double> L;
	for (int i = 0; i < huge; i++)
	{
		//L.push_back(rand());
		L.push_back(i);
	}

	auto start = chrono::high_resolution_clock::now();
	//selectionSort(L);  //6 minutes
	//heapSort(L);       //0.18 seconds
	mergeSort(L,0,L.size()-1); //0.26 seconds, .19 seconds (sorted)
	//quickSort(L, 0, L.size() - 1); //.06 seconds (random list), crash (sorted list)
	auto finish = chrono::high_resolution_clock::now();

	chrono::duration<double> elapsed = finish - start;
	cout << "Algorithm took: " << elapsed.count() << endl;

	//printList(L);


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