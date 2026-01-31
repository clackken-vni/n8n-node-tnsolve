export class TnsolveApi {
    name = 'tnsolveApi';
    displayName = 'TN Solve API';
    documentationUrl = 'https://tnsolve.com';
    properties = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            placeholder: 'Enter access_token from browser cookies',
            description: 'The access_token cookie value from tnsolve.com',
        },
        {
            displayName: 'CSRF Token',
            name: 'csrfToken',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            placeholder: 'Enter csrf_token from browser cookies',
            description: 'The csrf_token cookie value from tnsolve.com',
        },
    ];
}
//# sourceMappingURL=TnsolveApi.credentials.js.map