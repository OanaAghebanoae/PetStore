export interface Pet {
    id: number;
    category: PetCategory;
    name: string;
    photoUrls: string[];
    status: string;
    tags: PetTag[]
}

export interface PetCategory {
    id: number;
    name: string;
}

export interface PetTag {
    id: number;
    name: string;
}