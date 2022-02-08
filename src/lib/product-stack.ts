import * as servicecatalog from '@aws-cdk/aws-servicecatalog';
import * as cdk from '@aws-cdk/core';

export interface SCProductStackProps extends cdk.StackProps {

}

export class SCProductStack extends servicecatalog.ProductStack {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id );

  }
}