#pragma once
#include <iostream>
using namespace std;


class AVL
{
private:
	class node
	{
	public:
		double data;
		node* left;
		node* right;

		//For the AVL tree extension
		int height;

		node(double x)
		{
			data = x;
			left = nullptr;
			right = nullptr;

			height = 0;
		};
	};

	node* root;

	int height(node* p)
	{
		if (p == nullptr)
			return -1;
		else
			return p->height;
	}

	void updateHeight(node* p)
	{
		p->height = max(height(p->left), height(p->right)) + 1;
	}

	void rightRotation(node*& p)
	{
		node* A = p;
		node* B = p->left;
		node* br = B->right;

		p = B;
		A->left = br;
		B->right = A;

		//update heights
		updateHeight(A);
		updateHeight(B);
	}

	void leftRotation(node*& p)
	{
		node* A = p;
		node* B = p->right;
		node* bl = B->left;

		p = B;
		A->right = bl;
		B->left = A;

		//update heights
		updateHeight(A);
		updateHeight(B);
	}

	void rightLeftDouble(node*& p)
	{
		rightRotation(p->right);
		leftRotation(p);
	}

	void leftRightDouble(node*& p)
	{
		leftRotation(p->left);
		rightRotation(p);
	}

	//Yuh yoh, p's balance is super SUS
	//Check for AVL balance, and perform appropriate rotation
	//to fix.
	void fixBalance(node*& p)
	{
		if (height(p->left) > height(p->right) + 1)
		{
			if (height(p->left->left) > height(p->left->right))
				rightRotation(p);
			else
				leftRightDouble(p);
		}
		else if (height(p->right) > height(p->left) + 1)
		{
			if (height(p->right->right) > height(p->right->left))
				leftRotation(p);
			else
				rightLeftDouble(p);
		}
		else
		{
			//p is balanced after all!
		}
	}

	//insert x into tree rooted at node p
	void insert(node*& p, double x)
	{
		if (p == nullptr) //base case
		{
			p = new node(x);
		}
		else //recursive case
		{
			if (x < p->data)
				insert(p->left, x);
			else
				insert(p->right, x);

			//p's height is SUS
			updateHeight(p);

			//p's balance is SUS
			fixBalance(p);
		}
	}

	//print all items in tree rooted at node p
	void display(node* p)
	{
		if (p == nullptr)  //base case
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


public:
	AVL()
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

};