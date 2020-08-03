const authToken = 'auth_token';
const userLogin = 'user_login';

export const getToken = () => window.localStorage.getItem(authToken);

export const setToken = token => {
  token
    ? window.localStorage.setItem(authToken, token)
    : window.localStorage.removeItem(authToken);
};

export const getUser = () => window.localStorage.getItem(userLogin);

export const setUser = user => {
  user
    ? window.localStorage.setItem(userLogin, JSON.stringify(user))
    : window.localStorage.removeItem(userLogin);
};