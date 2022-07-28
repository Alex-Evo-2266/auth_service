
export enum GrantType {
	AUTH_CODE = "authorization_code"
}

export enum ResponseType {
	CODE = "code"
}

export interface ICreateService{
	title: string,
	default_redirect_uri: string
}

export interface IService{
	title: string,
	client_id: string,
    grant_type: GrantType,
    response_type: ResponseType,
    scopes: string,
    default_scopes: string,
    redirect_uris: string,
    default_redirect_uri: string
}