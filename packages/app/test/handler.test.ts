import { mockGitHubApiRequests, getDefaultProbotOptions, resetNetworkMonitoring } from "./utils/helpers.js";
import { Probot } from "probot";
import { ProbotHandler, WebhookEventRequest } from '../src/handler.js';
import { app } from '../src/index.js';

import installation_repositories_event from "./fixtures/installation_repositories/added.json";

describe("The serverless handler", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let probot: any; // Must use any type to avoid strong requirements for mock

    beforeEach(() => {
        const options = getDefaultProbotOptions();
        probot = new Probot(options);
        jest.clearAllMocks();
    });

    afterEach(() => {
        resetNetworkMonitoring();
    });

    test("handler returns error if the signature is missing", async () => {
        const mock = mockGitHubApiRequests().toNock();
        const handler = await ProbotHandler.create(probot, app);
        const result = await handler.process({ body: JSON.stringify(installation_repositories_event.payload), headers: { "test": "true"} });
        expect(result.status).toStrictEqual(400);
        expect(mock.pendingMocks()).toStrictEqual([]);
    });

    test("handler returns error if the event is empty", async () => {
        const mock = mockGitHubApiRequests().toNock();
        const handler = await ProbotHandler.create(probot, app);
        const result = await handler.process(({}) as WebhookEventRequest);
        expect(result.status).toStrictEqual(400);
        expect(mock.pendingMocks()).toStrictEqual([]);
    });

    test("handler returns error if the event body is empty", async () => {
        const mock = mockGitHubApiRequests().toNock();
        const handler = await ProbotHandler.create(probot, app);
        const result = await handler.process({ body: "", headers: { "test": "true"} });
        expect(result.status).toStrictEqual(400);
        expect(mock.pendingMocks()).toStrictEqual([]);
    });

    test("handler returns error if the event body is undefined", async () => {
        const mock = mockGitHubApiRequests().toNock();
        const handler = await ProbotHandler.create(probot, app);
        const result = await handler.process({ body: undefined, headers: { "test": "true"} });
        expect(result.status).toStrictEqual(400);
        expect(mock.pendingMocks()).toStrictEqual([]);
    });

    test("embedded probot receives messages to be processed", async () => {
        const mock = mockGitHubApiRequests().toNock();
        probot.webhooks.verifyAndReceive = jest.fn().mockImplementation(() => Promise.resolve());
        const handler = await ProbotHandler.create(probot, app);
        const result = await handler.process({ body: JSON.stringify(installation_repositories_event.payload), headers: { "test": "true"} });
        expect(result.status).toEqual(200);
        expect(mock.pendingMocks()).toStrictEqual([]);
    });

});