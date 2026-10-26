#pragma once

#include<iostream>
#include<string>
#include<vector>
#include<unordered_map>
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

		vertex(string x)
		{
			data = x;
		}
	};

	//need a data structor to store all vertices
	unordered_map<string, vertex*> vertexMap;

	void breadthFirstSearch(vertex* s, unordered_map<vertex*, vertex*> &bc)
	{
		//set up:
		unordered_set<vertex*> marked;
		queue<vertex*> Q;

		//step 0:
		marked.insert(s);
		Q.push(s);

		//step 1:
		while (!Q.empty())
		{
			//step 1.1
			vertex* x = Q.front();
			Q.pop();

			//step 1.2
			for (auto y : x->neighbors)
			{
				if (marked.find(y) == marked.end())
				{
					marked.insert(y);
					Q.push(y);

					//augment
					bc[y] = x;
				}
			}
		}
	}

public:

	void addVertex(string x)
	{
		//run time: a.c O(1)
		vertexMap[x] = new vertex(x);
	}

	//a.c. O(1)
	void addDirectedEdge(string x, string y)
	{
		vertex* xVert = vertexMap.at(x);  //a.c. O(1), w.c. O(n)
		vertex* yVert = vertexMap.at(y);

		xVert->neighbors.push_back(yVert); //a.c. O(1)
	}

	void addBasicEdge(string x, string y)
	{
		addDirectedEdge(x, y);
		addDirectedEdge(y, x);
	}

	string shortestPath(string start, string dest)
	{
		//step up:
		vertex* s = vertexMap.at(start);
		vertex* d = vertexMap.at(dest);

		//step 1: Run BFS on s to compute breadCrumbs
		unordered_map<vertex*, vertex*> breadCrumbs;
		breadthFirstSearch(s,breadCrumbs);


		//step 2: follow breadcrumb trail from d to s
		string path;
		vertex* current = d;
		while (current != s)
		{
			path = current->data + ", " + path;
			current = breadCrumbs.at(current);
		}
		path = s->data + ", " + path;

		return path;
	}

};