import express, { application } from "express";

export const rawBodyMiddleware = express.raw({
  type: "application/json",
});
