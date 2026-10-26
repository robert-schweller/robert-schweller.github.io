#include <iostream>
#include <string>
#include "pacGame.h"
using namespace std;

int main()
{
	pacGame game(20,40);

	while (true)
	{
		game.display();
		
		cout << "Enter direction (u,d,l,r):";
		char direction;
		cin >> direction;

		game.move(direction);
	}

	return 0;
}