#pragma once
#include <iostream>
using namespace std;

class pacGame
{
private:
	//static 2D array (to start off)
	int rows;
	int columns;
	//char grid[4][6];

	//dynamic 2D array
	char** grid;


	//pac person's character
	char pacChar;

	int pX;
	int pY;

	void moveTo(int x, int y)
	{
		grid[pX][pY] = ' ';
		pX = x;
		pY = y;
		grid[pX][pY] = pacChar;
	}

public:
	pacGame(int r, int c)
	{
		rows = r; // 4;
		columns = c; // 6;

		//dynamically create a r x c 2D array
		//step 1:  create backbone (size of rows)
		grid = new char* [r];

		//step 2:  create rows
		for(int i=0; i<r; i++)
			grid[i] = new char[c];

		//put pacPerson in middles
		pX = rows / 2;
		pY = columns/2;

		pacChar = '<';

		//initialize the grid
		for (int i = 0; i < rows; i++)
			for (int j = 0; j < columns; j++)
				grid[i][j] = '.';

		grid[pX][pY] = pacChar;
	}

	void display()
	{
		for (int i = 0; i < rows; i++)
		{
			for (int j = 0; j < columns; j++)
			{
				cout << grid[i][j] << " ";
			}
			cout << endl;
		}
	}

	void move(char dir)
	{
		if (dir == 'u')
		{
			pacChar = 'v';
			moveTo(pX-1, pY);
		}
		if (dir == 'd')
		{
			pacChar = '^';
			moveTo(pX + 1, pY);
		}
		if (dir == 'l')
		{
			pacChar = '>';
			moveTo(pX, pY - 1);
		}
		if (dir == 'r')
		{
			pacChar = '<';
			moveTo(pX, pY + 1);
		}
	}
};