export default {
    hello: 'world',
    userList: uniteTwoDataLists(),
    filterUsers: filterUsers,
    sortUsers: sortUsers,
    findUsers: findUsers,
    validatePhoneNumber: validatePhoneNumber,
    validateEmail: validEmailFormat,
    validateColor: validateColorFormat,
    getFirstWord: getFirstWord,
    calculateAge: calculateAge,
};
import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock.js';
const countriesByRegion = {
    africa: [],
    asia: ['Iran'],
    'central america': [],
    europe: [
        'Germany',
        'Ireland',
        'Finland',
        'Turkey',
        'Switzerland',
        'Spain',
        'Norway',
        'Denmark',
        'France',
        'Netherlands',
    ],
    'middle east': [],
    'north america': ['United States', 'Canada'],
    'south america': [],
    australia: ['Australia'],
};
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
        picture_large: setRandomPic(),
        picture_thumbnail: user.picture.thumbnail,
    }));
    return outputUsers;
}
function setRandomPic() {
    const isPic = Math.random() < 0.5;
    return isPic ? '/images/Segin.png' : '';
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
export function uniteTwoDataLists() {
    const formattedUsers = formatTeachersData();
    const unitedUsers = formattedUsers.map((user) => {
        const matchingUser = additionalUsers.find((addUser) => addUser.full_name === user.full_name);
        let additionalFields;
        if (matchingUser) {
            additionalFields = {
                id: matchingUser.id ?? null,
                favorite: matchingUser.favorite ?? false,
                course: matchingUser.course ?? signRandomCourse(),
                bg_color: matchingUser.bg_color ?? createRandomColor(),
                note: matchingUser.note ?? null,
            };
        }
        else {
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
export function validatePhoneNumber(phoneNumber, country) {
    const regexes = {
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
    }
    else {
        console.error(`No regex defined for country: ${country}`);
        return false;
    }
}
export function validEmailFormat(input) {
    const regex = /^[^\s@]+@[^\s@]+$/;
    return regex.test(input);
}
export function validateColorFormat(color) {
    const regex = /^#[0-9A-F]{6}$/i;
    return regex.test(color);
}
export function getFirstWord(input) {
    const trimmedInput = input.trim();
    const words = trimmedInput.split(/\s+/);
    return words[0] || '';
}
function validateProfiles(users) {
    const wrongProfiles = [];
    const correctProfiles = [];
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
            if (typeof field !== 'string' ||
                !(field.charAt(0) === field.charAt(0).toUpperCase())) {
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
export function calculateAge(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    const dayDifference = today.getDate() - birth.getDate();
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }
    return age;
}
function parseAgeFilter(ageFilter) {
    const rangeRegex = /^(>|>=|<|<=)?\s*(\d+)\s*(and)?\s*(>|>=|<|<=)?\s*(\d+)?$/;
    const match = ageFilter.match(rangeRegex);
    if (!match) {
        throw new Error(`Invalid age filter format: ${ageFilter}`);
    }
    const [_, operator1, num1, conjunction, operator2, num2] = match;
    const lowerBoundCheck = (age) => {
        if (!operator1)
            return true;
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
    const upperBoundCheck = (age) => {
        if (!operator2 || !num2)
            return true;
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
    return (age) => lowerBoundCheck(age) && upperBoundCheck(age);
}
function isCountryInRegion(country, region) {
    country = country.toLowerCase();
    region = region.toLowerCase();
    const countries = countriesByRegion[region];
    return countries
        ? countries.map((c) => c.toLowerCase()).includes(country)
        : false;
}
export function filterUsers(users, filters) {
    console.log(users);
    return users.filter((user) => {
        return Object.entries(filters).every(([key, filterValue]) => {
            if (filterValue === undefined || filterValue === null)
                return true;
            if (key === 'age') {
                try {
                    const ageFilterFunc = parseAgeFilter(filterValue);
                    return ageFilterFunc(user.age);
                }
                catch (error) {
                    console.error(error);
                    return false;
                }
            }
            else if (key === 'region') {
                if (user.full_name === 'Nora Shevchenko') {
                    console.log('Nora is in US: ' +
                        isCountryInRegion(user.country, filterValue) +
                        ' / ' +
                        filterValue);
                }
                return isCountryInRegion(user.country, filterValue);
            }
            else if (key === 'photoRequired') {
                return filterValue == true ? user.picture_large !== '' : true;
            }
            else if (key === 'favorite') {
                return filterValue
                    ? user[key] === filterValue
                    : true;
            }
            const userValue = user[key];
            return userValue === filterValue;
        });
    });
}
export function sortUsers(users, param, ascending) {
    return users.sort((a, b) => {
        let fieldA = a[param];
        let fieldB = b[param];
        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
            if (param === 'b_date') {
                const dateA = new Date(fieldA);
                const dateB = new Date(fieldB);
                if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                    console.error(`Invalid date format: ${fieldA} or ${fieldB}`);
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
export function findUsers(users, param) {
    return users.filter((user) => {
        if (typeof param == 'string' &&
            (param.startsWith('>') || param.startsWith('<'))) {
            try {
                const ageFilterFunc = parseAgeFilter(param);
                return ageFilterFunc(user.age);
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        }
        else if (typeof param === 'string') {
            const searchFields = [
                'full_name',
                'course',
                'country',
                'gender',
                'note',
            ];
            return searchFields.some((field) => {
                const value = user[field];
                return (typeof value === 'string' &&
                    value.toLowerCase().includes(param.toLowerCase()));
            });
        }
        else {
            return Object.values(user).some((value) => value === param);
        }
    });
}
function calculatePercentage(users, foundUsers) {
    return (foundUsers.length / users.length) * 100;
}
//# sourceMappingURL=test-module.js.map