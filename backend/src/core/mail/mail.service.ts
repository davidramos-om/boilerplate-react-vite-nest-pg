import { Injectable } from "@nestjs/common";

import { EvaluateEmailOutgoing } from "./can-send-email";
import { TestmailService, } from "./compose/test-mail";
import { PasswordChangedEmail, PasswordChangedEmailProps } from "./compose/password-changed";
import { ResetPasswordRequest, ResetPasswordRequestProps } from "./compose/reset-password-request";
import { UserReactivated, UserReactivatedProps } from "./compose/user-reactivated";
import { UserDeactivated, UserDeactivatedProps } from "./compose/user-deactivated";
import { TenantOnboard, TenantOnboardProps } from "./compose/tenant-onboard";
import { UserOnboard, UserOnboardProps } from "./compose/user-onboard";
import { TenantDataUpdated, TenantDataUpdatedInput } from "./compose/tenant-info-updated";
import { StandarEmail, StandarEmailInput } from "./compose/generic-email";

export interface BaseEmailParams {
    to: string;
    subject: string;
    body: string;
}

@Injectable()
export class MailService {

    private readonly mailEvaluator = new EvaluateEmailOutgoing();
    private readonly testmailService = new TestmailService();
    private readonly passwordChangedEmail = new PasswordChangedEmail();
    private readonly resetPasswordRequestEmail = new ResetPasswordRequest();
    private readonly userEnabledEmail = new UserReactivated();
    private readonly userDeactivatedEmail = new UserDeactivated();
    private readonly tenantOnboardEmail = new TenantOnboard();
    private readonly userOnboardEmail = new UserOnboard();
    private readonly standartEmail = new StandarEmail();
    private readonly tenantDataUpdated = new TenantDataUpdated();

    constructor() {
    }

    private canSendEmail(to: string) {
        return this.mailEvaluator.emailOutGoingAllowed(to);
    }

    testEmail({ to, subject, body }: BaseEmailParams) {

        if (!this.canSendEmail(to))
            return Promise.resolve(false);

        return this.testmailService.sendMail({ to: to, subject, body });
    }

    passwordChange(props: PasswordChangedEmailProps) {

        if (!this.canSendEmail(props.to))
            return Promise.resolve(false);

        return this.passwordChangedEmail.sendMail(props);
    }

    resetPasswordRequest(props: ResetPasswordRequestProps) {

        if (!this.canSendEmail(props.to))
            return Promise.resolve(false);

        return this.resetPasswordRequestEmail.sendMail(props);
    }

    userEnabled(props: UserReactivatedProps) {

        if (!this.canSendEmail(props.to))
            return Promise.resolve(false);

        return this.userEnabledEmail.sendMail(props);
    }

    userDeactivated(props: UserDeactivatedProps) {

        if (!this.canSendEmail(props.to))
            return Promise.resolve(false);

        return this.userDeactivatedEmail.sendMail(props);
    }

    userOnboard(props: UserOnboardProps) {

        if (!this.canSendEmail(props.to))
            return Promise.resolve(false);

        return this.userOnboardEmail.sendMail(props);
    }

    onboardTenant(props: TenantOnboardProps) {

        if (!this.canSendEmail(props.to))
            return Promise.resolve(false);

        return this.tenantOnboardEmail.sendMail(props);
    }

    tenantInformationUpdated(props: TenantDataUpdatedInput) {

        if (!this.canSendEmail(props.to))
            return Promise.resolve(false);

        return this.tenantDataUpdated.sendMail(props);
    }

    genericEmail(props: StandarEmailInput) {

        if (!this.canSendEmail(props.to))
            return Promise.resolve(false);

        return this.standartEmail.sendMail(props);
    }
}
