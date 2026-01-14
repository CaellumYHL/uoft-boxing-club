
export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image?: string; // Placeholder for now
}

export interface TeamMember {
    name: string;
    role: string;
    description: string;
    image?: string;
}

export const products: Product[] = [
    {
        id: 'fall-membership',
        name: 'Fall Term Membership',
        price: 25,
        description: 'Access to all regular classes for the Fall term. Valid through December.',
    },
    {
        id: 'winter-membership',
        name: 'Winter Term Membership',
        price: 25,
        description: 'Access to all regular classes for the Winter term. Valid January through April.',
    },
    {
        id: 't-shirt',
        name: 'T-Shirt',
        price: 20,
        description: 'Official UofT Boxing Club T-shirt. 100% cotton, comfortable fit.',
    },
    {
        id: 'handwraps',
        name: 'Handwraps',
        price: 10,
        description: 'Essential for wrist protection. 180 inches, semi-elastic cotton blend.',
    },
    {
        id: 'bundle',
        name: 'Starter Bundle',
        price: 25,
        description: 'Includes one pair of handwraps and a T-shirt. Great for beginners!',
    },
];

export const teamMembers: TeamMember[] = [
    {
        name: 'Eithan',
        role: 'Head Coach',
        description: 'With over 10 years of experience, Eithan focuses on technique and conditioning.',
    },
    {
        name: 'Nic',
        role: 'Coach / Treasurer',
        description: 'Specializes in power punches and defensive maneuvers.',
    },
    {
        name: 'Dionne',
        role: 'Coach',
        description: 'Expert in footwork and agility. Leads the advanced classes.',
    },
    {
        name: 'Julia',
        role: 'President',
        description: 'Managing the club operations and ensuring a great community experience.',
    },
];

export const CONSTANTS = {
    GOOGLE_FORM_URL: "https://docs.google.com/forms/d/your-form-id-here",
    GOOGLE_CALENDAR_URL: "https://calendar.google.com/calendar/embed?src=your-calendar-id",
};
