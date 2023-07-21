import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { SessionDto } from "src/domain/dtos/auth";
import { CreateOnboardingRequestInput } from 'src/domain/dtos/onboarding.dto';
import { OnboardingRequetModel } from 'src/domain/models/onboarding.model';
import { OnboardingRequestEntity } from "@entities/public/onboarding-request.entity";
import { createTemporaryPassCode } from "src/common/security/password-hasher";
import { CustomException } from "src/common/exceptions/custom.exception";
import { SYSTEM_STATUS } from "src/common/enums/status";

@Injectable()
export class OnboardingRequestService {

    constructor(
        @InjectRepository(OnboardingRequestEntity)
        private onboardingReqRepo: Repository<OnboardingRequestEntity>,
    ) { }

    async getAll(): Promise<OnboardingRequetModel[]> {
        const rows = await this.onboardingReqRepo.find();
        return rows.map(row => plainToClass(OnboardingRequetModel, row));
    }

    async getAllPending(): Promise<OnboardingRequetModel[]> {
        const rows = await this.onboardingReqRepo.find({ where: { status: Not(SYSTEM_STATUS.CLOSED) } });
        return rows.map(row => plainToClass(OnboardingRequetModel, row));
    }

    async getById(id: string): Promise<OnboardingRequetModel> {

        const row = await this.onboardingReqRepo.findOne({ where: { id } });
        return plainToClass(OnboardingRequetModel, row);
    }

    async createRequest(dto: CreateOnboardingRequestInput): Promise<OnboardingRequetModel> {

        const newRow = this.onboardingReqRepo.create(dto);
        newRow.name = `Solicitud de registro de ${dto.first_name} ${dto.last_name} `;
        newRow.code = createTemporaryPassCode().toUpperCase();
        newRow.updated_at = new Date();

        await this.onboardingReqRepo.save(newRow);

        return plainToClass(OnboardingRequetModel, newRow);
    }

    async markRequestAsRead(id: string, ssn: SessionDto): Promise<OnboardingRequetModel> {

        const row = await this.onboardingReqRepo.findOne({ where: { id, deleted: false } });
        if (!row)
            throw new CustomException(null, 'Solicitud de registro no encontrada', true);

        if (row.status === SYSTEM_STATUS.READ)
            throw new CustomException(null, 'La solicitud de registro ya ha sido leída', true);

        row.status = SYSTEM_STATUS.READ;
        row.updated_at = new Date();
        row.updated_by = ssn.userId;

        await this.onboardingReqRepo.save(row);
        return plainToClass(OnboardingRequetModel, row);
    }

    async markRequestAsClosed(id: string, ssn: SessionDto): Promise<OnboardingRequetModel> {

        const row = await this.onboardingReqRepo.findOne({ where: { id } });
        if (!row)
            throw new CustomException(null, 'Solicitud de registro no encontrada', true);

        if (row.status === SYSTEM_STATUS.CLOSED)
            throw new CustomException(null, 'La solicitud de registro ya ha sido cerrada', true);

        row.status = SYSTEM_STATUS.CLOSED;
        row.updated_at = new Date();
        row.updated_by = ssn.userId;

        await this.onboardingReqRepo.save(row);
        return plainToClass(OnboardingRequetModel, row);
    }
}