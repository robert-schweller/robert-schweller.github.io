#pragma once

#include<iostream>
#include<string>
#include<vector>
#include<unordered_map>
using namespace std;

class directedGraph
{
private:
	class vertex
	{
	public:
		string data;
		vector<vertex*> neighbors;

		vertex(string x)
		{
			data = x;
		}
	};

	//need a data structor to store all vertices
	unordered_map<string, vertex*> vertexMap;

public:

	void addVertex(string x)
	{
		//run time: a.c O(1)
		vertexMap[x] = new vertex(x);
	}

	void addDirectedEdge(string x, string y)
	{

	}
};