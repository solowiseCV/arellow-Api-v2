"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgetPasswordService = void 0;
const prisma_1 = require("../../../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const appError_1 = require("../../../lib/appError");
const mailer_1 = require("../../../utils/mailer");
const nodemailer_1 = require("../../../utils/nodemailer");
class ForgetPasswordService {
    forgetPassword(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, isMobile } = dto;
            if (!email) {
                throw new appError_1.BadRequestError("Enter your email");
            }
            const emailLowerCase = email.toLowerCase();
            const user = yield prisma_1.Prisma.user.findUnique({
                where: { email: emailLowerCase },
            });
            if (!user) {
                throw new appError_1.UnAuthorizedError("Invalid credentials, please register");
            }
            const generatePin = () => Math.floor(1000 + Math.random() * 9000).toString();
            const resetCode = generatePin();
            const hashedResetCode = yield bcryptjs_1.default.hash(resetCode, 12);
            // Delete old reset entries for this user
            yield prisma_1.Prisma.resetPassword.deleteMany({
                where: { userId: user.id },
            });
            const now = new Date();
            const expiresAt = new Date(now);
            expiresAt.setDate(now.getDate() + 1);
            const resetEntry = yield prisma_1.Prisma.resetPassword.create({
                data: {
                    userId: user.id,
                    resetString: hashedResetCode,
                    createdAt: Math.floor(now.getTime() / 1000),
                    expiresAt: Math.floor(expiresAt.getTime() / 1000),
                },
            });
            if (!resetEntry) {
                throw new appError_1.InternalServerError("Server error, please try again");
            }
            const mailOption = yield (0, mailer_1.sendForgetPasswordMailOption)(user, resetCode);
            yield (0, nodemailer_1.nodeMailerController)(mailOption);
            return Object.assign({ resetSent: true }, (isMobile && { resetCode }));
        });
    }
}
exports.ForgetPasswordService = ForgetPasswordService;
