import { validateBotConfig } from "./configuration-types";

type TestConfig = {
  keys: Record<string, unknown>;
  features: {
    duplicateIssueDetection?: {
      similarityThreshold?: number;
      measureSimilarityPrompt?: string;
      importantWordsPrompt?: string;
      measureSimilarityTemperature?: number;
      importantWordsTemperature?: number;
    };
  };
  timers: Record<string, unknown>;
  payments: Record<string, unknown>;
  disabledCommands: string[];
  incentives: Record<string, unknown>;
  labels: Record<string, unknown>;
  miscellaneous: Record<string, unknown>;
};

function minimalConfig(): TestConfig {
  return {
    keys: {},
    features: {},
    timers: {},
    payments: {},
    disabledCommands: [],
    incentives: {},
    labels: {},
    miscellaneous: {},
  };
}

describe("duplicate issue detection configuration", () => {
  it("applies repository-configurable defaults", () => {
    const config = minimalConfig();

    expect(validateBotConfig(config)).toBe(true);
    expect(config.features.duplicateIssueDetection).toMatchObject({
      similarityThreshold: 80,
      measureSimilarityTemperature: 0,
      importantWordsTemperature: 0,
    });
  });

  it("accepts repository overrides for prompts, threshold, and temperatures", () => {
    const config = minimalConfig();
    config.features = {
      duplicateIssueDetection: {
        similarityThreshold: 92,
        measureSimilarityPrompt: "Return only the similarity percentage for %first% and %second%.",
        importantWordsPrompt: "Return important words separated by #.",
        measureSimilarityTemperature: 0.2,
        importantWordsTemperature: 0.1,
      },
    };

    expect(validateBotConfig(config)).toBe(true);
    expect(config.features.duplicateIssueDetection?.similarityThreshold).toBe(92);
  });

  it("rejects invalid repository similarity thresholds", () => {
    const config = minimalConfig();
    config.features = {
      duplicateIssueDetection: {
        similarityThreshold: 101,
      },
    };

    expect(validateBotConfig(config)).toBe(false);
    expect(
      validateBotConfig.errors?.some(
        (error) => error.instancePath === "/features/duplicateIssueDetection/similarityThreshold"
      )
    ).toBe(true);
  });
});
