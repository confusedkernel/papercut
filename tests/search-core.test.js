const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../assets/js/search-core.js"), "utf8");
const context = { window: { FlexSearch: require("flexsearch") } };
vm.runInNewContext(source, context);
const search = context.window.PapercutSearch;

const entries = [
  {
    title: "Body-only match",
    summary: "An ordinary summary",
    content: "The needle appears only inside this article body.",
    section: "posts",
    tags: ["writing"],
    categories: ["notes"]
  },
  {
    title: "Needle handbook",
    summary: "A direct title match",
    content: "Reference material.",
    section: "guides",
    tags: ["docs"],
    categories: ["reference"]
  },
  {
    title: "Deployment notes",
    summary: "Publish the static site.",
    content: "A guide to production deployment.",
    section: "posts",
    tags: ["docs", "deployment"],
    categories: ["guides"]
  }
];

test("searches full body text and ranks title matches first", () => {
  const results = search.search(entries, { query: "needle" });
  assert.deepEqual(results.map((entry) => entry.title), ["Needle handbook", "Body-only match"]);
});

test("requires every query word while allowing words across fields", () => {
  const results = search.search(entries, { query: "production docs" });
  assert.deepEqual(results.map((entry) => entry.title), ["Deployment notes"]);
});

test("combines type, tag, and category filters", () => {
  const results = search.search(entries, {
    query: "",
    type: "posts",
    tag: "docs",
    category: "guides"
  });
  assert.deepEqual(results.map((entry) => entry.title), ["Deployment notes"]);
});

test("collects unique filter values in alphabetical order", () => {
  assert.deepEqual(Array.from(search.collectOptions(entries, "tags")), ["deployment", "docs", "writing"]);
});
