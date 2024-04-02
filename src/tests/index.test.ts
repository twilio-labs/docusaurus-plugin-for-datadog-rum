import { HtmlTagObject, HtmlTags, LoadContext } from "@docusaurus/types";
import plugin, { PluginOptions } from "../index";

describe("docusaurus-plugin-for-datadog-rum", () => {
  const fakeOptions: PluginOptions = {
    clientToken: "FAKE-CLIENT-TOKEN",
    applicationId: "FAKE-APPLICATION-ID",
  };

  function getOptions(options: Partial<PluginOptions>): PluginOptions {
    return { ...fakeOptions, ...options };
  }

  let previousNodeEnv: any;

  beforeEach(() => {
    previousNodeEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env.NODE_ENV = previousNodeEnv;
  });

  function runEmptyTest(options: Partial<PluginOptions>) {
    const pluginOptions = getOptions(options);
    const result = plugin({} as unknown as LoadContext, pluginOptions);
    expect(
      result.injectHtmlTags
        ? result.injectHtmlTags({ content: null })
        : undefined
    ).toEqual({});
  }

  test("injectHtmlTags returns an empty object if clientToken is empty", () => {
    runEmptyTest({ clientToken: "" });
  });

  test("injectHtmlTags returns an empty object if applicationId is empty", () => {
    runEmptyTest({ applicationId: "" });
  });

  test("injectHtmlTags returns default values correctly when only applicationId and clientToken are provided", () => {
    const nodeEnv = "production";
    process.env.NODE_ENV = nodeEnv;

    const pluginOptions = getOptions(fakeOptions);
    const result = plugin({} as unknown as LoadContext, pluginOptions);

    expect(
      result.injectHtmlTags
        ? result.injectHtmlTags({ content: null })
        : undefined
    ).toEqual({
      headTags: [
        {
          tagName: "script",
          innerHTML: `(function(h,o,u,n,d) {
  h=h[d]=h[d]||{q:[],onReady:function(c){h.q.push(c)}}
  d=o.createElement(u);d.async=1;d.src=n
  n=o.getElementsByTagName(u)[0];n.parentNode.insertBefore(d,n)
})(window,document,'script','https://www.datadoghq-browser-agent.com/datadog-rum.js','DD_RUM')
DD_RUM.onReady(function() {
  DD_RUM.init({
    clientToken: '${pluginOptions.clientToken}',
    applicationId: '${pluginOptions.applicationId}',
    site: 'datadoghq.com',
    service: 'docusaurus',
    env: '${nodeEnv}',
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sampleRate: 100,
    trackInteractions: true,
  })
})`,
        },
      ],
    });
  });

  function runHappyTest(options: Partial<PluginOptions>) {
    const pluginOptions = getOptions(options);
    const result = plugin({} as unknown as LoadContext, pluginOptions);
    expect(
      result.injectHtmlTags
        ? result.injectHtmlTags({ content: null })
        : undefined
    ).toEqual({
      headTags: [
        {
          tagName: "script",
          innerHTML: `(function(h,o,u,n,d) {
  h=h[d]=h[d]||{q:[],onReady:function(c){h.q.push(c)}}
  d=o.createElement(u);d.async=1;d.src=n
  n=o.getElementsByTagName(u)[0];n.parentNode.insertBefore(d,n)
})(window,document,'script','https://www.datadoghq-browser-agent.com/datadog-rum.js','DD_RUM')
DD_RUM.onReady(function() {
  DD_RUM.init({
    clientToken: '${pluginOptions.clientToken}',
    applicationId: '${pluginOptions.applicationId}',
    site: '${pluginOptions.site ?? "datadoghq.com"}',
    service: '${pluginOptions.service ?? "docusaurus"}',
    env: '${pluginOptions.env ?? process.env.NODE_ENV}',
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sampleRate: 100,
    trackInteractions: true,
  })
})`,
        },
      ],
    });
  }

  test("injectHtmlTags injects the clientToken and applicationId correctly", () => {
    process.env.NODE_ENV = "production";
    runHappyTest(fakeOptions);
  });

  test("injectHtmlTags injects the service name correctly", () => {
    process.env.NODE_ENV = "production";
    runHappyTest({ service: "my-service" });
  });

  test("injectHtmlTags injects the environment name correctly", () => {
    process.env.NODE_ENV = "production";
    runHappyTest({ env: "dev" });
  });

  test("injectHtmlTags injects the site name correctly", () => {
    process.env.NODE_ENV = "production";
    runHappyTest({ site: "datadoghq.eu" });
  });
});
