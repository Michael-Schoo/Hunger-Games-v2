import { range, chooseAge } from "./utils.js";
// import { faker } from "@faker-js/faker";
import {
    INITIAL_PEOPLE_PER_DISTRICT,
    MAX_FIGHT_AGE,
    MIN_FIGHT_AGE,
    MIN_MARRIAGE_AGE,
    YEARS_TO_SIMULATE,
    mapConfig,
    map as mapStr,
    CHOOSE_PEOPLE_RANDOMLY, RANDOM_PEOPLE_CHOSEN, RANDOM_PEOPLE_GENDER_SPLIT
} from "./constants.js";
import { Family } from "./family.js";
import Person from "./people.js";
import District, { CensusProp, districts } from "./districts.js";
import { Sex, Learboard } from "./types.js";
import { ExportedData } from "./export.js";
import { GameMap } from "./map/map.js";
import assert from "assert/strict";


export default class Game {
    readonly districts: District[]
    readonly families: Family[] = []
    readonly learboards: Learboard[] = []
    year = 1;

    constructor() {
        this.districts = districts.map(d => new District({ type: d, game: this }));

        for (const district of this.districts) {
            this.generateInitialPeople(district);
            // this.makeNewFamilies(district);
        }

        // this.makeNewChildren();

    }

    start() {
        console.time("Running game")
        while (this.year <= YEARS_TO_SIMULATE) {
            this.newYear()
        }
        console.timeEnd("Running game")

        console.log("Game over!!")
    }

    newYear() {
        // console.info(`Year ${this.year}`)

        const censusStats: Record<string, CensusProp> = {};

        //? Pre hunger games (district stuff for the whole "year")
        for (const district of this.districts) {

            // add age
            for (const person of district.people) {
                if (!person.alive) continue
                person.age += 1;
            }

            // make new families + children + kill people
            this.makeNewFamilies(district);
            this.makeNewChildren();
            this.killPeople();
        }

        // get some players from each district (some male and female)
        const players: Person[] = []
        for (const district of this.districts) {
            players.push(...this.choosePlayers(district))
        }

        if (players.length) {
            //? Start hunger games
            console.time("game "+this.year)

            const map = new GameMap(players, this)
            map.start()

            console.timeEnd("game "+this.year)
            console.log()

        } else {
            console.log("No players that can play")
        }


        //? Save data
        for (const district of this.districts) {
            const deaths = district.people.filter(person => person.diedAt === this.year).length;
            const births = district.people.filter(person => person.age === 0).length;
            district.addCensus({ year: this.year, deaths, births, bestTurnAction: district.currentTurnActionWeightings! });
        }

        this.year += 1;
    }

    get people() {
        return this.districts.flatMap(d => d.people);
    }

    private generateInitialPeople(district: District) {
        for (const num of range(INITIAL_PEOPLE_PER_DISTRICT)) {
            const sex = (num % 2) ? "male" : "female";
            // const name = faker.person.fullName({ sex })
            const name = 'a'
            const age = chooseAge(num);

            const person = new Person({ district, name, sex, age, game: this })
            district.addPerson(person)

        }
    }

    private allowMarriage(male: Person, female: Person): boolean {
        // higher chance when there is fewer families
        // also higher chance when there are more people in the district
        assert.equal(male.district.type, female.district.type, "People must be in the same district")
        assert.equal(male.sex, "male", "Parents must be correct sex")
        assert.equal(female.sex, "female", "Parents must be correct sex")

        if (male.family?.parentMale === male) return false
        if (female.family?.parentFemale === male) return false

        if (male.age < MIN_MARRIAGE_AGE || female.age < MIN_MARRIAGE_AGE) {
            // parents must be over 18
            console.log('too young')
            return false;
        }

        const district = male.district;
        const numFamilies = this.families.length;
        const numPeople = district.people.length;

        const probability = 1 / (numFamilies + numPeople);

        return Math.random() < probability;
    }


