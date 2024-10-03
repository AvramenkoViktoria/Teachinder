import { validateProfiles, uniteTwoDataLists, formatTeachersData, } from './test-module.js';
import { showLoadingScreen, hideLoadingScreen } from './app.js';
async function fetchUsers(count) {
    try {
        const response = await fetch(`https://randomuser.me/api/?results=${count}`);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}
async function createRandomUsers(count) {
    try {
        const users = await fetchUsers(count);
        const formattedUsers = users.flatMap((user) => {
            return uniteTwoDataLists(formatTeachersData([user]));
        });
        return formattedUsers;
    }
    catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}
export let users = await fillUsersList();
async function fillUsersList() {
    showLoadingScreen();
    let users = [];
    while (users.length < 50) {
        let newUsers = await createRandomUsers(1);
        while (!validateProfiles(newUsers)) {
            newUsers = await createRandomUsers(1);
        }
        users.push(...newUsers);
    }
    await sendUsersToServer(users);
    hideLoadingScreen();
    return users;
}
export async function sendUsersToServer(users) {
    try {
        const response = await fetch('http://localhost:3001/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(users),
        });
        if (!response.ok) {
            throw new Error(`Error sending data to server: ${response.statusText}`);
        }
        console.log('Users were successfully sent to server');
    }
    catch (error) {
        console.error('Error sending users to server:', error);
    }
}
export async function getUsersFromServer(url, targetArray) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Error getting data from server: ${response.statusText}`);
        }
        const data = await response.json();
        targetArray.length = 0;
        targetArray.push(...data);
        console.log('Data has been successfully received and assigned to the array');
    }
    catch (error) {
        console.error('Error getting data from server:', error);
    }
}
//# sourceMappingURL=http.js.map