import testModules, {calculateAge, sortUsers} from './test-module.js';
import {User} from './user-interfaces.js';
import testModule, {filterFields} from './test-module.js';
import {getFirstWord} from './test-module.js';
import {users, sendUsersToServer, getUsersFromServer} from './http.js';

let firstUserInList = 0;
let lastDisplayOption = 'search'; // May be search or filter
let lastSearchInput = '';

export function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

export function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}

function createTeacherProfile(teacher: User, favProfile: boolean): HTMLElement {
    const teacherProfile = document.createElement('div');
    teacherProfile.classList.add('teacher-profile');

    if (teacher.favorite) teacherProfile.classList.add('fav');
    if (favProfile) teacherProfile.classList.add('favorite');

    const profilePicContainer = document.createElement('div');
    profilePicContainer.classList.add('profile-pic-container');

    profilePicContainer.style.border = `3px solid ${teacher.bg_color}`;

    const teacherPhoto = document.createElement('img');
    teacherPhoto.src = teacher.picture_large;
    if (teacher.picture_large === '' || teacher.picture_large === null) {
        const teacherLabel = createTeacherInitialsLabel(teacher.full_name);
        teacherLabel.style.color = teacher.bg_color;
        profilePicContainer.appendChild(teacherLabel);
    } else {
        teacherPhoto.classList.add('teacher-photo');
        teacherPhoto.alt = "Teacher's photo";
        profilePicContainer.appendChild(teacherPhoto);
    }

    const teacherNameLabel = document.createElement('label');
    teacherNameLabel.classList.add('teacher-name');
    teacherNameLabel.textContent = teacher.full_name;

    const subjectLabel = document.createElement('label');
    subjectLabel.classList.add('subject');
    subjectLabel.textContent = teacher.course;

    let countryLabel = null;
    if (!favProfile) {
        countryLabel = document.createElement('label');
        countryLabel.classList.add('country');
        countryLabel.textContent = teacher.country;
    }

    teacherProfile.appendChild(profilePicContainer);
    teacherProfile.appendChild(teacherNameLabel);
    teacherProfile.appendChild(subjectLabel);
    if (!favProfile) teacherProfile.appendChild(countryLabel);

    teacherProfile.addEventListener('click', () => {
        const teacher = findTeacherByProfile(
            teacherProfile as HTMLElement,
            favProfile,
        );
        if (teacher) {
            showInfoPopup(teacher);
        } else {
            console.error('Teacher not found.');
        }
    });

    return teacherProfile;
}

// const profileContainers = document.querySelectorAll('.teacher-profile');

// profileContainers.forEach((container) => {
//     container.addEventListener('click', () => {
//         const teacher = findTeacherByProfile(container as HTMLElement);
//         if (teacher) {
//             showInfoPopup(teacher);
//         } else {
//             console.error('Teacher not found.');
//         }
//     });
// });

function findTeacherByProfile(
    container: HTMLElement,
    favProfile: boolean,
): User | null {
    const name = container.querySelector('.teacher-name')?.textContent;
    const course = container.querySelector('.subject')?.textContent;
    const country = container.querySelector('.country')?.textContent;

    const photoElement = container.querySelector(
        'img.teacher-photo',
    ) as HTMLImageElement | null;

    const photoSrc =
        photoElement?.src.replace('http://localhost:3001', '') || null;

    for (const teacher of users) {
        const isNameMatch = teacher.full_name === name;
        const isCourseMatch = teacher.course === course;
        let isCountryMatch = null;
        if (!favProfile) {
            isCountryMatch = teacher.country === country;
        } else {
            isCountryMatch = true;
        }

        const teacherPicture =
            teacher.picture_large?.replace('http://localhost:3001', '') || null;
        const isPhotoMatch = teacherPicture === photoSrc;

        console.log(
            `Name: ${isNameMatch} (${teacher.full_name}), Course: ${isCourseMatch}, Country: ${isCountryMatch}, Photo: ${isPhotoMatch} (${teacherPicture})`,
        );

        if (isNameMatch && isCourseMatch && isCountryMatch && isPhotoMatch) {
            return teacher;
        }
    }

    return null;
}

