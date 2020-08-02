import axios from 'axios';

function Client(endpoint, { method, body, ...customConfig } = {}) {
	const token = localStorage.getItem('id_token');

	const headers = {
		'content-type': 'application/json',
		'accept': 'application/json',
		'X-CSRF-TOKEN': window.Laravel.csrfToken,
		'X-Requested-With': 'XMLHttpRequest'
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	method = method || (body ? 'POST' : 'GET');

	const config = {
		method: method,
		url: endpoint,
		...customConfig,
		headers: {
			...headers,
			...customConfig.headers
		}
	};

	if (body) {
		config.data = body;
	}


	return axios(config)
		.then((r) => {
			if (r.status >= 200 && r.status < 300) {
				return r.data;
			}

			return Promise.reject(r);
		})
		.catch((error) => {
			return Promise.reject(error);
		});
}

export default Client;
