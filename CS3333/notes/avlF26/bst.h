#pragma once
#include <iostream>
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
		};
	};

	node* root;

	//insert x into tree rooted at node p
	void insert(node*& p, double x)
	{
		if (p==nullptr) //base case
		{
			p = new node(x);
		}
		else //recursive case
		{
			if (x < p->data)
				insert(p->left, x);
			else
				insert(p->right, x);
		}
	}

	//print all items in tree rooted at node p
	void display(node* p)
	{
		if (p==nullptr)  //base case
		{
			//whoa!  no nodes!  printing all of them
			//is just do nothing!!!
			//save tons of coding time in this step
			//because nothing to do!!!!!
		}
		else //recursive case
		{
			cout << p->data << endl;
			display(p->left);
			display(p->right);
		}
	}

	//print all items in tree rooted at node p, in order!
	void inOrder(node* p)
	{
		if (p == nullptr)  //base case
		{
		}
		else //recursive case
		{
			inOrder(p->left);
			cout << p->data << endl;
			inOrder(p->right);
		}
	}

	int height(node* p)
	{
		if (p == nullptr)
			return -1;
		else
		{
			int lh = height(p->left);
			int rh = height(p->right);
			return max(lh, rh) + 1;
		}
	}

	//quiz
	int numLeaves(node* p)
	{
		if (p==nullptr) //base 1: 0 nodes
		{
			return 0;
		}
		else if (p->left == nullptr && p->right == nullptr) //base 2: 1 nodes
		{
			return 1;
		}
		else
		{
			int lleft = numLeaves(p->left);
			int lright = numLeaves(p->right);
			return lleft + lright;
		}
	}

public:
	binarySearchTree()
	{
		root = nullptr;
	}

	void insert(double x)
	{
		insert(root, x);
	}

	void display()
	{
		inOrder(root);
	}

	int height()
	{
		return height(root);
	}

	//int numLeaves()
	//{
	//	return numLeaves(root);
	//}
};