import inquirer from "inquirer";

export interface LicensePromptAnswers {
  email: string;
  purchaseToken: string;
}

export async function promptLicenseCredentials(): Promise<LicensePromptAnswers> {
  const answers = await inquirer.prompt<LicensePromptAnswers>([
    {
      type: "input",
      name: "email",
      message: "Purchase email:",
      validate: (value: string) => value.includes("@") || "Enter a valid email."
    },
    {
      type: "password",
      name: "purchaseToken",
      message: "Polar purchase token:",
      mask: "*",
      validate: (value: string) => value.trim().length > 5 || "Token is required."
    }
  ]);

  return {
    email: answers.email.trim(),
    purchaseToken: answers.purchaseToken.trim()
  };
}
