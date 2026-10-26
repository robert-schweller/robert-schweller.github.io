#pragma once
#include <vector>
using namespace std;

class minHeap
{
private:
	vector<double> items;

	int parent(int i)
	{
		return (i - 1) / 2;
	}

	//bubble index item up heap
	//until no more parent violation exists
	void bubbleUp(int index)
	{
		int i = index;
		while (items[i] < items[parent(i)]) //i in violation with parent
		{
			swap(items[i], items[parent(i)]);
			i = parent(i);
		}
	}
public:
	void insert(double x)
	{
		//Add item at bottom-right of tree
		items.push_back(x);

		//bubble last item up heap (until no more violation)
		bubbleUp(items.size() - 1);
	}

	void testDisplay()
	{
		for (int i = 0; i < items.size(); i++)
		{
			cout << "Index " << i << ": " << items[i] << endl;
		}
	}
};