
#include <iostream>
#include <string>
#include "directedGraph.h"
using namespace std;

int main()
{
	directedGraph G;

	G.addVertex("A");
	G.addVertex("B");
	G.addVertex("C");
	G.addVertex("D");
	G.addVertex("E");
	G.addVertex("F");
	G.addVertex("G");

	G.addBasicEdge("A", "B");
	G.addBasicEdge("A", "C");
	G.addBasicEdge("A", "D");
	G.addBasicEdge("B", "E");
	G.addBasicEdge("C", "D");
	G.addBasicEdge("D", "F");
	G.addBasicEdge("E", "F");
	G.addBasicEdge("E", "G");
	G.addBasicEdge("F", "G");

	cout << "A to F: " << G.shortestPath("A", "F") << endl;
	cout << "B to D: " << G.shortestPath("B", "D") << endl;
	cout << "F to A: " << G.shortestPath("F", "A") << endl;
	cout << "A to G: " << G.shortestPath("A", "G") << endl;

	return 0;
}