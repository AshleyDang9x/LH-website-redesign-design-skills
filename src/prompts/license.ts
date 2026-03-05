type InquirerModule = typeof import("inquirer");

async function loadInquirer(): Promise<InquirerModule["default"]> {
  const dynamicImport = new Function(
    "specifier",
    "return import(specifier)"
  ) as (specifier: string) => Promise<InquirerModule>;
  const inquirerModule = await dynamicImport("inquirer");
  return inquirerModule.default;
}

async function prompt<T>(questions: unknown): Promise<T> {
  const inquirer = await loadInquirer();
  return (await inquirer.prompt(questions as never)) as T;
}

export interface LicensePromptAnswers {
  licenseKey: string;
}

export async function promptLicenseCredentials(): Promise<LicensePromptAnswers> {
  const answers = await prompt<LicensePromptAnswers>([
    {
      type: "password",
      name: "licenseKey",
      message: "License key:",
      mask: "*",
      validate: (value: string) => value.trim().length > 5 || "License key is required."
    }
  ]);

  return {
    licenseKey: answers.licenseKey.trim()
  };
}
