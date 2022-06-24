import { Joi } from "@docusaurus/utils-validation";
import type {
  LoadContext,
  Plugin,
  OptionValidationContext,
} from "@docusaurus/types";
import type { PluginOptions, Options } from "./options";

export default function pluginDatadogRum(
  context: LoadContext,
  { clientToken, applicationId, service, env }: PluginOptions
): Plugin {
  service = service ?? "docusaurus";
  env = env ?? process.env.NODE_ENV;

  return {
    name: "docusaurus-plugin-datadog-rum",

    injectHtmlTags() {
      if (!clientToken || !applicationId) {
        return {};
      }
      return {
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
    clientToken: '${clientToken}',
    applicationId: '${applicationId}',
    site: 'datadoghq.com',
    service: '${service}',
    env: '${env}',
    // Specify a version number to identify the deployed version of your application in Datadog 
    // version: '1.0.0',
    sampleRate: 100,
    trackInteractions: true,
  })
})`,
          },
        ],
      };
    },
  };
}

const pluginOptionsSchema = Joi.object<PluginOptions>({
  clientToken: Joi.string().required(),
  applicationId: Joi.string().required(),
  service: Joi.string().default("docusaurus"),
  env: Joi.string().default(process.env.NODE_ENV),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  return validate(pluginOptionsSchema, options);
}

export type { PluginOptions, Options };
