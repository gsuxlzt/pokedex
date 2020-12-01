import axios from "axios";
export async function handleRequests(endpoint, payload = { method: "get" }) {
    const request = Object.assign({}, payload, {
        url: endpoint
    });

    return new Promise((resolve, reject) => {
        axios(request).then(
            r => {
                const { data, status } = r;
                resolve({ data, status });
            },
            e => {
                const { data, status } = e.response;
                /* eslint-disable prefer-promise-reject-errors */
                reject({ data, status });
            }
        );
    });
}

export function capitalize(name) {
    return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
}