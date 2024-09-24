import testModules from './test-module.js';
function createTeacherProfile(teacher) {
    const teacherProfile = document.createElement('div');
    teacherProfile.classList.add('teacher-profile');
    if (teacher.favorite)
        teacherProfile.classList.add('fav');
    const profilePicContainer = document.createElement('div');
    profilePicContainer.classList.add('profile-pic-container');
    const teacherPhoto = document.createElement('img');
    teacherPhoto.src = teacher.picture_large;
    teacherPhoto.classList.add('teacher-photo');
    teacherPhoto.alt = "Teacher's photo";
    profilePicContainer.appendChild(teacherPhoto);
    const teacherNameLabel = document.createElement('label');
    teacherNameLabel.classList.add('teacher-name');
    teacherNameLabel.textContent = teacher.full_name;
    const subjectLabel = document.createElement('label');
    subjectLabel.classList.add('subject');
    subjectLabel.textContent = teacher.course;
    const countryLabel = document.createElement('label');
    countryLabel.classList.add('country');
    countryLabel.textContent = teacher.country;
    teacherProfile.appendChild(profilePicContainer);
    teacherProfile.appendChild(teacherNameLabel);
    teacherProfile.appendChild(subjectLabel);
    teacherProfile.appendChild(countryLabel);
    return teacherProfile;
}
function addTeachersToList(teachers) {
    const container = document.querySelector('.teachers-list');
    if (container) {
        teachers.forEach((teacher) => {
            const teacherProfile = createTeacherProfile(teacher);
            container.appendChild(teacherProfile);
        });
    }
    else {
        console.error("Контейнер '.teachers-list' не знайдено!");
    }
}
addTeachersToList(testModules.userList);
//# sourceMappingURL=app.js.map