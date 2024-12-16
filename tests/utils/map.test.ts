import { getKeysByPropertyValue } from "../../src/utils/map";

describe("getKeysByPropertyValue", () => {
  it("should return keys for objects with matching property value", () => {
    const map = new Map([
      ["key1", { name: "Alice", age: 25 }],
      ["key2", { name: "Bob", age: 30 }],
      ["key3", { name: "Alice", age: 35 }],
    ]);
    const result = getKeysByPropertyValue(map, "name", "Alice");
    expect(result).toEqual(["key1", "key3"]);
  });

  it("should return an empty array if no matches are found", () => {
    const map = new Map([
      ["key1", { name: "Alice", age: 25 }],
      ["key2", { name: "Bob", age: 30 }],
    ]);
    const result = getKeysByPropertyValue(map, "name", "Charlie");
    expect(result).toEqual([]);
  });

  it("should handle maps with different property types", () => {
    const map = new Map([
      ["key1", { name: "Alice", age: 30 }],
      ["key2", { name: "Bob", age: "30" }], // age as string
    ]);
    const result = getKeysByPropertyValue(map, "age", 30);
    expect(result).toEqual(["key1"]);
  });

  it("should return keys for objects with undefined property value", () => {
    const map = new Map([
      ["key1", { name: "Alice", age: undefined }],
      ["key2", { name: "Bob", age: 30 }],
    ]);
    const result = getKeysByPropertyValue(map, "age", undefined);
    expect(result).toEqual(["key1"]);
  });
});
