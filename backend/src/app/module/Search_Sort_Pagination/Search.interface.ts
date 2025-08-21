export interface userQuery{
    searchTerm?:string,
    role?:string,
    status?:string,
    sortBy?:string,
    sortOrder?: "asc"|"desc",
    limit?:string,
    page?:string;
}

