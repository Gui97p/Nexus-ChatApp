export type createMessageType = { 
    content: string, 
    silent?: boolean, 
    private?: boolean, 
    replies?: { id: string }[], 
    authorId: string 
}