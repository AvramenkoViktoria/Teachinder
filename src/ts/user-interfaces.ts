export interface Coordinates {
    latitude: string;
    longitude: string;
}

export interface Timezone {
    offset: string;
    description: string;
}

export interface User {
    gender: string;
    title: string;
    full_name: string;
    city: string;
    state: string;
    country: string;
    postcode: string | number;
    coordinates: Coordinates;
    timezone: Timezone;
    email: string;
    b_date: string;
    age: number;
    phone: string;
    picture_large: string;
    picture_thumbnail: string;
    id: string | null;
    favorite: boolean;
    course: string;
    bg_color: string;
    note: string | null;
}

export interface fetchUser {
    gender: string;
    name: {
        title: string;
        first: string;
        last: string;
    };
    location: {
        street: {
            number: number;
            name: string;
        };
        city: string;
        state: string;
        country: string;
        postcode: string | number;
        coordinates: {
            latitude: string;
            longitude: string;
        };
        timezone: {
            offset: string;
            description: string;
        };
    };
    email: string;
    login: {
        uuid: string;
        username: string;
        password: string;
        salt: string;
        md5: string;
        sha1: string;
        sha256: string;
    };
    dob: {
        date: string;
        age: number;
    };
    registered: {
        date: string;
        age: number;
    };
    phone: string;
    cell: string;
    id: {
        name: string;
        value: string | null;
    };
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
    };
    nat: string;
}
