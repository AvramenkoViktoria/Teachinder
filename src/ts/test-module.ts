export default {
    hello: 'world',
    userList: uniteTwoDataLists(),
};

import {randomUserMock, additionalUsers} from './FE4U-Lab2-mock.js';
import {User} from './user-interfaces.js';

function formatTeachersData() {
    const outputUsers = randomUserMock.map((user) => ({
        gender: user.gender,
        title: user.name.title,
        full_name: user.name.first + ' ' + user.name.last,
        city: user.location.city,
        state: user.location.state,
        country: user.location.country,
        postcode: user.location.postcode,
        coordinates: user.location.coordinates,
        timezone: user.location.timezone,
        email: user.email,
        b_date: user.dob.date,
        age: user.dob.age,
        phone: user.phone,
        picture_large: '/images/Segin.png',
        picture_thumbnail: user.picture.thumbnail,
    }));
    return outputUsers;
}

export function createRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function signRandomCourse() {
    const courses = [
        'Mathematics',
        'Physics',
        'English',
        'Computer Science',
        'Dancing',
        'Chess',
        'Biology',
        'Chemistry',
        'Law',
        'Art',
        'Medicine',
        'Statistics',
    ];

    const randomIndex = Math.floor(Math.random() * courses.length);
    return courses[randomIndex];
}

export function uniteTwoDataLists(): User[] {
    const formattedUsers: User[] = formatTeachersData() as User[];

    const unitedUsers: User[] = formattedUsers.map((user) => {
        const matchingUser = additionalUsers.find(
            (addUser) => addUser.full_name === user.full_name,
        );

        let additionalFields: Partial<User>;

        if (matchingUser) {
            additionalFields = {
                id: matchingUser.id ?? null,
                favorite: matchingUser.favorite ?? false,
                course: matchingUser.course ?? signRandomCourse(),
                bg_color: matchingUser.bg_color ?? createRandomColor(),
                note: matchingUser.note ?? null,
            };
        } else {
            additionalFields = {
                id: null,
                favorite: false,
                course: signRandomCourse(),
                bg_color: createRandomColor(),
                note: null,
            };
        }

        return {
            ...user,
            ...additionalFields,
        };
    });

    return unitedUsers;
}

function validatePhoneNumber(phoneNumber: string, country: string): boolean {
    const regexes: {[key: string]: RegExp} = {
        Germany: /^\+49\d{10,11}$/,
        Ireland: /^\+353\d{7,10}$/,
        Australia: /^\+61\d{9,10}$/,
        'United States': /^\+1\d{10}$/,
        Finland: /^\+358\d{6,10}$/,
        Turkey: /^\+90\d{10}$/,
        Switzerland: /^\+41\d{9}$/,
        'New Zealand': /^\+64\d{8,10}$/,
        Spain: /^\+34\d{9}$/,
        Norway: /^\+47\d{8}$/,
        Denmark: /^\+45\d{8}$/,
        Iran: /^\+98\d{11}$/,
        Canada: /^\+1\d{10}$/,
        France: /^\+33\d{10}$/,
        Netherlands: /^\+31\d{10}$/,
    };

    const regex = regexes[country];
    if (regex) {
        return regex.test(phoneNumber);
    } else {
        console.error(`No regex defined for country: ${country}`);
        return false;
    }
}

function validEmailFormat(input: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+$/;
    return regex.test(input);
}

function validateProfiles(users: User[]): User[] {
    const wrongProfiles: User[] = [];
    const correctProfiles: User[] = [];

    users.forEach((user) => {
        const fieldsToCheck = [
            user.full_name,
            user.gender,
            user.note,
            user.state,
            user.city,
            user.country,
        ];

        const isInvalidField = fieldsToCheck.some((field) => {
            if (
                typeof field !== 'string' ||
                !(field.charAt(0) === field.charAt(0).toUpperCase())
            ) {
                wrongProfiles.push(user);
                return;
            }
        });

        if (isInvalidField) {
            wrongProfiles.push(user);
            return;
        }

        if (typeof user.age !== 'number') {
            wrongProfiles.push(user);
            return;
        }

        if (!validatePhoneNumber(user.phone, user.country)) {
            wrongProfiles.push(user);
            return;
        }

        if (!validEmailFormat(user.email)) {
            wrongProfiles.push(user);
            return;
        }

        correctProfiles.push(user);
    });

    console.log(wrongProfiles);

    return correctProfiles;
}

