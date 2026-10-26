
#include <iostream>
#include <fstream>
#include <string>
#include "trie.h"
using namespace std;

int main()
{
	trie T;

	ifstream infile("words2.txt");

	//read words from dictionary into trie
	string word;
	int freq;
	while (infile >> word)
	{
		infile >> freq;
		T.insert(word);
	}

	//run an autocompletion program
	while (true)
	{
		cout << "Enter a prefix: " << endl;
		string pref;
		cin >> pref;
		cout << T.worstCompletion(pref) << endl;
	}

	return 0;
}
