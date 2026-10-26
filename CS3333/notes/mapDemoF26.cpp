
#include<iostream>
#include<string>
#include<unordered_map>
#include<map>
using namespace std;


void showStats(unordered_map<string, double>& M)
{
	cout << endl;
	cout << "n (num items): " << M.size() << endl;
	cout << "H (bucket count): " << M.bucket_count() << endl;
	cout << "load factor (n/H): " << M.load_factor() << endl;
	cout << "max load factor before resizeing: " << M.max_load_factor() << endl;
	cout << endl;
}

int main()
{
	//hash table, stores key-value pairs
	unordered_map<string, double> M;

	pair<string, double> p1;
	p1.first = "viviana";
	p1.second = 3.9;

	//hash "viviana" to store p1 in the table
	M.insert(p1);

	//can also insert with []
	//table now has pair ("george",4.0) in it
	M["george"] = 4.0;
	M["rob"] = 5.0;
	M["will"] = 2.7;
	M["santiago"] = 0.5;
	M["sean"] = 0.1;

	//find items in table by key value
	cout << "will's gpa is: " << M.at("will") << endl;


	//loop through hash table items
	for (auto x : M)
	{
		cout << x.first << " : " << x.second << " : (bucket) " << M.bucket(x.first) << endl;
	}

	showStats(M);

	return 0;
}