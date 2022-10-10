import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { Sippycup } from "sippycup"

const sippycup = new Sippycup()

describe("Sippycup", function () {
  describe("addFile", function () {
    it("should return Error if file not added", function () {
      assert.throws(sippycup.addFile("","",""));
    });
  });
});
