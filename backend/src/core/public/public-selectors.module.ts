import { Module } from "@nestjs/common";

import { ManageRBACModule } from "src/core/rbac/manage-rbac.module";
import { PublicDataSelectorsResolver } from "./public-selectors.resolver";
import { PublicDataSelectorsService } from "./public-selectors.service";

@Module({
    imports: [ ManageRBACModule ],
    providers: [
        PublicDataSelectorsResolver,
        PublicDataSelectorsService
    ],
    exports: [ PublicDataSelectorsService ]
})

export class PublicDataSelectorsModule { }
