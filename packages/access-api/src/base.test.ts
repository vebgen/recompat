import { describe } from "node:test";
import { AccessPoint } from "./base";
import { enableFetchMocks } from 'jest-fetch-mock'
import { AccessPointMethod } from "./defs";

type TContext = {
    userId: number;
};
const aContext = { userId: 123 };

enableFetchMocks();


beforeEach(() => {
    fetchMock.resetMocks();
})


describe("AccessPoint", () => {
    type Payload = { name: string };
    type TPath = { id: number, slug: string };
    type TResult = { id: number, name: string, slug: string };

    class ToTest extends AccessPoint<Payload, TPath, TResult, TContext> {
        public constructor() { super(); }
        apiUrl() { return "apiPrefix"; }
        isAllowed() { return true; }
        method() { return "POST" as AccessPointMethod; }
        pathPattern() { return "/api/{id}/{slug}"; }
    }

    describe("url", () => {
        it("should replace the placeholders", () => {

            const toTest = new ToTest();
            const result = toTest.url(aContext, { id: 1, slug: "test" });
            expect(result).toBe("apiPrefix/api/1/test");
        });
        it("should throw if a placeholder is missing", () => {
            const toTest = new ToTest();
            expect(() => toTest.url(aContext, { id: 1 } as any)).toThrow();
        });
        it("should return the path if no argument", () => {
            class ToTest2 extends AccessPoint<Payload, TPath, TResult, TContext> {
                public constructor() { super(); }
                apiUrl() { return "apiPrefix"; }
                isAllowed() { return true; }
                method() { return "POST" as AccessPointMethod; }
                pathPattern() { return "/api/1/2/3"; }
            }
            const toTest = new ToTest2();
            const result = toTest.url(aContext);
            expect(result).toBe("apiPrefix/api/1/2/3");
        });
    });

    describe("call", () => {
        it("should return the result", async () => {
            let processed: any;
            class ToTest2 extends ToTest {
                override processResult(result: any) {
                    processed = result;
                    return result.data;
                }
            }

            fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }));

            const toTest = new ToTest2();
            const result = await toTest.call(aContext, {
                name: "test"
            }, {
                id: 1, slug: "test"
            });
            expect(result).toEqual('12345');
            expect(processed).toEqual({
                data: '12345'
            });
            expect(fetchMock.mock.calls.length).toEqual(1);

            expect(fetchMock.mock.calls[0][0]).toEqual("apiPrefix/api/1/test");
            const arg: any = fetchMock.mock.calls[0][1];
            expect(arg).toBeDefined();
            expect(arg.method).toEqual("POST");
            expect(arg.headers).toBeDefined();
            expect(arg.headers["Content-Type"]).toEqual("application/json");
            expect(arg.body).toEqual("{\"name\":\"test\"}");
            expect(arg.signal).toBeDefined();
            expect(arg.signal.aborted).toBeFalsy();
        });
        it("should return an error on fetch error", async () => {
            fetchMock.mockReject(new Error('fake error message'));
            const toTest = new ToTest();
            let result;
            try {
                result = await toTest.call(aContext, {
                    name: "test"
                }, {
                    id: 1, slug: "test"
                })
            } catch (e) {
                result = e;
            }
            expect(result).toEqual({
                "code": "err-comm",
                "message": "Could not communicate with the server",
                "status": 0,
            });
            expect(fetchMock.mock.calls.length).toEqual(1);
        });
        it("should return an error if aborted", async () => {
            fetchMock.mockAbort();
            const toTest = new ToTest();
            let result;
            try {
                result = await toTest.call(aContext, {
                    name: "test"
                }, {
                    id: 1, slug: "test"
                });
            } catch (e) {
                result = e;
            }
            expect(result).toEqual({
                "code": "err-comm",
                "message": "Could not communicate with the server",
                "status": 0,
            });
            expect(fetchMock.mock.calls.length).toEqual(1);
        });
        it("should show error if response is not json", async () => {
            fetchMock.mockResponseOnce("not json");
            const toTest = new ToTest();
            let result;
            try {
                result = await toTest.call(aContext, {
                    name: "test"
                }, {
                    id: 1, slug: "test"
                });
            } catch (e) {
                result = e;
            }
            expect(fetchMock.mock.calls.length).toEqual(1);
            expect(result).toEqual({
                "code": "err-other",
                "message": "not json",
                "status": 200,
            });
        });
        it("should detect API errors", async () => {
            fetchMock.mockResponseOnce(
                JSON.stringify({
                    "message": "abc",
                    "code": "def",
                    "field": "string",
                    "params": {
                        "lorem": "ipsum"
                    }
                }),
                { status: 500 }
            );
            const toTest = new ToTest();
            let result;
            try {
                result = await toTest.call(aContext, {
                    name: "test"
                }, {
                    id: 1, slug: "test"
                });
            } catch (e) {
                result = e;
            }
            expect(fetchMock.mock.calls.length).toEqual(1);
            expect(result).toEqual({
                "code": "err-unknown",
                "message": "Unknown error",
                "status": 500,
            });
        });
        it("should reject the call if the user is not allowed", async () => {
            class ToTest2 extends ToTest {
                override isAllowed() {
                    return false;
                }
            }
            const toTest = new ToTest2();
            let result;
            try {
                result = await toTest.call(aContext, {
                    name: "test"
                }, {
                    id: 1, slug: "test"
                });
            } catch (e) {
                result = e;
            }
            expect(fetchMock.mock.calls.length).toEqual(0);
            expect(result).toEqual({
                "code": "err-permission",
                "message": (
                    "You don't have the required permissions to " +
                    "access this resource"
                ),
                "status": 0,
            });
        });
    });
});
