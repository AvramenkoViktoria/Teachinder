import {
    validateProfiles,
    uniteTwoDataLists,
    formatTeachersData,
} from './test-module.js';
import {fetchUser, User} from './user-interfaces.js';
import {showLoadingScreen, hideLoadingScreen} from './app.js';

async function fetchUsers(count: number): Promise<fetchUser[]> {
    try {
        const response = await fetch(
            `https://randomuser.me/api/?results=${count}`,
        );
        const data = await response.json();
        return (data as {results: fetchUser[]}).results;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

async function createRandomUsers(count: number): Promise<User[]> {
    try {
        const users = await fetchUsers(count);
        const formattedUsers = users.flatMap((user) => {
            return uniteTwoDataLists(formatTeachersData([user]) as User[]);
        });
        return formattedUsers;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export let users: User[] = await fillUsersList();

async function fillUsersList(): Promise<User[]> {
    showLoadingScreen();
    let users: User[] = [];
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

export async function sendUsersToServer(users: User[]): Promise<void> {
    try {
        const response = await fetch('http://localhost:3001/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(users),
        });

        if (!response.ok) {
            throw new Error(
                `Error sending data to server: ${response.statusText}`,
            );
        }

        console.log('Users were successfully sent to server');
    } catch (error) {
        console.error('Error sending users to server:', error);
    }
}

export async function getUsersFromServer(
    url: string,
    targetArray: User[],
): Promise<void> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(
                `Error getting data from server: ${response.statusText}`,
            );
        }

        const data = await response.json();

        targetArray.length = 0;
        targetArray.push(...data);

        console.log(
            'Data has been successfully received and assigned to the array',
        );
    } catch (error) {
        console.error('Error getting data from server:', error);
    }
}
