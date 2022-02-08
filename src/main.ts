import * as iam from '@aws-cdk/aws-iam';
import * as servicecatalog from '@aws-cdk/aws-servicecatalog';
import * as cdk from '@aws-cdk/core';
import { envVars } from './env-vars';
import { SCProductStack } from './lib/product-stack';

export class MyStack extends cdk.Stack {
  readonly portfolio: servicecatalog.IPortfolio;
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    // define resources here...
    if (envVars.SC_PORTFOLIO_ARN != '') {
      this.portfolio = servicecatalog.Portfolio.fromPortfolioArn(this, 'MyImportedPortfolio', envVars.SC_PORTFOLIO_ARN);
    } else {
      this.portfolio = new servicecatalog.Portfolio(this, envVars.SC_PORTFOLIO_NAME, {
        displayName: envVars.SC_PORTFOLIO_NAME ?? 'DemoPortfolio',
        providerName: 'Cloud Infra TF',
        description: `Service Catalog: ${envVars.COMPANY_NAME} CDK Reference Architecture`,
        messageLanguage: servicecatalog.MessageLanguage.EN,
      });
      if ( envVars.SC_ACCESS_GROUP_NAME != '') {
        const group = iam.Group.fromGroupName(this, 'SCGroup', 'AdminMasterAccountGroup');
        this.portfolio.giveAccessToGroup(group);
      }
      if ( envVars.SC_ACCESS_ROLE_ARN != '') {
        this.portfolio.giveAccessToRole(iam.Role.fromRoleArn(this, `${envVars.SC_PORTFOLIO_NAME}-Role`, envVars.SC_ACCESS_ROLE_ARN));
      } else {
        this.portfolio.giveAccessToRole(iam.Role.fromRoleArn(this, `${envVars.SC_PORTFOLIO_NAME}AdminRole`, `arn:aws:iam::${process.env.CDK_DEPLOY_ACCOUNT}:role/AssumableAdminRole`));
      }
    }

    const tagOptionsForPortfolio = new servicecatalog.TagOptions(this, 'OrgTagOptions', {
      allowedValuesForTags: {
        stage: ['dev', 'qa', 'staging', 'production'],
      },
    });
    this.portfolio.associateTagOptions(tagOptionsForPortfolio);

    const product = new servicecatalog.CloudFormationProduct(this, 'SCProduct', {
      productName: 'static-site in s3 distribute with cloudfront',
      owner: 'Product Owner',
      description: 'Static Site With S3 and CloudFront',
      productVersions: [
        {
          productVersionName: 'v1',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new SCProductStack(this, 'SCProductStack')),
        },
      ],
    });

    this.portfolio.addProduct(product);

  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEPLOY_ACCOUNT,
  region: process.env.CDK_DEPLOY_REGION,
};

const app = new cdk.App();

new MyStack(app, `${envVars.COMPANY_NAME}-Portfolio`, {
  env: devEnv,
});
app.synth();