import bcrypt from "bcryptjs";
import { userRepository } from "@/repositories/user.repository";
import { authRepository } from "@/repositories/auth.repository";
import { LoginInput, RegisterInput, AuthTokens } from "@/types/auth.types";
import { signAccessToken, signRefreshToken } from "@/utils/jwt";
import { generateRandomToken, hashToken } from "@/utils/helper";
import { AppError } from "@/utils/response";

const SALT_ROUNDS = 10;
const REFRESH_TOKEN_DAYS = 30;

export class AuthService {
  /** Mag-issue ug fresh access + refresh token pair para sa user */
  private async issueTokens(userId: string, email: string): Promise<AuthTokens> {
    const accessToken = signAccessToken({ userId, email });

    const rawRefreshToken = generateRandomToken();
    const tokenHash = hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

    await authRepository.storeRefreshToken(userId, tokenHash, expiresAt);

    const refreshToken = signRefreshToken({ userId, tokenId: rawRefreshToken });

    return { accessToken, refreshToken };
  }

  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError("An account with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await userRepository.create({
      fullName: input.fullName,
      email: input.email,
      password: hashedPassword,
    });

    const tokens = await this.issueTokens(user.id, user.email);

    const { password: _password, ...safeUser } = user;
    return { user: safeUser, ...tokens };
  }

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const tokens = await this.issueTokens(user.id, user.email);

    const { password: _password, ...safeUser } = user;
    return { user: safeUser, ...tokens };
  }
}

export const authService = new AuthService();