let currentTeacher = null;

function showInfoPopup(teacher: User) {
    currentTeacher = teacher;
    const popupContainer = document.getElementById(
        'teacher-info-popup',
    ) as HTMLElement;

    popupContainer.style.display = 'flex';

    const popupPhoto = popupContainer.querySelector(
        '.popup-photo',
    ) as HTMLImageElement;
    const popupName = popupContainer.querySelector(
        '.popup-name',
    ) as HTMLElement;
    const popupSubject = popupContainer.querySelector(
        '.popup-subject',
    ) as HTMLElement;
    const popupCity = popupContainer.querySelector(
        '.popup-city',
    ) as HTMLElement;
    const popupAgeSex = popupContainer.querySelector(
        '.popup-age-sex',
    ) as HTMLElement;
    const popupEmail = popupContainer.querySelector(
        '.popup-email',
    ) as HTMLAnchorElement;
    const popupNumber = popupContainer.querySelector(
        '.popup-number',
    ) as HTMLElement;
    const popupDescription = popupContainer.querySelector(
        '.lorem-container p',
    ) as HTMLElement;

    if (popupPhoto) {
        if (teacher.picture_large !== '') {
            popupPhoto.src = teacher.picture_large;
        } else {
            popupPhoto.src = '/images/default-pic.jpg';
        }
    } else {
        console.error('Element with class .popup-photo not found');
    }
    popupName.textContent = teacher.full_name;
    popupSubject.textContent = teacher.course;
    popupCity.textContent = `${teacher.city}, ${teacher.country}`;
    popupAgeSex.textContent = `${teacher.age}, ${teacher.gender}`;
    popupEmail.href = `mailto:${teacher.email}`;
    popupEmail.textContent = teacher.email;
    popupNumber.textContent = teacher.phone;
    popupDescription.textContent = teacher.note || 'No additional information.';

    popupContainer.style.display = 'flex';

    const star = document.getElementById('favourite-star');
    if (teacher.favorite === true) {
        star.style.backgroundImage =
            'url("/css/images/full-star-for-popup.png")';
    } else {
        star.style.backgroundImage =
            'url("/css/images/empty-star-for-popup.png")';
    }
}

const popupContainer = document.getElementById(
    'teacher-info-popup',
) as HTMLElement;
const closeBtn = popupContainer.querySelector(
    '.cross-button',
) as HTMLButtonElement;
closeBtn.addEventListener('click', () => {
    popupContainer.style.display = 'none';
    updateProfiles();
    loadFavorites();
});

const star = document.getElementById('favourite-star');
star.addEventListener('click', () => {
    findTeacherAnMakeHimFav(currentTeacher);
    star.style.backgroundImage = 'url("/css/images/full-star-for-popup.png")';
});

function findTeacherAnMakeHimFav(user: User): void {
    for (const teacher of users) {
        const isNameMatch = teacher.full_name === user.full_name;
        const isCourseMatch = teacher.course === user.course;
        const isCountryMatch = teacher.country === user.country;

        const teacherPicture =
            teacher.picture_large?.replace('http://localhost:3001', '') || '';
        const isPhotoMatch = teacherPicture === user.picture_large;
        if (isNameMatch && isCourseMatch && isCountryMatch && isPhotoMatch) {
            teacher.favorite = true;
        }
    }
}

function createTeacherInitialsLabel(fullname: string): HTMLLabelElement {
    const initialsLabel = document.createElement('label');
    initialsLabel.className = 'teacher-initials';

    const nameParts = fullname.trim().split(' ');

    if (nameParts.length === 1) {
        initialsLabel.textContent = nameParts[0][0] + '.';
    } else {
        const firstInitial = nameParts[0][0];
        const lastInitial = nameParts[nameParts.length - 1][0];
        initialsLabel.textContent = `${firstInitial}.${lastInitial}.`;
    }

    return initialsLabel;
}

