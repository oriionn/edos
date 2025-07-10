import Elysia from "elysia";

export default new Elysia().macro({
    auth: {
        // @ts-ignore
        async resolve({ jwt, status, bearer }) {
            if (!bearer)
                return status(403, {
                    ok: false,
                    code: "PROTECTED_ROUTE",
                });

            const isAuth = (await jwt.verify(bearer)) as false | object;
            if (!isAuth)
                return status(401, {
                    ok: false,
                    code: "INVALID_TOKEN",
                });

            return {
                auth: true,
            };
        },
    },
});
