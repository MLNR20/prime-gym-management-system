import RefreshToken, { IRefreshToken } from "../models/refreshToken";

export class RefreshTokenRepository {

  async create(admin_id: string, tokenHash: string, family: string, expiresAt: Date): Promise<IRefreshToken> {
    return RefreshToken.create({ admin: admin_id, tokenHash, family, expiresAt });
  }

  async findByHash(tokenHash: string): Promise<IRefreshToken | null> {
    return RefreshToken.findOne({ tokenHash }).exec();
  }

  // Atomically revokes a still-active token. Returns null if it was already
  // revoked, so two concurrent refreshes can't both rotate the same token.
  async revokeActive(tokenHash: string): Promise<IRefreshToken | null> {
    return RefreshToken.findOneAndUpdate(
      { tokenHash, revokedAt: { $exists: false } },
      { revokedAt: new Date() }
    ).exec();
  }

  async deleteFamily(family: string): Promise<void> {
    await RefreshToken.deleteMany({ family }).exec();
  }

  async deleteAllForAdmin(admin_id: string): Promise<void> {
    await RefreshToken.deleteMany({ admin: admin_id }).exec();
  }
}
