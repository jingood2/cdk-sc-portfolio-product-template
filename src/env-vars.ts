//import * as chalk from 'chalk';

export const envVars = {
  REGION: process.env.REGION || 'ap-northeast-2',
  COMPANY_NAME: 'skcnc',
  SOURCE_PROVIDER: 'GITHUB',
  REPO: 'jingood2/cdk-sc-iam-product-template',
  BRANCH: 'main',
  GITHUB_TOKEN: 'atcl/jingood2/github-token',
  SC_PORTFOLIO_ARN: 'arn:aws:catalog:ap-northeast-2:037729278610:portfolio/port-5avtdoej5gehk',
  SC_PORTFOLIO_NAME: 'awstf-portfolioec2',
  SC_PRODUCT_NAME: 'product-factory',
  SC_PRODUCT_OWNER: 'SK CnC AWS TF Team',
  SC_ACCESS_GROUP_NAME: 'AdminMasterAccountGroup',
  SC_ACCESS_ROLE_ARN: '',
};

/* export function validateEnvVariables() {
  for (let variable in envVars) {
    if (!envVars[variable as keyof typeof envVars]) {
      throw Error(
        chalk.chalkStderr(`[app]: Environment variable ${variable} is not defined!`),
      );
    }
  }
} */

export const identifyResource = (resourcePrefix:string, resourceId:string)=>{
  return `${resourcePrefix}-${resourceId}`;
};