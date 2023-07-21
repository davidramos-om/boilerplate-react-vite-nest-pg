import { registerEnumType } from "@nestjs/graphql";

export enum SYSTEM_STATUS_GROUP {
    ONBOARDING = "onboarding",
    TENANT = "tenant",
    USER = "user",
    GENERAL = "general",
}

registerEnumType(SYSTEM_STATUS_GROUP, {
    name: "SYSTEM_STATUS_GROUP",
    description: "The supported group of status for different entities.",
});

export enum SYSTEM_STATUS {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DISABLED = "disabled",
    BLOCKED = "blocked",
    DELETED = "deleted",
    BANNED = "banned",
    DRAFT = "draft",
    PENDING = "pending",
    READ = "read",
    UNREAD = "unread",
    REVSION = "revision",
    SUSPENDED = "suspended",
    REJECTED = "rejected",
    PROCESSING = "processing",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    CLOSED = "closed",
    APPROVED = "approved",
}

registerEnumType(SYSTEM_STATUS, {
    name: "SYSTEM_STATUS",
    description: "The supported status for different entities.",
});
