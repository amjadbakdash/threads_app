import { UserDataInterface } from "./user.types";



export interface CommunityInterface {
    id: string,
    name: string,
    image: string,
}

export interface ThreadsInterface {
    _id: string,
    text: string,
    author: UserDataInterface,
    parentId: string
    community: CommunityInterface | null,
    children: [],
    createdAt: Date,
}