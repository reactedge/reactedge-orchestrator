export function runAsync<T>(
    callback: () => T
): Promise<T> {
    return new Promise(
        (resolve, reject) => {
            setImmediate(() => {
                try {
                    resolve(callback());
                } catch (error) {
                    reject(error);
                }
            });
        }
    );
}