#include <iostream>
#include <string>
#include "doublyLL.h"
using namespace std;



int main()
{
	doublyLL L;

	L.addBack(2);
	L.addBack(3);
	L.addFront(50);
	L.addFront(13);
	L.addBack(5);
	L.addFront(-50);
	L.addBack(7);
	L.addFront(500);
	L.addBack(11);

	L.remove(50);
	L.remove(11);
	L.remove(500);

	L.printForwards();
	cout << endl;
	L.printBackwards();

	return 0;
}