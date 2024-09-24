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
