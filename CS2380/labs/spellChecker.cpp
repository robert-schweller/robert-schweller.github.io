
#include <iostream>
#include <string>
#include <fstream>
using namespace std;

int main()
{
	double* A;
	A = new double[10];

	A[0] = -5.2;
	A[1] = -2.3;
	A[2] = 1.7;
	A[3] = 4.2;
	A[4] = 7;
	A[5] = 12;
	A[6] = 27;
	A[7] = 32;
	A[8] = 42;
	A[9] = 67;

	//Step 1: Implement Binary Search
	cout << binarySearch(A, 0, 9, 32.0) << endl; //7
	cout << binarySearch(A, 0, 9, -2.3) << endl; //1
	cout << binarySearch(A, 0, 9, 67.0) << endl; //9
	cout << binarySearch(A, 0, 9, 10.2) << endl; //-1 (not found)

	//Step 2: Template your binary search
	string* B;
	B = new string[6];
	B[0] = "apple";
	B[1] = "banana";
	B[2] = "date";
	B[3] = "orange";
	B[4] = "orchid";
	B[5] = "pear";

	string key = "orange";
	cout << binarySearch(B, 0, 5, key) << endl; //3

	//Step 3: Write a spell-checker
	//Create a loop in which the program
	// 1) asks the user to enter a word,
	// 2) tells the user if the word is spelled correctly or not
	// 3) Goes back to the top of the loop and repeats.
	//  Enter a word: wolf
	//  Good job, that is a real word!
	//  Enter a word: compooter
	//  Wrong!  That is a mispelled word!
	//  (Etc..)
	//To solve this, use the following dictionary file containing 202,413 words to get a list
	//of valid words: https://faculty.utrgv.edu/robert.schweller/CS2380/notes/largeDictionary.txt




	//If you are stuck:  First create a size 202,413 array of strings, and read in the words from the dictionary file into this array.
	//Next, enter a loop that:
		//Asks the user to enter a word
		//Does a binary search of your array for that word
		//If it finds it, tells the user congratulations.  Otherwise, tells them they are dumb.

	return 0;
}