import {useCallback,useState,useEffect} from "react";
let logoutTimer;
export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(null);

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem('userData', JSON.stringify({ userId: uid, token: token, expiration: tokenExpirationDate.toISOString()}))
    }, []);
    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            logoutTimer = setTimeout(logout, tokenExpirationDate.getTime() - new Date().getTime());
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    useEffect(() => {
        const storeData = JSON.parse(localStorage.getItem('userData'));
        if (storeData && storeData.token && new Date(storeData.expiration) > new Date()) {
            login(storeData.userId, storeData.token, new Date(storeData.expiration));
        }
    }, [login])
    return {token,userId,login,logout};
}