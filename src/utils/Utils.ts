export default class Utils {

    public static shuffleArr(arr) {
        for (var i = arr.length - 1; i >= 0; i--) {
            var randomIndex = Math.floor(Math.random() * (i + 1));
            var itemAtIndex = arr[randomIndex];
            arr[randomIndex] = arr[i];
            arr[i] = itemAtIndex;
        }

        return arr;
    }

    public static checkIsNull(value: any): boolean {
        if (value === undefined || value === null || value === NaN) {
            return true;
        }

        return false;
    }

    public static getQueryParams(url) {
        const queryParams = {};
        const queryString = url.split('?')[1];
        if (queryString) {
            const keyValuePairs = queryString.split('&');
            keyValuePairs.forEach(keyValuePair => {
                const [key, value] = keyValuePair.split('=');
                queryParams[key] = decodeURIComponent(value);
            });
        }
        return queryParams;
    }

    public static formatAccountAddress(input: string, startIndex: number, endIndex: number, total: number) {
        if (input.length <= total) {
            return input;
        } else {
            const start = input.slice(0, startIndex);
            const end = input.slice(-endIndex);
            return `${start}...${end}`;
        }
    }
}