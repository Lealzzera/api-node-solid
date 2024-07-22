import type { Environment } from "vitest";

export default <Environment>{
  name: "prisma",
  transformMode: "ssr",
  async setup() {
    console.log("setup method");

    return {
      teardown() {
        console.log("TEARDWON method");
      },
    };
  },
};
