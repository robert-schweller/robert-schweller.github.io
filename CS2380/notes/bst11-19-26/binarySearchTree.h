#pragma once
#include <iostream>
#include <string>
#include <queue>
using namespace std;

class binarySearchTree
{
private:
	class node
	{
	public:
		double data;
		node* left;
		node* right;

		node(double x)
		{
			data = x;
			left = nullptr;
			right = nullptr;
		}
	};

	node* root;

	void recInsert(node*& p, double x)
	{
		if (p==nullptr)
		{
			p = new node(x);
		}
		else
		{
			if (x < p->data)
				recInsert(p->left, x);
			else
				recInsert(p->right, x);
		}
	}

	void inOrder(node* p)
	{
		if (p == nullptr)
		{
			//no items to print, super easy base case.
			//saving tons of coding time by not having
			//to do anything!!!!!
		}
		else
		{
			inOrder(p->left);
			cout << p->data << endl;
			inOrder(p->right);
		}
	}

	double extractMin(node*& p)
	{
		if (p->left == nullptr)
		{
			node* doomed = p;
			p = p->right;
			double store = doomed->data;
			delete doomed;
			return store;
		}
		else
		{
			return extractMin(p->left);
		}
	}

	void recRemove(node*& p, double x)
	{
		if (p==nullptr) //Item not in tree
		{
			return;
		}
		else if (p->data == x) //p is the item to remove
		{
			if (p->right == nullptr) //directly remove p
			{
				node* doom = p;
				p = p->left;
				delete doom;
			}
			else //don't delete p, replace it's value
			{
				p->data = extractMin(p->right);
			}
		}
		else //recursive case: contniue searching for x
		{
			if (x < p->data)
				recRemove(p->left,x);
			else
				recRemove(p->right, x);
		}
	}

	//return height of tree rooted at node p.
	int recHeight(node* p)
	{
		if (p == nullptr)
			return -1;
		else
		{
			int lheight = recHeight(p->left);
			int rheight = recHeight(p->right);

			return 1 + max(lheight, rheight);
		}
	}

	//Build a balanced bst from given sorted array,
	//and return pointer to root of tree you created.
	node * recBuildTree(double* A, int start, int end)
	{
		if (start > end) //no items
		{
			return nullptr;
		}
		else
		{
			int m = (start + end) / 2;

			node* baby = new node(A[m]);  //create root
			baby->left = recBuildTree(A, start, m - 1); //create left subtree
			baby->right = recBuildTree(A, m + 1, end);  //create right subtree

			return baby;
		}
	}

public:
	binarySearchTree()
	{
		root = nullptr;
	}

	//Build a balanced bst from given sorted array
	//Uses a good recursive method to build a balanced tree.
	void buildTree(double* A, int start, int end)
	{
		root = recBuildTree(A, start, end);
	}

	//given sorted A, add all of A's items to bst
	//bad way to do this, creates height n-1 tree!
	void buildTreeDumb(double *A, int start, int end)
	{
		for (int i = start; i <= end; i++)
			insert(A[i]);
	}

	int height()
	{
		return recHeight(root);
	}

	void insert(double x)
	{ 
		recInsert(root, x);
	}

	double extractMin()
	{
		return extractMin(root);
	}

	void display()
	{
		inOrder(root);
	}

	void remove(double x)
	{
		recRemove(root, x);
	}

	//Print items in order of level (order of distance from root)
	//This is actually called a Breadth-First-Search
	void levelOrderTraversal()
	{
		//step 0: declare a queue from the STL
		queue<node*> Q;

		//step 1:
		Q.push(root);

		//step 2: the main loop
		while (! Q.empty())
		{
			//step 2.1
			node* x = Q.front();
			Q.pop();

			//step 2.2
			cout << x->data << endl;

			//step 2.3: add kids to Q
			if (x->left != nullptr)
				Q.push(x->left);
			if (x->right != nullptr)
				Q.push(x->right);
		}
	}

};