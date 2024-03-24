const getCookieToken = () => {
    if (!document.cookie) return null;

    const cookieName = "INVOICE_USER";
    const cookie = document.cookie
        .split(";")
        .map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith(`${cookieName}=`));

    if (!cookie) return null;

    const cookieValue = cookie.substring(cookieName.length + 1);
    const decodedValue = decodeURIComponent(cookieValue);

    try {
        const tokenObject = JSON.parse(decodedValue);
        return tokenObject;
    } catch (error) {
        console.error("Error parsing cookie token:", error);
        return null;
    }
};

export default getCookieToken;
