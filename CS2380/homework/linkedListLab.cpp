

#include <iostream>
#include <string>
#include <algorithm>
#include "linkedList.h" //create and add this file to your project.
using namespace std;


int main()
{
	//part 0:  Implement adding items to the front and displaying the list
	linkedList list1;

	list1.addFront("pichacu");
	list1.addFront("elmo");
	list1.addFront("charmander");
	list1.addFront("ekans");

	list1.display(); //ekans charmander elmo pichacu


	//part 0.1:  Implement removal from front
	list1.removeFront();
	list1.removeFront();

	list1.addFront("snorlax");

	list1.display(); //snorlax elmo pichacu


	//part 1:  implement "addBack"
	linkedList list2;
	list2.addBack("rattata");
	list2.addBack("raticate");
	list2.addBack("arcanine");
	list2.addFront("arbok");
	list2.addFront("eevee");

	list2.display(); //eevee arbok rattata raticate arcanine


	//part 2: implement "remove"
	list2.remove("arcanine");
	list2.remove("rattata");
	list2.remove("eevee");

	list2.addFront("dugtrio");
	list2.addBack("charizard");

	list2.display(); //dugtrio arbok raticate charizard

	//part 3: implement "sort"
	list1.sort();
	list2.sort();

	list1.display(); //elmo pichacu snorlax
	list2.display(); //arbok charizard dugtrio raticate

	return 0;
}