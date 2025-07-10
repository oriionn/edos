import Elysia, { status, t } from "elysia";
import db from "../../database";
import tables from "../../database/tables";

export default new Elysia({ prefix: "/auth" })
    .post(
        "/login",
        // @ts-ignore
        async ({ body, status, jwt }) => {
            let password = (await db.select().from(tables.password))[0]
                ?.password;
            if (await Bun.password.verify(body.password, password!)) {
                const token = await jwt.sign({ auth: true });

                return {
                    ok: true,
                    data: token,
                };
            } else {
                return status(403, {
                    ok: false,
                    code: "INVALID_PASSWORD",
                });
            }
        },
        {
            body: t.Object({
                password: t.String(),
            }),
        },
    )
    // @ts-ignore
    .get("/validity", async ({ bearer, jwt }) => {
        if (!bearer)
            return status(403, {
                ok: false,
                code: "NO_TOKEN",
            });

        if (await jwt.verify(bearer)) {
            return {
                ok: true,
            };
        } else {
            return status(401, {
                ok: false,
                code: "INVALID_TOKEN",
            });
        }
    });
