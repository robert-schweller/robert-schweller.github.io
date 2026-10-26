

#include <iostream>
#include <string>
#include <chrono>
#include <queue>
using namespace std;

//return the index of the smallest value
//that is in the range from index start to end (inclusive)
//Let n be size of search space: n = end-start+1
//Run time: O(1)+O(1)+O(n)+O(1)= O(n)
int findSmallest(vector<double> &V, int start, int end) //O(1)
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
void printList(vector<double> &V) //O(1)
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
void selectionSort(vector<double> &X) //O(1)
{
	//n*O(n)= O(n^2)
	for (int i= 0; i < X.size(); i++) //iterations: n
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
	selectionSort(X);
	printList(X);
	cout << endl;



	//Stress test with large list
	int huge = 1000000;
	//int huge = 100;

	vector<double> L;
	for (int i = 0; i < huge; i++)
		L.push_back(rand());

	auto start = chrono::high_resolution_clock::now();
	//selectionSort(L);
	heapSort(L);
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