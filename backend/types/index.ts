import { Request } from "express";
import { UserDocument } from "./models.types";

interface RequestWithUser extends Request {
    user?: any
}


export type { RequestWithUser, UserDocument }