
#include <iostream>
#include <string>
#include <random>
using namespace std;


random_device rd;  // a seed source for the random number engine
mt19937 gen(rd()); // mersenne_twister_engine seeded with rd()


//throw one random dart.
//return true if inside of circle,
//false if outside.
bool throwOneDart()
{
	uniform_real_distribution<double> distrib(-1, 1);

	//randomnly throw the dart
	double dartX = distrib(gen);
	double dartY = distrib(gen);

	double distance = dartX * dartX + dartY * dartY;

	if (distance < 1)
	{
		return true;
	}
	else
	{
		return false;
	}
}

//Throw 'throws' random darts at radius 1 board
//count hits and return that count.
int throwDarts(int throws)
{
	int hits=0;

	for (int i = 0; i < throws; i++)
	{
		if (throwOneDart())
		{
			hits++;
		}
	}

	return hits;
}

double computePI(int hits, int throws)
{
	double PIest;
	PIest = 4 * (double) hits / throws;

	return PIest;
}

void reportResults(double PI)
{
	cout << "Here is your estimate of PI: " << PI << endl;

	//Now tell user how great (or bad) they did.
	if (PI > 3.2)
	{
		cout << "Whoa!!!! WAY too high!" << endl;
	}
	else if (PI < 3)
	{
		cout << "THAT IS WAY TO LOW!!!! Nice try..." << endl;
	}
	else
	{
		cout << "Wow, that's pretty darn tootin' close..." << endl;
	}
}


int main()
{
	//step 0: declare some variables
	int numThrows;
	int numHits;
	double piEst;

	while (true)
	{
		//step 1: ask user how many throws?
		cout << "Enter number of throws: " << endl;
		cin >> numThrows;

		//step 2: throw that many darts, log total hits
		numHits = throwDarts(numThrows);

		//step 3: compute PI from hits/throws
		piEst = computePI(numHits, numThrows);

		//step 4: report results to user
		reportResults(piEst);
	}


	return 0;
}

