import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";

import { UserSession, SessionDto, JwtAuthGuard, PermissionsGuard, CheckPermissions } from "src/core/authorization";
import { OnboardingRequetModel } from "src/domain/models/onboarding.model";
import { CreateOnboardingRequestInput } from "src/domain/dtos/onboarding.dto";

import { OnboardingRequestService } from "./onboarding.service";

@Resolver(() => OnboardingRequetModel)
@UseGuards(JwtAuthGuard)
export class OnboardingRequestResolver {

    constructor(
        private readonly onboardingService: OnboardingRequestService
    ) { }

    @Query(() => [ OnboardingRequetModel ])
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'READ', 'ONBOARDING' ])
    onboardingRequests(): Promise<OnboardingRequetModel[]> {
        return this.onboardingService.getAll();
    }


    @Query(() => [ OnboardingRequetModel ])
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'READ', 'ONBOARDING' ])
    onboardingRequestsOpen(): Promise<OnboardingRequetModel[]> {
        return this.onboardingService.getAllPending();
    }

    @Query(() => OnboardingRequetModel, { nullable: true })
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'READ', 'ONBOARDING' ])
    onboardingRequestById(@Args("id", { type: () => String }) id: string): Promise<OnboardingRequetModel> {
        return this.onboardingService.getById(id);
    }

    @Mutation(() => OnboardingRequetModel)
    createOnboardingRequest(@Args("input") input: CreateOnboardingRequestInput): Promise<OnboardingRequetModel> {
        return this.onboardingService.createRequest(input);
    }

    @Mutation(() => OnboardingRequetModel)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'UPDATE', 'ONBOARDING' ])
    markRequestAsRead(@Args("id", { type: () => String }) id: string, @UserSession() ssn: SessionDto): Promise<OnboardingRequetModel> {
        return this.onboardingService.markRequestAsRead(id, ssn);
    }

    @Mutation(() => OnboardingRequetModel)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'UPDATE', 'ONBOARDING' ])
    markRequestAsClosed(@Args("id", { type: () => String }) id: string, @UserSession() ssn: SessionDto): Promise<OnboardingRequetModel> {
        return this.onboardingService.markRequestAsClosed(id, ssn);
    }
}