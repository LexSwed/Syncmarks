export function makeRequest(url, options, accessToken) {
    const headers = options.headers || new Headers();
    headers.append("Authorization", "Bearer " + accessToken);
    const req = new Request(url, {
        headers,
        ...options
    });

    return fetch(req).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw response.status;
        }
    });
}
export const env = window.browser || window.chrome;
var dummy = [
    {
        chidlren: [
            {
                children: [
                    {
                        id: 2,
                        title: "Chidlren 2-1"
                    },
                    {
                        id: 3,
                        title: "Chidlren 2-2"
                    }
                ],
                id: 1,
                title: "Children 1-1"
            }
        ],
        id: 0,
        title: "Parent"
    }
];
