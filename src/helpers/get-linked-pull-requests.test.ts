import axios from "axios";
import { getLinkedPullRequests } from "./get-linked-pull-requests";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

function createContext() {
  return {
    logger: {
      info: jest.fn(),
    },
  } as never;
}

describe("getLinkedPullRequests", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns an empty list when GitHub does not render the development form", async () => {
    mockedAxios.get.mockResolvedValue({ data: "<html><body>No development section</body></html>" });

    const context = createContext();
    const linkedPullRequests = await getLinkedPullRequests(context, {
      owner: "ubiquity",
      repository: "ubiquibot",
      issue: 716,
    });

    expect(linkedPullRequests).toEqual([]);
  });

  it("keeps only linked pull requests from the same owner and repository", async () => {
    mockedAxios.get.mockResolvedValue({
      data: `
        <div data-target="create-branch.developmentForm">
          <div class="my-1"><a href="/ubiquity/ubiquibot/pull/123">same repo</a></div>
          <div class="my-1"><a href="/ubiquity/other-repo/pull/456">other repo</a></div>
          <div class="my-1"><a href="/other-owner/ubiquibot/pull/789">other owner</a></div>
        </div>
      `,
    });

    const context = createContext();
    const linkedPullRequests = await getLinkedPullRequests(context, {
      owner: "ubiquity",
      repository: "ubiquibot",
      issue: 716,
    });

    expect(linkedPullRequests).toEqual([
      {
        organization: "ubiquity",
        repository: "ubiquibot",
        number: 123,
        href: "https://github.com/ubiquity/ubiquibot/pull/123",
      },
    ]);
  });
});
