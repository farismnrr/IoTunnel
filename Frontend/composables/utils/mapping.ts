const mapUtils = {
    mapData: <T, U>(data: T[], mapFunction: (item: T) => U): U[] => {
        return data.map(mapFunction);
    }
};

export default mapUtils;