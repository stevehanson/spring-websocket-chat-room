package com.websock.service;

import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class RandomFactServiceImpl implements RandomFactService {

	private String[] randomFacts = new String[] {
			"Karoke means \"empty orchestra\" in Japanese.",
			"Adult elephants can't jump.",
			"Horses fall asleep while standing.",
			"Odontophobia is the fear of teeth.",
			"The amount of force used to bite into a carrot is the same amount of force to bite your pinkie off. :/",
			"When you get burned you should crack an egg and you won't get a scar.",
			"An inch (2.5 centimeters) of rain is equivalent to 15 inches (38.1 centimeters) of dry, powdery snow.",
			"The king of hearts is the only king without a moustache.",
			"It took Leo Tolstoy six years to write \"War & Peace\"",
			"The most common name in the world is Mohammed.",
			"Stressed is Desserts spelled backwards.",
			"The three most spoken english words are Hello, Stop and Taxi",
			"In ancient Rome, it was considered a sign of leadership to be born with a crooked nose.",
			"Hippophobia is the fear of horses",
			"Dueling is legal in Paraguay as long as both parties are registered blood donors.",
			"It is genetically impossible for a rose to come in color blue.",
			"On average, there are 178 sesame seeds on each McDonalds BigMac bun.",
			"garoos cant hop backwords",
			"The plastic things on the end of shoelaces are called aglets.",
			"The elephant is the only animal with 4 knees.",
			"The northern border of Delaware is curved, with all points being exactly 12 miles from the old court house in New Castle",
			"If you have 3 quarters, 4 dimes, and 4 pennies, you have $1.19. You also have the largest amount of money in coins without being able to make change for a dollar.",
			"A law from the early 1900's prohibits men from going topless on the Boardwalk.",
			"The opening ceremony for the 2012 Olympics had 965 drummers there.",
			"Your ribs move about 5 million times a year, everytime you breathe.",
			"In Japan, raw horse meet is served in restaurants and is called Sakura",
			"\"Almost\" is the longest commonly used word in the English language with all the letters in alphabetical order",
			"The dot on the top of the letter i is called a title",
			"Catfish are the only animals that naturally have an odd number of whiskers.",
			"\"Duff\" is the decaying organic matter found on the forest floor.",
			"Donald Duck's middle name is Fauntleroy.",
			"In ancient Greece the people believed that Gingerheads would turn into vampires after their death.",
			"The Ears of a cricket are located on the front legs, just below the knee.",
			"A cockroach will live nine days without it's head, before it starves to death.",
			"The fingerprints of koala bears are virtually indistinguishable from those of humans, so much so that they could be confused at a crime scene",
			"Snails can sleep for 3 years without eating",
			"The sentence \"The quick brown fox jumps over the lazy dog.\" uses every letter in the alphabet.",
			"No word in the English language rhymes with month, orange, silver, and purple",
			"Strawberries aren't actually berries, but bananas, avocados, pumpkins and watermelons are.",
			"One person in 20 is born with an extra rib.",
			"Nutmeg is extremely poisonous if injected intravenously."
			
	};
	
	@Override
	public String randomFact() {
		Random rand = new Random(); 
		int n = rand.nextInt(randomFacts.length); 
		return randomFacts[n];
	}
}
