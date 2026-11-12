#pragma once
#include <iostream>
#include <string>
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

public:
	binarySearchTree()
	{
		root = nullptr;
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
};