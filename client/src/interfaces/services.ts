
export enum GrantType {
	AUTH_CODE = "authorization_code"
}

export enum ResponseType {
	CODE = "code"
}

export interface IService{
	client_id: string,
    grant_type: GrantType,
    response_type: ResponseType,
    scopes: string,
    default_scopes: string,
    redirect_uris: string,
    default_redirect_uri: string
}