function addTeachersToList(teachers: User[]): void {
    const container = document.querySelector('.teachers-list');

    if (container) {
        teachers.forEach((teacher) => {
            const teacherProfile = createTeacherProfile(teacher, false);
            container.appendChild(teacherProfile);
        });
    } else {
        console.error("Контейнер '.teachers-list' не знайдено!");
    }
}

const ageSelect = document.querySelector("select[name='teacher-age']");
const regionSelect = document.querySelector("select[name='teacher-region']");
const sexSelect = document.querySelector("select[name='teacher-sex']");
const photoCheckbox = document.querySelector("input[name='photo-required']");
const favoriteCheckbox = document.querySelector("input[name='only-favorites']");

function updateFilters(users: User[]): User[] {
    const filters: filterFields = {
        age: changeAgeRangeString(
            (ageSelect as HTMLSelectElement).selectedOptions[0].text,
        ),
        region: (regionSelect as HTMLSelectElement).selectedOptions[0].text,
        gender: (
            sexSelect as HTMLSelectElement
        ).selectedOptions[0].text.toLowerCase(),
        photoRequired: (photoCheckbox as HTMLInputElement).checked,
        favorite: (favoriteCheckbox as HTMLInputElement).checked,
    };

    return testModules.filterUsers(users, filters);
}

function changeAgeRangeString(string: string): string {
    if (string.includes('-')) {
        const [num1, num2] = string.split('-');
        return `>=${num1} <=${num2}`;
    } else if (string.endsWith('+')) {
        const num = string.slice(0, -1);
        return `>${num}`;
    } else {
        return string;
    }
}

function clearTeachersList(): void {
    const teachersList = document.querySelector('.teachers-list');
    teachersList.innerHTML = '';
}

function updateProfiles(): void {
    clearTeachersList();
    clearTableBody();
    const teachersToDisplay = getTenUsers(firstUserInList);
    addTeachersToList(teachersToDisplay);
    createTable(teachersToDisplay);
}

[ageSelect, regionSelect, sexSelect, photoCheckbox, favoriteCheckbox].forEach(
    (el) => {
        el?.addEventListener('change', () => {
            firstUserInList = 0;
            lastDisplayOption = 'filter';
            updateProfiles();
        });
    },
);

function createTable(users: User[]) {
    const table = document.querySelector(
        '.teachers-table tbody',
    ) as HTMLTableElement;
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const row = table.insertRow();

        const nameCell = row.insertCell();
        nameCell.textContent = user.full_name;

        const specialityCell = row.insertCell();
        specialityCell.textContent = user.course;

        const ageCell = row.insertCell();
        ageCell.textContent = user.age.toString();

        const genderCell = row.insertCell();
        genderCell.textContent = user.gender;

        const nationalityCell = row.insertCell();
        nationalityCell.textContent = user.country;
    }
}

function clearTableBody() {
    const tableBody = document.querySelector('.teachers-table tbody');
    tableBody.innerHTML = '';
}

function getTenUsers(index: number): User[] {
    if (lastDisplayOption === 'search') {
        const searchedUsers = testModule.findUsers(users, lastSearchInput);
        if (index >= searchedUsers.length) {
            return [];
        }
        return searchedUsers.slice(index, index + 10);
    } else if (lastDisplayOption === 'filter') {
        const filteredUsers = updateFilters(users);
        if (index >= filteredUsers.length) {
            return [];
        }
        return filteredUsers.slice(index, index + 10);
    } else {
        console.error('Wrong lastDisplayOption value!');
    }
}

// REDO
const nameHeader: HTMLTableCellElement = document.querySelector(
    'thead th:nth-child(1)',
) as HTMLTableCellElement;

const specialityHeader: HTMLTableCellElement = document.querySelector(
    'thead th:nth-child(2)',
) as HTMLTableCellElement;

