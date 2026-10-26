#pragma once
#include <iostream>
#include "stack.h"
using namespace std;

class calculator
{
private:
	double value;
	stack<double> history;

public:

	calculator()
	{
		value = 0;
	}

	double display()
	{
		return value;
	}

	void add(double x)
	{
		history.push(value);
		value = value + x;
	}

	void multiply(double x)
	{
		history.push(value);
		value = value * x;
	}

	void undo()
	{
		value = history.pop();
	}
};