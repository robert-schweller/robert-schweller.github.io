
#include <iostream>
#include <string>
using namespace std;

class student
{
	//private stuff cannot be accessed outside of class
private:
	int exam1;
	int exam2;
	int exam3;

	//public stuff can be accesssed (viewed or changed) from anywhere
public:
	string name;
	int id;
	double gpa;



	//A constructor: a special method with same name as class
	//Is called when you create a new variable
	student()
	{
		cout << "Calling the boring default constructor" << endl;
		name = "Nobody";
		id = 0;
		gpa = 1.0;
		exam1 = 0;
	}

	//a parameterized constructor
	student(string n, int x1, int x2, int x3)
	{
		cout << "Hey, we're calling the paremeterized constructor!" << endl;
		name = n;
		exam1 = x1;
		exam2 = x2;
		exam3 = x3;
	}


	//A method
	void sayHi()
	{
		cout << "Hi! " << " My name is " << name << ", my id is " << id << " my class average is " << computeAvg() << endl;
	}

	//Set given exam to given score.
	//Make sure they don't give a ridiculous value!
	void setExam(int examNum, int score)
	{
		if (score < 0 || score > 100)
		{
			cout << "Stop trying to cheat!" << endl;
		}
		else
		{
			if (examNum == 1)
				exam1 = score;
			if (examNum == 2)
				exam2 = score;
			if (examNum == 3)
				exam3 = score;
		}
	}

	//return average of 3 exam scores
	double computeAvg()
	{
		double average;
		average = (exam1 + exam2 + exam3) / 3.0;
		return average;
	}


	void extraCredit(int examNum, int extraPoints)
	{
		if (examNum == 1)
			exam1 = exam1 + extraPoints;
		if (examNum == 2)
			exam2 += extraPoints;
		if (examNum == 3)
			exam3 += extraPoints;
	}

	void cheatOff(student &victim)
	{
		if ( (rand() % 100) < 25 )
		{
			cout << name << " got away with cheating off of " << victim.name << endl;
			exam1 = victim.exam1;
			exam2 = victim.exam2;
			exam3 = victim.exam3;
		}
		else
		{
			cout << name << " was CAUGHT! cheating off of " << victim.name << endl;
			exam1 = 0;
			exam2 = 0;
			exam3 = 0;

			victim.exam1 = victim.exam1 / 2;
			victim.exam2 = victim.exam2 / 2;
			victim.exam3 = victim.exam3 / 2;
		}
	}
};

int main()
{
	student rene;
	student nick;
	student oscar;
	student eli;
	student christian("Christian", 80, 43, 96);

	rene.name = "Rene";
	nick.name = "Nick";
	oscar.name = "Oscar";

	rene.id = 123;
	nick.id = 405;

	//Can't access private exam1
	//rene.exam1 = -99999;

	rene.setExam(1,74);
	rene.setExam(2, 85);
	rene.setExam(3, 98);

	//ridiculous stuff we want to prevent
	nick.setExam(1, -9999);
	oscar.setExam(1, 2000);

	//cout << rene.name << ", " << rene.exam1 << endl;


	//Let's give some extra credit
	nick.extraCredit(1,25);
	oscar.extraCredit(3, 5);
	eli.extraCredit(2, 15);
	rene.extraCredit(1, 10);
	rene.extraCredit(3, 15);


	//a method that displays some information
	rene.sayHi();
	nick.sayHi();
	oscar.sayHi();
	eli.sayHi();
	christian.sayHi();

	//Uh oh... we've got some cheaters...
	nick.cheatOff(rene);
	christian.cheatOff(nick);

	//a method that displays some information
	rene.sayHi();
	nick.sayHi();
	oscar.sayHi();
	eli.sayHi();
	christian.sayHi();


	return 0;
}


