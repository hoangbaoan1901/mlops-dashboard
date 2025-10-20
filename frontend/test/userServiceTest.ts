import { getUserExistencePromise } from "../src/user/userService";

async function test() {
    console.log("begin test");
    const data = await getUserExistencePromise;
    console.log(data);
}

test();