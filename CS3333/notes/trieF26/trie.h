#pragma once
#include <iostream>
#include <string>
using namespace std;

class trie
{
private:
	class node
	{
	public:
		bool marked;
		node* children[256];

		//augmentation to make
		//bad autocompleter
		string longest;

		node()
		{
			marked = false;
			for (int i = 0; i < 256; i++)
				children[i] = nullptr;
		}
	};

	node* root;

	//print all words in trie rooted at p,
	//with pre stuck at front of each word.
	void display(node* p, string pre)
	{
		if(p==nullptr)
		{ }
		else
		{
			if (p->marked)
				cout << pre << endl;

			for (int i = 0; i < 256; i++)
			{
				display(p->children[i], pre + (char)i);
			}
		}
	}

public:
	trie()
	{
		root = new node; //dummy node
	}

	void insert(string s)
	{
		node* arrow = root;

		for (int i = 0; i < s.length(); i++)
		{
			if (arrow->children[s[i]] == nullptr)
				arrow->children[s[i]] = new node;

			arrow = arrow->children[s[i]];

			//check if s is dumber (longer)
			//than current dumbest
			if (s.length() > arrow->longest.length())
				arrow->longest = s;
		}

		arrow->marked = true;
	}

	//return longest completion of prefix pre
	string worstCompletion(string pre)
	{
		node* finger = root;
		for (int i = 0; i < pre.length(); i++)
		{
			finger = finger->children[pre[i]];

			if (finger == nullptr)
				return pre;
		}
		return finger->longest;
	}

	void display()
	{
		display(root,"");
	}
};