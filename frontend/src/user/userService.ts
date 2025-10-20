async function getUserExistence() {

    const data = {
        id: "abc",
        username: "hoangbaoan1901",
        email: "hoangbaoan1901@gmail.com",
    }
    // Later implement with axios with the bearer token
    await new Promise<void>((resolve) =>
        setTimeout(() => {
            resolve();
        }, 2000)
    );
    return data;
}

export const getUserExistencePromise = getUserExistence();
