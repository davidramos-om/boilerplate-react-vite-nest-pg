import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OnboardingRequestEntity } from "src/domain/entities";
import { OnboardingRequestResolver } from "./onboarding.resolver";
import { OnboardingRequestService } from "./onboarding.service";

@Module({
    imports: [ TypeOrmModule.forFeature([ OnboardingRequestEntity ]) ],
    providers: [ OnboardingRequestResolver, OnboardingRequestService ],
    exports: [ OnboardingRequestService ]
})
export class OnboardingRequestModule { }
