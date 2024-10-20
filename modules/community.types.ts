export interface CommunityInterface {
    _id?: string,
    id: string,
    name: string,
    username: string,
    image: string,
    bio: string,
    createdBy: string,
    threads: string[],
    members: string[]
}