const ageHeader: HTMLTableCellElement = document.querySelector(
    'thead th:nth-child(3)',
) as HTMLTableCellElement;

const genderHeader: HTMLTableCellElement = document.querySelector(
    'thead th:nth-child(4)',
) as HTMLTableCellElement;

const nationalityHeader: HTMLTableCellElement = document.querySelector(
    'thead th:nth-child(5)',
) as HTMLTableCellElement;

nameHeader.addEventListener('click', () => {
    clearTableBody();
    createTable(
        testModules.sortUsers(getTenUsers(firstUserInList), 'full_name', true),
    );
});

specialityHeader.addEventListener('click', () => {
    clearTableBody();
    createTable(
        testModules.sortUsers(getTenUsers(firstUserInList), 'course', true),
    );
});

ageHeader.addEventListener('click', () => {
    clearTableBody();
    createTable(
        testModules.sortUsers(getTenUsers(firstUserInList), 'age', true),
    );
});

genderHeader.addEventListener('click', () => {
    clearTableBody();
    createTable(
        testModules.sortUsers(getTenUsers(firstUserInList), 'gender', true),
    );
});

nationalityHeader.addEventListener('click', () => {
    clearTableBody();
    createTable(
        testModules.sortUsers(getTenUsers(firstUserInList), 'country', true),
    );
});

function searchUsers(): void {
    const inputField = document.querySelector(
        '#search-info',
    ) as HTMLInputElement;
    const inputValue = inputField.value;
    const foundUsers = testModule.findUsers(users, inputValue);
    const teachersToDisplay =
        foundUsers.length >= 10 ? foundUsers.slice(0, 10) : foundUsers;
    clearTeachersList();
    clearTableBody();
    addTeachersToList(teachersToDisplay);
    createTable(teachersToDisplay);
    lastDisplayOption = 'search';
    lastSearchInput = inputValue;
}

const searchButton = document.querySelector(
    '.search-button',
) as HTMLButtonElement;
searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    searchUsers();
});

const addTeacherBtns = document.querySelectorAll(
    '.add-teacher-btn',
) as NodeListOf<HTMLButtonElement>;
const blurContainer = document.querySelector(
    '.blur-container',
) as HTMLDivElement;

addTeacherBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        blurContainer.style.display = 'flex';
    });
});