    private choosePlayers(district: District) {
        // // make a tuple randomly for one male + one female
        // const males = district.people
        //     .filter((p) => p.sex === "male")
        //     .filter((p) => p.age > MIN_FIGHT_AGE)
        //     .filter((p) => p.age < MAX_FIGHT_AGE)
        //     .filter((p) => p.alive)
        //     .sort(() => Math.random() - 0.5);
        //
        // const females = district.people
        //     .filter((p) => p.sex === "female")
        //     .filter((p) => p.age > MIN_FIGHT_AGE)
        //     .filter((p) => p.age < MAX_FIGHT_AGE)
        //     .filter((p) => p.alive)
        //     .sort(() => Math.random() - 0.5);
        //
        // const chosenMale = males[0]
        // const chosenFemale = females[1]
        //
        // return [chosenMale, chosenFemale]

        if (CHOOSE_PEOPLE_RANDOMLY !== true) {
            throw new Error("Not implemented")
        }

        const availablePeople = district.people
            .filter((p) => p.age > MIN_FIGHT_AGE)
            .filter((p) => p.age < MAX_FIGHT_AGE)
            .filter((p) => p.alive)
            .sort(() => Math.random() - 0.5);


        const chosen: Person[] = []

        for (const i of range(RANDOM_PEOPLE_CHOSEN)) {
            const  amountOfMales = chosen.filter(e=> e?.sex === 'male').length
            const  amountOfFemales = chosen.filter(e=> e?.sex === 'female').length

            if (Math.abs(amountOfMales / amountOfFemales) < RANDOM_PEOPLE_GENDER_SPLIT) {
                if (amountOfMales > amountOfFemales) {
                    chosen.push(availablePeople.filter(e => e.sex === 'female').pop()!)
                } else {
                    chosen.push(availablePeople.filter(e => e.sex === 'male').pop()!)
                }
            }
            chosen.push(availablePeople.pop()!);

        }

        return chosen
    }
    private makeNewFamilies(district: District) {
        // make tuples randomly for males + females and see if they should get married
        // const data: [Person, Person][] = [];
        // new Crypto().
        const males = district.people.filter((p) => p.sex === "male")
            .filter((p) => p.age > MIN_MARRIAGE_AGE)
            .filter((p) => p.family === undefined)
            .filter((p) => p.alive)
            .sort(() => Math.random() - 0.5);
        // const sortedMales = randomSort(males)

        const females = district.people.filter((p) => p.sex === "female")
            .filter((p) => p.age > MIN_MARRIAGE_AGE)
            .filter((p) => p.family === undefined)
            .filter((p) => p.alive)
            .sort(() => Math.random() - 0.5);
        // const sortedFemales = randomSort(females)

        // use shuffled arrays to make tuples
        const amount = Math.min(males.length, females.length);
        for (const num of range(amount)) {
            const male = males[num];
            const female = females[num];

            const allowed = this.allowMarriage(male, female);
            if (allowed) {
                const family = new Family(male, female)
                this.families.push(family);
            } else {
                continue
            }
        }

    }

    private makeNewChildren() {
        let created = 0

        const families = this.families.filter(family => family.shouldHaveChild() === 1);

        for (const family of families) {
            // const sex = faker.person.sex() as Sex;
            const sex = Math.random() > 0.5 ? "male" : "female";
            // const name = faker.person.fullName({ sex, lastName: family.familyName })
            const name = 'uhh'

            const child = new Person({ district: family.district, name, sex, age: 0, game: this })
            family.addChild(child);
            created++
        }

        return created
    }

    private killPeople() {
        // kill only a few people
        // choose a random person to kill

        // const probability = 1 / this.districts.length;
        for (const district of this.districts) {
            const people = district.people.filter(person => person.alive);

            // TODO: use nutriment to determine amount + family benefits
            // TODO: older they are, higher chance of dying
            const amountToKill = Math.floor(Math.random() * people.length / 250);
            for (const num of range(amountToKill)) {
                const randomPerson = people[Math.floor(Math.random() * people.length)];
                if (randomPerson.alive) randomPerson.kill(this.year);
            }
        }
    }


    export(): ExportedData {
        const data: ExportedData = {
            people: [],
            districtCensus: {},
            leaderboard: this.learboards,
            families: {}
        };

        for (const district of this.districts) {
            data.districtCensus[district.type] = district.census;
            data.people.push(...district.people.map(person => person.export()));
            data.families[district.type] = [];
            data.families[district.type].push(...this.families.map(family => family.export()));
        }

        return data;

    }

}