#pragma once

#include<iostream>
#include<string>
#include<vector>
#include<map>
#include<queue>
#include<unordered_set>
using namespace std;

class directedGraph
{
private:
	class vertex
	{
	public:
		string data;
		vector<vertex*> neighbors;

		//maybe some variables for the BFS algorithm
		//such as, bool marked, vertex * breadcrumb;

		vertex(string x)
		{
			data = x;
		}
	};

	//Use a balanced binarySearch Tree: the map from STL
	map<string,vertex*> vertexMap;


public:
	//add given vertex item to graph
	void addVertex(string s)
	{
		vertex * babyVertex = new vertex(s);
		vertexMap[s] = babyVertex; //O(log n), inserting (s,babyVertex) in the bst
	}

	//add an edge going from a to b
	void addDirectedEdge(string a, string b)
	{
		vertex* aptr = vertexMap[a]; //O(log n) bst search
		vertex* bptr = vertexMap[b]; //O(log n) bst search

		aptr->neighbors.push_back(bptr);
	}

	void addBasicEdge(string a, string b)
	{
		addDirectedEdge(a, b);
		addDirectedEdge(b, a);
	}

	void testDisplay()
	{
		for (auto x : vertexMap)
		{
			cout << x.first << ": ";
			for (auto y : x.second->neighbors)
				cout << y->data << ", ";
			cout << endl;
		}
	}
};