function getTeacherFromPopup(): User {
    // Get field values from the form
    const form = document.querySelector(
        '.teacher-data-form',
    ) as HTMLFormElement;

    let name = (form.elements.namedItem('teacher-name') as HTMLInputElement)
        .value;

    const specialitySelect = form.elements.namedItem(
        'subject',
    ) as HTMLSelectElement;
    let speciality =
        specialitySelect.options[specialitySelect.selectedIndex].text;

    const countrySelect = form.elements.namedItem(
        'country',
    ) as HTMLSelectElement;
    let country = countrySelect.options[countrySelect.selectedIndex].text;

    let city = (form.elements.namedItem('teacher-city') as HTMLInputElement)
        .value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const phoneNumber = (
        form.elements.namedItem('phone-number') as HTMLInputElement
    ).value;
    const birthDate = (
        form.elements.namedItem('birth-date') as HTMLInputElement
    ).value;

    const maleRadio = document.getElementById('male') as HTMLInputElement;
    const femaleRadio = document.getElementById('female') as HTMLInputElement;

    const sex = maleRadio.checked
        ? 'male'
        : femaleRadio.checked
        ? 'female'
        : null;

    const backgroundColor = (
        form.elements.namedItem('background-color') as HTMLInputElement
    ).value;
    const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement)
        .value;

    const validPhoneNumFormat = testModule.validatePhoneNumber;
    const validEmailFormat = testModule.validateEmail;
    const validColorFormat = testModule.validateColor;
    const getFirstWord = testModule.getFirstWord;

    let isValid = true;

    if (typeof name !== 'string' || name.trim() === '') {
        displayError(
            form.elements.namedItem('teacher-name') as HTMLInputElement,
            'Name is required.',
        );
        isValid = false;
    } else if (!/^(Mr|Mrs|Ms)\s/.test(name)) {
        displayError(
            form.elements.namedItem('teacher-name') as HTMLInputElement,
            'Name must start with Mr, Mrs, or Ms.',
        );
        isValid = false;
    } else {
        name = formatName(name);
    }

    if (typeof speciality !== 'string' || speciality.trim() === '') {
        displayError(
            form.elements.namedItem('subject') as HTMLSelectElement,
            'Speciality is required.',
        );
        isValid = false;
    } else {
        speciality = formatName(speciality);
    }

    if (typeof country !== 'string' || country.trim() === '') {
        displayError(
            form.elements.namedItem('country') as HTMLSelectElement,
            'Country is required.',
        );
        isValid = false;
    } else {
        country = formatName(country);
    }

    if (typeof city !== 'string' || city.trim() === '') {
        displayError(
            form.elements.namedItem('teacher-city') as HTMLInputElement,
            'City is required.',
        );
        isValid = false;
    } else {
        city = formatName(city);
    }

    if (!validEmailFormat(email)) {
        displayError(
            form.elements.namedItem('email') as HTMLInputElement,
            'Invalid email format.',
        );
        isValid = false;
    }

    if (!validPhoneNumFormat(phoneNumber, country)) {
        displayError(
            form.elements.namedItem('phone-number') as HTMLInputElement,
            'Invalid phone number for the selected country.',
        );
        isValid = false;
    }

    if (typeof birthDate !== 'string' || birthDate.trim() === '') {
        displayError(
            form.elements.namedItem('birth-date') as HTMLInputElement,
            'Birth date is required.',
        );
        isValid = false;
    }

    if (!sex) {
        displayError(femaleRadio, 'Sex is required.');
        isValid = false;
    }

    if (!validColorFormat(backgroundColor)) {
        displayError(
            form.elements.namedItem('background-color') as HTMLInputElement,
            'Invalid color format.',
        );
        isValid = false;
    }

    if (typeof notes !== 'string') {
        displayError(
            form.elements.namedItem('notes') as HTMLTextAreaElement,
            'Notes must be a string.',
        );
        isValid = false;
    }

    if (isValid) {
        const teacher: User = {
            gender: sex,
            title: getFirstWord(name),
            full_name: removeFirstWord(name),
            city: city,
            state: null,
            country: country,
            postcode: null,
            coordinates: null,
            timezone: null,
            email: email,
            b_date: birthDate,
            age: calculateAge(birthDate),
            phone: phoneNumber,
            picture_large: '',
            picture_thumbnail: null,
            id: null,
            favorite: false,
            course: speciality,
            bg_color: backgroundColor,
            note: notes,
        };
        console.log(teacher);
        return teacher;
    } else {
        return null;
    }
}

function removeFirstWord(input: string): string {
    const words = input.trim().split(/\s+/);
    return words.slice(1).join(' ');
}

// REDO
function addTeacherToWebsite(): boolean {
    const teacher = getTeacherFromPopup();
    if (teacher !== null) {
        sendUsersToServer([teacher]);
        getUsersFromServer('http://localhost:3001/api/items', users);
        firstUserInList = 0;
        lastDisplayOption = 'filter';
        updateProfiles();
        clearTableBody();
        createTable(
            testModules.sortUsers(
                getTenUsers(firstUserInList),
                'full_name',
                true,
            ),
        );
        loadFavorites();
        return true;
    } else {
        return false;
    }
}

function formatName(input: string): string {
    return input
        .trim()
        .split(/\s+/)
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(' ');
}

function displayError(
    inputElement: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
    message: string,
): void {
    const errorLabel = document.createElement('label');
    errorLabel.className = 'error-label';
    errorLabel.style.color = 'red';
    errorLabel.style.fontSize = '11px';
    errorLabel.textContent = message;

    inputElement.insertAdjacentElement('afterend', errorLabel);
}

