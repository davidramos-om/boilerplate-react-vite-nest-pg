import { registerEnumType } from "@nestjs/graphql";

export enum DATE_DIFF {
    MINUTE = "minute",
    HOUR = "hour",
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year"
}
  
registerEnumType(DATE_DIFF, {
    name: "DATE_DIFF",
    description: "The supported date diff to handle mutation of dates.",
  });
  