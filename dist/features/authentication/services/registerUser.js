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
exports.AuthService = void 0;
const prisma_1 = require("../../../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const appError_1 = require("../../../lib/appError");
const mailer_1 = require("../../../utils/mailer");
const nodemailer_1 = require("../../../utils/nodemailer");
const jwt_1 = require("../../../utils/jwt");
class AuthService {
    static registerUser(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password, email, phone_number, fullname } = dto;
            const emailLower = email.toLowerCase();
            const existingUser = yield prisma_1.Prisma.user.findUnique({
                where: { email: emailLower },
            });
            if (existingUser) {
                throw new appError_1.DuplicateError("Email already exists.");
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const newUser = yield prisma_1.Prisma.user.create({
                data: {
                    username,
                    email: emailLower,
                    password: hashedPassword,
                    phone_number,
                    fullname,
                    is_verified: false,
                },
            });
            const verificationToken = (0, jwt_1.generateToken)(newUser.id, newUser.email);
            const verificationUrl = `${process.env.FRONTEND_URL_LOCAL}/verify-email?token=${verificationToken}`;
            const mailOptions = yield (0, mailer_1.emailVerificationMailOption)(newUser.email, verificationUrl);
            yield (0, nodemailer_1.nodeMailerController)(mailOptions);
            return {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                phone_number: newUser.phone_number,
                fullname: newUser.fullname,
                is_verified: newUser.is_verified,
                createdAt: newUser.createdAt,
            };
        });
    }
}
exports.AuthService = AuthService;