const form = document.querySelector('.teacher-data-form') as HTMLFormElement;
const addButton = form.querySelector('.add-btn') as HTMLButtonElement;

addButton.addEventListener('click', (event: Event) => {
    event.preventDefault();
    clearErrors();
    if (addTeacherToWebsite()) {
        clearForm();
        blurContainer.style.display = 'none';
    }
});

function clearErrors(): void {
    const errorLabels = form.querySelectorAll('.error-label');
    errorLabels.forEach((label) => label.remove());
}

function clearForm() {
    clearErrors();
    const textInputs = form.querySelectorAll(
        'input[type="text"], input[type="email"], input[type="tel"], input[type="date"], textarea',
    );
    textInputs.forEach((input) => {
        (input as HTMLInputElement | HTMLTextAreaElement).value = '';
    });

    const radioInputs = form.querySelectorAll('input[type="radio"]');
    radioInputs.forEach((radio) => {
        (radio as HTMLInputElement).checked = false;
    });

    const selectInputs = form.querySelectorAll('select');
    selectInputs.forEach((select) => {
        (select as HTMLSelectElement).selectedIndex = 0;
    });
}

const closeButton = document.querySelector(
    '.cross-button',
) as HTMLButtonElement;

closeButton?.addEventListener('click', () => {
    const form = document.querySelector(
        '.teacher-data-form',
    ) as HTMLFormElement;
    if (form) {
        clearForm();
    }
    blurContainer.style.display = 'none';
});

const prevButtons = document.querySelectorAll(
    '.prev',
) as NodeListOf<HTMLButtonElement>;
const nextButtons = document.querySelectorAll(
    '.next',
) as NodeListOf<HTMLButtonElement>;

prevButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (firstUserInList > 0) {
            firstUserInList -= 10;
            updateProfiles();
        }
    });
});

nextButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const lastUserArray = getLastUserArray();
        if (firstUserInList + 10 < lastUserArray.length) {
            firstUserInList += 10;
            updateProfiles();
        }
    });
});

function getLastUserArray(): User[] {
    if (lastDisplayOption === 'search') {
        return testModule.findUsers(users, lastSearchInput);
    } else if (lastDisplayOption === 'filter') {
        return updateFilters(users);
    } else {
        console.error('Wrong lastDisplayOption value!');
    }
}

function clearFavorites() {
    const favoritesList = document.querySelector('.favorites-list');
    favoritesList.innerHTML = '';
}

let currentStartIndex = 0;

function loadFavorites() {
    const favorites = testModule.filterUsers(users, {favorite: true});
    const favoritesList = document.querySelector('.favorites-list');

    favoritesList.innerHTML = '';
    const favoritesToShow = favorites.slice(
        currentStartIndex,
        currentStartIndex + 4,
    );
    favoritesToShow.forEach((teacher) => {
        const profile = createTeacherProfile(teacher, true);
        favoritesList.appendChild(profile);
    });

    updateArrowState(favorites.length);
}

function updateArrowState(totalFavorites) {
    const leftArrow = document.querySelector(
        '.left-arrow-button',
    ) as HTMLButtonElement;
    const rightArrow = document.querySelector(
        '.right-arrow-button',
    ) as HTMLButtonElement;

    leftArrow.disabled = currentStartIndex === 0;
    rightArrow.disabled = currentStartIndex + 4 >= totalFavorites;
}

document.querySelector('.left-arrow-button').addEventListener('click', () => {
    if (currentStartIndex > 0) {
        currentStartIndex -= 4;
        loadFavorites();
    }
});

document.querySelector('.right-arrow-button').addEventListener('click', () => {
    const favorites = testModule.filterUsers(users, {favorite: true});
    if (currentStartIndex + 4 < favorites.length) {
        currentStartIndex += 4;
        loadFavorites();
    }
});

updateProfiles();
loadFavorites();
