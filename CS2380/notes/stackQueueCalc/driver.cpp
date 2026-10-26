
#include <iostream>
#include <string>
#include "stack.h"
#include "queue.h"
#include "calculator.h"
using namespace std;



int main()
{
	//Put stack class in separate header file
	stack<string> S;

	S.push("pineapple");
	S.push("coconut");
	S.push("wheat");

	cout << S.pop() << endl; //wheat
	cout << S.pop() << endl; //coconut

	S.push("waffle");

	while( ! S.empty() )
		cout << S.pop() << endl;  //waffle, pineapple

	//Template class
	stack<double> X;

	//int huge = 1000;
	//for(int i = 0; i < huge; i++)
	//	X.push(i);




	//while( ! X.empty())
	//	cout << "Number stack popping: " << X.pop() << endl;


	//Queue, with circular array
	queue Q;

	Q.enqueue(5);
	Q.enqueue(10);
	Q.enqueue(15);
	Q.enqueue(20);

	cout << "Dequeing: " << Q.dequeue() << endl;
	cout << "Dequeing: " << Q.dequeue() << endl;

	Q.enqueue(25);
	Q.enqueue(30);
	Q.enqueue(35);
	Q.enqueue(40);
	Q.enqueue(45);
	Q.enqueue(50);


	while( ! Q.empty() )
		cout << "Dequeing: " << Q.dequeue() << endl;


	//Test the calculator that has a history stack for undo()
	calculator C;
	C.add(5);
	C.add(3.7);
	C.multiply(21);

	cout << "Calculator display: " << C.display() << endl;
	C.undo();
	cout << "Calculator display: " << C.display() << endl;
	C.undo();
	cout << "Calculator display: " << C.display() << endl;

	return 0;
}


