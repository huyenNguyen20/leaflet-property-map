
export type PropertyItem = {
    image: string;
    ratingStars: string;
    numberOfRatings: number;
    numberOfBedroom: number;
    numberOfBathroom: number;
    latitude: number;
    longitude: number;
    name: string;
    price: string;
    description: string;
    streetName: string;
    city: string;
    province: string;
    country: string;
    zipcode: string;
};

export type SearchQuery = {
    city: string;
    province: string;
};