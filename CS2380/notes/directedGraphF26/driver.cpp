
#include <iostream>
#include <string>
#include "directedGraph.h"
using namespace std;

int main()
{
	directedGraph G;

	G.addVertex("D");
	G.addVertex("E");
	G.addVertex("F");
	G.addVertex("G");
	G.addVertex("A");
	G.addVertex("B");
	G.addVertex("C");


	G.addBasicEdge("A", "B");
	G.addBasicEdge("A", "C");
	G.addBasicEdge("A", "D");
	G.addBasicEdge("B", "E");
	G.addBasicEdge("C", "D");
	G.addBasicEdge("D", "F");
	G.addBasicEdge("E", "F");
	G.addBasicEdge("E", "G");
	G.addBasicEdge("F", "G");
	

	G.testDisplay();

	return 0;
}
