
#include <iostream>
#include <string>
#include "minHeap.h"
using namespace std;

int main()
{
	minHeap H;

	H.insert(52);
	H.insert(12);
	H.insert(30);
	H.insert(5);
	H.insert(14);
	H.insert(28);
	H.insert(4);
	H.insert(2);
	H.insert(1);

	H.testDisplay();
}