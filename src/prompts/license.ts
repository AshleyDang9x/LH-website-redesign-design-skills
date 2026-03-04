import inquirer from "inquirer";

export interface LicensePromptAnswers {
  licenseKey: string;
}

export async function promptLicenseCredentials(): Promise<LicensePromptAnswers> {
  const answers = await inquirer.prompt<LicensePromptAnswers>([
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
