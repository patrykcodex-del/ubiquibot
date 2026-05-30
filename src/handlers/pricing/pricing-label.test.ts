import { Label } from "../../types/label";
import { getConflictingLabelWarning } from "./pricing-label";

const label = (name: string) => ({ name } as Label);

describe("getConflictingLabelWarning", () => {
  it("returns null when there is only one label per pricing category", () => {
    expect(
      getConflictingLabelWarning({
        time: [label("Time: <1 Hour")],
        priority: [label("Priority: 2 (Medium)")],
      })
    ).toBeNull();
  });

  it("warns when multiple time labels are present", () => {
    expect(
      getConflictingLabelWarning({
        time: [label("Time: <1 Hour"), label("Time: <1 Day")],
        priority: [label("Priority: 2 (Medium)")],
      })
    ).toBe(
      "⚠️ Conflicting pricing labels detected: time labels (`Time: <1 Hour`, `Time: <1 Day`). Please keep only one label per category before pricing can be calculated."
    );
  });

  it("warns when multiple priority labels are present", () => {
    expect(
      getConflictingLabelWarning({
        time: [label("Time: <1 Hour")],
        priority: [label("Priority: 1 (Normal)"), label("Priority: 2 (Medium)")],
      })
    ).toBe(
      "⚠️ Conflicting pricing labels detected: priority labels (`Priority: 1 (Normal)`, `Priority: 2 (Medium)`). Please keep only one label per category before pricing can be calculated."
    );
  });
});
