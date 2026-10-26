
#include <iostream>
#include <string>
using namespace std;


//print n, n-1, ... BLASTOFF!!!
void countdown(int n)
{
	if (n==0) //base case
	{
		cout << "BLASTOFF!!!!" << endl;
	}
	else  //recursive case
	{
		cout << n << endl;
		countdown(n - 1);
	}
}

int factorial(int n)
{
	if (n==1) //base case
	{
		return 1;
	}
	else  //recursion
	{
		//fancy pants solution in one line
		return n * factorial(n - 1);

		//int subproblem = factorial(n - 1);
		//return n * subproblem;
	}
}

//return x^n
//Run time: O(n)
double pow(double x, int n)
{
	if (n==0)
	{
		return 1;
	}
	else
	{
		return x * pow(x, n - 1);
	}
}

//faster idea:
//break n by half each recursion
//run time: O(log n)
int fastPow(double x, int n)
{
	if (n==0)
	{
		return 1;
	}
	else
	{
		int halfpow = fastPow(x, n / 2);
		if (n % 2 == 0) //n is even
		{
			return halfpow * halfpow;
		}
		else //n is odd
		{
			return x * halfpow * halfpow;
		}
	}
}

void lineOfStars(int n)
{
	if (n==1)
	{
		cout << "*" << endl;
	}
	else
	{
		cout << "*";
		lineOfStars(n - 1);
	}
}

void starThing(int n)
{
	if (n==1)
	{
		cout << "*" << endl;
	}
	else
	{
		lineOfStars(n);
		starThing(n - 1);
		lineOfStars(n);
	}
}

int numOnes(int n)
{
	if (n==0) //base case
	{
		return 0;
	}
	else  //recursive case
	{
		return n % 2 + numOnes(n / 2);
	}
}

int fib(int n)
{
	if (n == 0) //base case: n<1
		return 0;
	else if (n == 1)
		return 1;
	else   //recursive case: n>1
	{
		int a = fib(n - 1);
		int b = fib(n - 2);
		return a + b;
	}
}

void hanoi(int n, string A, string B, string C)
{
	if (n==0)
	{
		//uh, do nothing
	}
	else
	{
		//step 1: get top n-1 discs from A to B
		hanoi(n - 1, A, C, B);

		//step 2: move top disc from A to C
		cout << "Move top disc from " << A << " to " << C << endl;

		//step 3: move top n-1 discs from B to C
		hanoi(n - 1, B, A, C);

	}
}

int main()
{
	countdown(10);
	cout << factorial(5) << endl;
	cout << pow(2, 5) << endl;
	cout << fastPow(2, 5) << endl;
	cout << pow(3, 8) << endl;
	cout << fastPow(3, 8) << endl;

	lineOfStars(10);
	lineOfStars(3);
	cout << endl;

	starThing(20);

	//Challenge #1:  return number of one's in binary expression of given integer
	cout << numOnes(25) << endl;
	cout << numOnes(43237) << endl;

	//Challenge #2: return nth Fibonacci number
	// 0 1 1 2 3 5 8 13 21
	//cout << fib(80) << endl;

	//Challenge #3: Hanoi tower problem.
	hanoi(63, "A", "B", "C");


	//Challenge #4: Print a linked list backwards

	return 0;
}