// validateProfiles(uniteTwoDataLists());

function parseAgeFilter(ageFilter: string): (age: number) => boolean {
    const rangeRegex =
        /^(>|>=|<|<=)?\s*(\d+)\s*(and)?\s*(>|>=|<|<=)?\s*(\d+)?$/;
    const match = ageFilter.match(rangeRegex);

    if (!match) {
        throw new Error(`Invalid age filter format: ${ageFilter}`);
    }

    const [_, operator1, num1, conjunction, operator2, num2] = match;

    const lowerBoundCheck = (age: number) => {
        if (!operator1) return true;
        const lowerBound = parseInt(num1, 10);
        switch (operator1) {
            case '>':
                return age > lowerBound;
            case '>=':
                return age >= lowerBound;
            case '<':
                return age < lowerBound;
            case '<=':
                return age <= lowerBound;
            default:
                return true;
        }
    };

    const upperBoundCheck = (age: number) => {
        if (!operator2 || !num2) return true;
        const upperBound = parseInt(num2, 10);
        switch (operator2) {
            case '>':
                return age > upperBound;
            case '>=':
                return age >= upperBound;
            case '<':
                return age < upperBound;
            case '<=':
                return age <= upperBound;
            default:
                return true;
        }
    };

    return (age: number) => lowerBoundCheck(age) && upperBoundCheck(age);
}

// const ageFilterFunc = parseAgeFilter('>20 <30');
// console.log(ageFilterFunc(25));

interface filterFields {
    age?: string;
    country?: string;
    gender?: string;
    favorite?: string;
}

function filterUsers(users: User[], filters: filterFields): User[] {
    return users.filter((user) => {
        return Object.entries(filters).every(([key, filterValue]) => {
            if (filterValue === undefined || filterValue === null) return true;

            if (key === 'age' && typeof filterValue === 'string') {
                try {
                    const ageFilterFunc = parseAgeFilter(filterValue);
                    return ageFilterFunc(user.age);
                } catch (error) {
                    console.error(error);
                    return false;
                }
            }

            const userValue = user[key as keyof User];
            return userValue === filterValue;
        });
    });
}

// const filters = {
//     age: '>10 <80',
//     country: 'Germany',
// };
// console.log(filterUsers(uniteTwoDataLists(), filters));

function sortUsers(users: User[], param: string, ascending: boolean): User[] {
    return users.sort((a, b) => {
        let fieldA = a[param];
        let fieldB = b[param];

        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
            if (param === 'b_date') {
                const dateA = new Date(fieldA);
                const dateB = new Date(fieldB);

                if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                    console.error(
                        `Invalid date format: ${fieldA} or ${fieldB}`,
                    );
                    return 0;
                }

                return ascending
                    ? dateB.getTime() - dateA.getTime()
                    : dateA.getTime() - dateB.getTime();
            }

            return ascending
                ? fieldA.localeCompare(fieldB)
                : fieldB.localeCompare(fieldA);
        }

        return ascending
            ? fieldA > fieldB
                ? 1
                : -1
            : fieldA < fieldB
            ? 1
            : -1;
    });
}

// const sortedUsers = sortUsers(uniteTwoDataLists(), 'b_date', true);
// console.log(sortedUsers);

// const sortedUsers = sortUsers(uniteTwoDataLists(), 'age', false);
// console.log(sortedUsers);

// const sortedUsers = sortUsers(uniteTwoDataLists(), 'b_day', true);
// console.log(sortedUsers);

function findUsers(users: User[], param: string | number): User[] {
    return users.filter((user) => {
        if (
            typeof param == 'string' &&
            (param.startsWith('>') || param.startsWith('<'))
        ) {
            try {
                const ageFilterFunc = parseAgeFilter(param);
                return ageFilterFunc(user.age);
            } catch (error) {
                console.error(error);
                throw error;
            }
        } else {
            return Object.values(user).some((value) => value === param);
        }
    });
}

// const teachers: User[] = findUsers(uniteTwoDataLists(), 'Iran');
// console.log(teachers);

// const foundUsers = findUsers(uniteTwoDataLists(), '>64 <66');
// console.log(foundUsers);

// const foundUsers = findUsers(uniteTwoDataLists(), '><64 <66');
// console.log(foundUsers);

function calculatePercentage(users: User[], foundUsers: User[]) {
    return (foundUsers.length / users.length) * 100;
}
