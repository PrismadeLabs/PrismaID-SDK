export class Cookie {
    public static setCookie(name: string, val: string) {
        const date = new Date()
        const value = val

        // Set it expire in 365 days
        date.setTime(date.getTime() + (365 * Cookie.day))

        // Set it
        document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/"
    }

    public static getCookie(name: string, defaultCookie: string): string {
        const value = "; " + document.cookie
        const parts = value.split("; " + name + "=")

        if (parts.length === 2) {
            return parts.pop().split(";").shift()
        }

        return defaultCookie
    }

    public static deleteCookie(name: string) {
        const date = new Date()

        // Set it expire in -1 days
        date.setTime(date.getTime() + (-1 * Cookie.day))

        // Set it
        document.cookie = name + "=; expires=" + date.toUTCString() + "; path=/"
    }

    private static day = 24 * 60 * 60 * 1000
}
