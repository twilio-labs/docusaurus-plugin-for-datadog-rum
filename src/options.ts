export type PluginOptions = {
  clientToken: string;
  applicationId: string;
  service?: string;
  env?: string;
};

export type Options = Partial<PluginOptions>;
